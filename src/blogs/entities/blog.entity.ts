import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'blogs' })
@ObjectType()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'varchar', length: 200 })
  @Field()
  title: string;

  @Column('text')
  @Field()
  description: string;

  @Column({ type: 'varchar', length: 100, default: 'Unknown' })
  @Field({ defaultValue: 'Unknown' })
  author: string;

  @Column({ type: 'varchar', length: 62, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @CreateDateColumn()
  @Field()
  createdDate: Date;

  @UpdateDateColumn()
  @Field()
  updatedDate: Date;
}
