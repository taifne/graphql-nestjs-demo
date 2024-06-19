import { Field, InputType } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, Matches } from 'class-validator';

@InputType()
export class SortDto {
  @Field()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
  @Matches(/^(title|description|author)$/, {
    message: 'Input must be among these: "title", "description", "author"',
  })
  sortField: string;

  @Field({ defaultValue: 'asc' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim().toLowerCase())
  @Matches(/^(asc|desc)$/, {
    message: 'Input must be either "asc" or "desc"',
  })
  orderBy: string;
}
