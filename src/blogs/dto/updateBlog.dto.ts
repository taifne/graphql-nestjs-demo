import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBlogDTO } from './createBlog.dto';

@InputType()
export class UpdateBlogDTO extends PartialType(CreateBlogDTO) {}
