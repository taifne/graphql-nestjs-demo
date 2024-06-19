import { InputType, Field } from '@nestjs/graphql';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

@InputType()
export class CreateBlogDTO {
  @Field()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'Input is empty' })
  @IsString()
  title: string;

  @Field()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty({ message: 'Empty description input' })
  @IsString({ message: 'Input must be a string' })
  @MinLength(10, { message: 'Description must have at least 10 characters' })
  description: string;

  @Field({ defaultValue: 'Unknown' })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString({ message: 'Input must be a string' })
  author: string;

  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    value?.trim() ? value?.trim() : null,
  )
  @ValidateIf((value) => value !== null, { always: true })
  @IsEmail({}, { message: 'Invalid email' })
  email?: string | null;
}
