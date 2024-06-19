import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { blog, id } from './__mock__/users';
import { GetBlogDto } from './dto/getBlog.dto';
import { NotFoundException } from '@nestjs/common';
import { ILike } from 'typeorm';
import { CreateBlogDTO } from './dto/createBlog.dto';
import { UpdateBlogDTO } from './dto/updateBlog.dto';

describe('BlogsService', () => {
  let service: BlogsService;
  let repository: Repository<Blog>;

  const BLOG_REPO_TOKEN = getRepositoryToken(Blog);

  const mockBlogsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: BLOG_REPO_TOKEN,
          useValue: mockBlogsRepository,
        },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
    repository = module.get<Repository<Blog>>(BLOG_REPO_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Blog repository', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });
  describe('getAllBlogs', () => {
    it('should return list of all blogs', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([blog]);
      const result = await service.getAllBlogs();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual([blog]);
    });
    it('should return list of all blogs by title', async () => {
      const getDto: GetBlogDto = { title: 'system' };
      jest.spyOn(repository, 'find').mockResolvedValue([blog]);
      const result = await service.getAllBlogs(getDto);
      expect(repository.find).toHaveBeenCalledWith({
        where: { title: ILike(`%${getDto.title}%`) },
        order: {},
      });
      expect(result).toEqual([blog]);
    });
    it('should return list of all blogs by author', async () => {
      const getDto: GetBlogDto = { author: 'ha' };
      jest.spyOn(repository, 'find').mockResolvedValue([blog]);
      const result = await service.getAllBlogs(getDto);
      expect(repository.find).toHaveBeenCalledWith({
        where: { author: ILike(`%${getDto.author}%`) },
        order: {},
      });
      expect(result).toEqual([blog]);
    });
    it('should return list of all blogs by description', async () => {
      const getDto: GetBlogDto = { description: 'initial' };
      jest.spyOn(repository, 'find').mockResolvedValue([blog]);
      const result = await service.getAllBlogs(getDto);
      expect(repository.find).toHaveBeenCalledWith({
        where: { description: ILike(`%${getDto.description}%`) },
        order: {},
      });
      expect(result).toEqual([blog]);
    });
    it('should return error if no blog found', async () => {
      jest.spyOn(repository, 'find').mockReturnValue(null);
      await expect(service.getAllBlogs()).rejects.toThrow(NotFoundException);
      expect(repository.find).toHaveBeenCalled();
    });
  });
  describe('getBlogById', () => {
    it('should return a blog that matches ID', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(blog);
      const result = await service.getBlogById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(blog);
    });
    it('should return error if no blog matches id', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(null);
      await expect(service.getBlogById(id)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });
  describe('createBlog', () => {
    it('should create with correct params', async () => {
      const createDto = {
        title: 'Hello World',
        description: 'An introduction to programming.',
        author: 'Thomas Lee',
      };
      await service.createBlog(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
    it('should convert author and email to Unknown and null, respsectively if received empty inputs for those', async () => {
      const createDto = {
        title: 'Hello World',
        description: 'An introduction to programming.',
        author: '',
        email: '',
      };
      await service.createBlog(createDto);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        author: 'Unknown',
        email: null,
      });
    });
    it('should save a blog and return it', async () => {
      const createDto: CreateBlogDTO = {
        title: 'System Design',
        description:
          'Initial guide to design a scalable and maintainable system.',
        author: 'Harrick',
      };
      jest.spyOn(repository, 'save').mockResolvedValue(blog);
      const result = await service.createBlog(createDto);
      expect(result).toEqual(blog);
    });
  });
  describe('updateBlog', () => {
    it('should update existing blog and return it', async () => {
      const updateDto: UpdateBlogDTO = { author: 'Unknown' };
      jest.spyOn(service, 'getBlogById').mockResolvedValue(blog);
      jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ ...blog, ...updateDto });
      const result = await service.updateBlog(id, updateDto);
      expect(repository.save).toHaveBeenCalledWith({ id, ...updateDto });
      expect(result).toEqual({ ...blog, ...updateDto });
    });
    it('should return error if not blog found', async () => {
      jest
        .spyOn(service, 'getBlogById')
        .mockRejectedValue(new NotFoundException());
      await expect(service.updateBlog(id)).rejects.toThrow(NotFoundException);
    });
  });
  describe('removeBlog', () => {
    it('should remove and return that blog', async () => {
      jest.spyOn(service, 'getBlogById').mockResolvedValue(blog);
      const result = await service.removeBlog(id);
      expect(repository.delete).toHaveBeenCalledWith({ id });
      expect(result).toEqual(blog);
    });
    it('should return error if not blog found', async () => {
      jest
        .spyOn(service, 'getBlogById')
        .mockRejectedValue(new NotFoundException());
      await expect(service.updateBlog(id)).rejects.toThrow(NotFoundException);
    });
  });
});
