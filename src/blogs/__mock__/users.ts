import { CreateBlogDTO } from '../dto/createBlog.dto';
import { Blog } from '../entities/blog.entity';

export const blog: Blog = {
  id: 'd29a0e30-ffef-4b7b-8831-2844dba52db9',
  title: 'System Design',
  description: 'Initial guide to design a scalable and maintainable system.',
  author: 'Harrick',
  createdDate: new Date('2024-04-16T06:59:10.754Z'),
  updatedDate: new Date('2024-04-16T06:59:10.754Z'),
};

export const createBlogDto: CreateBlogDTO = {
  title: 'The 4th Industrial Evolution',
  description:
    "Have you ever wondered how our world transitions from the 3rd to 4th industrial evolutions. Let's explore",
  author: 'Maric Katina',
};

export const id = 'd29a0e30-ffef-4b7b-8831-2844dba52db9';
