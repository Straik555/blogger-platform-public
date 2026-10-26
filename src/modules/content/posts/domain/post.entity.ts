import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { EntityId } from '../../../../core/value-objects';
import { Blog } from '../../blogs/domain/blog.entity';
import { CreatePostDomainDto } from './dto/create-post.domain.dto';
import { PostContent, PostShortDescription, PostTitle } from './value-objects';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'posts_pkey' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({
    name: 'short_description',
    type: 'varchar',
    length: 500,
  })
  shortDescription: string;

  @Column({ type: 'varchar', length: 2000 })
  content: string;

  @Column({ name: 'blog_id', type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Blog, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({ name: 'blog_id', foreignKeyConstraintName: 'blog_id' })
  blog?: Blog;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date | null;

  @VersionColumn()
  version: number;

  static createPost(dto: CreatePostDomainDto): Post {
    const post = new Post();
    post.title = PostTitle.create(dto.title).value;
    post.shortDescription = PostShortDescription.create(
      dto.shortDescription,
    ).value;
    post.content = PostContent.create(dto.content).value;
    post.blogId = EntityId.create(dto.blogId, FieldNames.BLOG_ID).value;
    return post;
  }

  updatePost(dto: Omit<CreatePostDomainDto, 'blogName'>) {
    this.blogId = EntityId.create(dto.blogId, FieldNames.BLOG_ID).value;
    this.title = PostTitle.create(dto.title).value;
    this.shortDescription = PostShortDescription.create(
      dto.shortDescription,
    ).value;
    this.content = PostContent.create(dto.content).value;
  }

  deleted() {
    if (this.deletedAt !== null) {
      const message = errorMessageHelper.isDeleted(FieldNames.POST);
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.POST,
          },
        ],
      });
    }
    this.deletedAt = new Date();
  }
}
