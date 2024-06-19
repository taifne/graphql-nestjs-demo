import { Field, InputType } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';

@InputType()
export class GetBlogDto {
  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  author?: string;

  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title?: string;

  @Field({ nullable: true })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description?: string;
}
