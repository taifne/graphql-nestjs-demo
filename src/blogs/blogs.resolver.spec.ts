import { Test, TestingModule } from '@nestjs/testing';
import { BlogsResolver } from './blogs.resolver';
import { BlogsService } from './blogs.service';
import { blog, createBlogDto } from './__mock__/users';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { GetBlogDto } from './dto/getBlog.dto';
import { SortDto } from './dto/sort.dto';
import { randomUUID } from 'crypto';
import { Blog } from './entities/blog.entity';
import { UpdateBlogDTO } from './dto/updateBlog.dto';

describe('BlogsResolver', () => {
  let resolver: BlogsResolver;
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsResolver,
        {
          provide: BlogsService,
          useValue: {
            getAllBlogs: jest.fn(),
            getBlogById: jest.fn(),
            createBlog: jest.fn(),
            updateBlog: jest.fn(),
            removeBlog: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<BlogsResolver>(BlogsResolver);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
  describe('Query', () => {
    describe('Search blogs', () => {
      it("should return all blogs when there's no param", async () => {
        jest.spyOn(service, 'getAllBlogs').mockResolvedValue([blog]);
        const result = await resolver.getAllBlogs();
        expect(service.getAllBlogs).toHaveBeenCalledWith(undefined, undefined);
        expect(result).toEqual([blog]);
      });
      it("should return not found when there's no post", async () => {
        jest
          .spyOn(service, 'getAllBlogs')
          .mockRejectedValue(new NotFoundException('Blog not found'));
        await expect(service.getAllBlogs(undefined, undefined)).rejects.toThrow(
          NotFoundException,
        );
        expect(service.getAllBlogs).toHaveBeenCalledWith(undefined, undefined);
      });
      it('should return blogs filtered by author', async () => {
        const getBlogDto: GetBlogDto = { author: 'ha' };
        jest.spyOn(service, 'getAllBlogs').mockResolvedValue([blog]);
        const result = await resolver.getAllBlogs(getBlogDto, undefined);
        expect(service.getAllBlogs).toHaveBeenCalledWith(getBlogDto, undefined);
        expect(result).toEqual([blog]);
      });
      it('should return not found when author does not have any post', async () => {
        const getBlogDto: GetBlogDto = { author: 'harry' };
        jest
          .spyOn(service, 'getAllBlogs')
          .mockRejectedValue(new NotFoundException('Blog not found'));
        await expect(resolver.getAllBlogs(getBlogDto)).rejects.toThrow(
          new NotFoundException('Blog not found'),
        );
        expect(service.getAllBlogs).toHaveBeenCalledWith(getBlogDto, undefined);
      });
      it('should return sorted list in descending order of title', async () => {
        const sortDto: SortDto = { sortField: 'title', orderBy: 'desc' };
        jest.spyOn(service, 'getAllBlogs').mockResolvedValue([blog]);
        const result = await resolver.getAllBlogs(undefined, sortDto);
        expect(service.getAllBlogs).toHaveBeenCalledWith(undefined, sortDto);
        expect(result).toEqual([blog]);
      });
      it('should return error when sort field not exist', async () => {
        const sortDto: SortDto = {
          sortField: 'nonExistField',
          orderBy: 'desc',
        };
        jest
          .spyOn(service, 'getAllBlogs')
          .mockRejectedValue(new BadRequestException());
        await expect(resolver.getAllBlogs(undefined, sortDto)).rejects.toThrow(
          BadRequestException,
        );
        expect(service.getAllBlogs).toHaveBeenCalledWith(undefined, sortDto);
      });
    });
    describe('Search blog by ID', () => {
      it('should return a record that matches ID', async () => {
        const id: string = 'd29a0e30-ffef-4b7b-8831-2844dba52db9';
        jest.spyOn(service, 'getBlogById').mockResolvedValue(blog);
        const result = await resolver.getBlogById(id);
        expect(service.getBlogById).toHaveBeenCalledWith(id);
        expect(result).toEqual(blog);
      });
      it("should return not found when there's no record matching", async () => {
        const id: string = 'd29a0e30-ffef-4b7b-8831-2844dba52dc1';
        jest
          .spyOn(service, 'getBlogById')
          .mockRejectedValue(new NotFoundException('Blog not found'));
        await expect(resolver.getBlogById(id)).rejects.toThrow(
          new NotFoundException('Blog not found'),
        );
        expect(service.getBlogById).toHaveBeenCalledWith(id);
      });
      it('should return error when id has wrong format', async () => {
        const id: string = 'dddddd';
        jest
          .spyOn(service, 'getBlogById')
          .mockRejectedValue(new BadRequestException('Invalid ID'));
        await expect(resolver.getBlogById(id)).rejects.toThrow(
          new BadRequestException('Invalid ID'),
        );
        expect(service.getBlogById).toHaveBeenCalledWith(id);
      });
    });
  });
  describe('Mutation', () => {
    describe('Create blog', () => {
      it('should create a new blog', async () => {
        const mockUUID = randomUUID();
        const returnVal: Blog = {
          id: mockUUID,
          ...createBlogDto,
          createdDate: new Date('2024-04-16T06:59:10.754Z'),
          updatedDate: new Date('2024-04-16T06:59:10.754Z'),
        };
        jest.spyOn(service, 'createBlog').mockResolvedValue(returnVal);
        const result = await resolver.createBlog(createBlogDto);
        expect(service.createBlog).toHaveBeenCalledWith(createBlogDto);
        expect(result).toEqual(returnVal);
      });
      it('should return error when received empty title', async () => {
        jest
          .spyOn(service, 'createBlog')
          .mockRejectedValue(new BadRequestException('Title cannot be empty'));
        await expect(
          resolver.createBlog({ ...createBlogDto, title: '' }),
        ).rejects.toThrow(new BadRequestException('Title cannot be empty'));
        expect(service.createBlog).toHaveBeenCalledWith({
          ...createBlogDto,
          title: '',
        });
      });
      it('should create a new blog with author is Unknown when author not provided', async () => {
        const mockUUID = randomUUID();
        const returnVal: Blog = {
          id: mockUUID,
          ...createBlogDto,
          createdDate: new Date('2024-04-16T06:59:10.754Z'),
          updatedDate: new Date('2024-04-16T06:59:10.754Z'),
          author: 'Unknown',
        };
        jest.spyOn(service, 'createBlog').mockResolvedValue(returnVal);
        const result = await resolver.createBlog({
          ...createBlogDto,
          author: '',
        });
        expect(service.createBlog).toHaveBeenCalledWith({
          ...createBlogDto,
          author: '',
        });
        expect(result).toEqual(returnVal);
      });
    });
    describe('Update blog', () => {
      it('should update existing blog', async () => {
        const id: string = 'd29a0e30-ffef-4b7b-8831-2844dba52db9';
        const updateDto: UpdateBlogDTO = { author: 'Unknown' };
        jest
          .spyOn(service, 'updateBlog')
          .mockResolvedValue({ ...blog, ...updateDto });
        const result = await resolver.updateBlog(id, updateDto);
        expect(service.updateBlog).toHaveBeenCalledWith(id, updateDto);
        expect(result).toHaveProperty('author', updateDto.author);
      });
    });
    describe('Remove blog', () => {
      it('should remove a blog', async () => {
        const id: string = 'd29a0e30-ffef-4b7b-8831-2844dba52db9';
        jest.spyOn(service, 'removeBlog').mockResolvedValue(blog);
        const result = await resolver.removeBlog(id);
        expect(service.removeBlog).toHaveBeenCalledWith(id);
        expect(result).toEqual(blog);
      });
      it('should return error when blog to be deleted not found', async () => {
        const id: string = 'd29a0e30-ffef-4b7b-8831-2844dba52dc8';
        jest
          .spyOn(service, 'removeBlog')
          .mockRejectedValue(new NotFoundException('Blog not found'));
        await expect(resolver.removeBlog(id)).rejects.toThrow(
          new NotFoundException('Blog not found'),
        );
        expect(service.removeBlog).toHaveBeenCalledWith(id);
      });
    });
  });
});
