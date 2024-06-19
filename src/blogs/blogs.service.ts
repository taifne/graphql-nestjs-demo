import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { FindOperator, ILike, Repository } from 'typeorm';
import { CreateBlogDTO } from './dto/createBlog.dto';
import { UpdateBlogDTO } from './dto/updateBlog.dto';
import { GetBlogDto } from './dto/getBlog.dto';
import { SortDto } from './dto/sort.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
  ) {}

  async getAllBlogs(
    getBlogDto?: GetBlogDto,
    sortDto?: SortDto,
  ): Promise<Blog[]> {
    const findOptions: {
      author?: FindOperator<string>;
      title?: FindOperator<string>;
      description?: FindOperator<string>;
    } = {};

    if (getBlogDto?.author) {
      findOptions.author = ILike(`%${getBlogDto.author}%`);
    }
    if (getBlogDto?.title) findOptions.title = ILike(`%${getBlogDto.title}%`);
    if (getBlogDto?.description)
      findOptions.description = ILike(`%${getBlogDto.description}%`);

    const blog = await this.blogsRepository.find({
      where: findOptions,
      order: { [sortDto?.sortField]: sortDto?.orderBy },
    });
    if (!blog || blog.length === 0) {
      throw new NotFoundException(`Blog not found`);
    }
    return blog;
  }

  async getBlogById(id: string): Promise<Blog> {
    const blog = await this.blogsRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return blog;
  }

  async createBlog(createBlogDto: CreateBlogDTO): Promise<Blog> {
    if (createBlogDto.author === '') {
      createBlogDto.author = 'Unknown';
    }
    if (createBlogDto.email === '') {
      createBlogDto.email = null;
    }
    const blog = this.blogsRepository.create(createBlogDto);
    return await this.blogsRepository.save(blog);
  }

  async updateBlog(id: string, updateBlogDto?: UpdateBlogDTO): Promise<Blog> {
    await this.getBlogById(id);
    if (updateBlogDto.author === '') {
      updateBlogDto.author = 'Unknown';
    }
    return await this.blogsRepository.save({
      id,
      ...updateBlogDto,
    });
  }

  async removeBlog(id: string): Promise<Blog> {
    const blogTodelete = await this.getBlogById(id);
    await this.blogsRepository.delete({ id });
    return blogTodelete;
  }
}
