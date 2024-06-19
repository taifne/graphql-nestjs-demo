import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BlogsService } from './blogs.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDTO } from './dto/createBlog.dto';
import { UpdateBlogDTO } from './dto/updateBlog.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { GetBlogDto } from './dto/getBlog.dto';
import { SortDto } from './dto/sort.dto';

@Resolver((of) => Blog)
@UsePipes(new ValidationPipe({ transform: true }))
export class BlogsResolver {
  constructor(private readonly blogsService: BlogsService) {}

  @Query((returns) => [Blog], { name: 'blogs' })
  async getAllBlogs(
    @Args('getBlogDto', { nullable: true }) getBlogDto?: GetBlogDto,
    @Args('sortDto', { nullable: true }) sortDto?: SortDto,
  ): Promise<Blog[]> {
    return await this.blogsService.getAllBlogs(getBlogDto, sortDto);
  }

  @Query((returns) => Blog, { name: 'blog' })
  async getBlogById(@Args('id', { type: () => ID }) id: string): Promise<Blog> {
    return await this.blogsService.getBlogById(id);
  }

  @Mutation((returns) => Blog)
  async createBlog(@Args('createBlogDTO') createBlogDTO: CreateBlogDTO) {
    return await this.blogsService.createBlog(createBlogDTO);
  }

  @Mutation((returns) => Blog)
  async updateBlog(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBlogDto', { nullable: true }) updateBlogDto?: UpdateBlogDTO,
  ): Promise<Blog> {
    return await this.blogsService.updateBlog(id, updateBlogDto);
  }

  @Mutation((returns) => Blog)
  async removeBlog(@Args('id', { type: () => ID }) id: string): Promise<Blog> {
    return await this.blogsService.removeBlog(id);
  }
}
