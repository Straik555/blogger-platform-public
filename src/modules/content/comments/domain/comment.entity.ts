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
import { EntityId } from '../../../../core/value-objects';
import { User } from '../../../users/domain/user.entity';
import { Post } from '../../posts/domain/post.entity';
import { CreateCommentDomainDto } from './dto/create-comment.domain.dto';
import { CommentContent } from './value-objects/comment-content';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'comments_pkey' })
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'user_id' })
  user?: User;

  @Column({ name: 'post_id', type: 'uuid' })
  postId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'post_id', foreignKeyConstraintName: 'post_id' })
  post?: Post;

  @Column({ name: 'content', type: 'varchar', length: 1500 })
  content: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @VersionColumn({ default: 1 })
  version: number;

  static createComment(dto: CreateCommentDomainDto): Comment {
    const comment: Comment = new Comment();

    comment.userId = EntityId.create(dto.userId, FieldNames.USER_ID).value;
    comment.postId = EntityId.create(dto.postId, FieldNames.POST_ID).value;
    comment.content = CommentContent.create(dto.content).value;

    return comment;
  }

  updateComment(newContent: string) {
    this.content = CommentContent.create(newContent).value;
  }
}
