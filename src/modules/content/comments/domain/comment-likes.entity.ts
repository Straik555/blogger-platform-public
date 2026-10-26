import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { LikeStatusEnum } from '../../../../core/types/like-status.type';
import { EntityId, LikeStatus } from '../../../../core/value-objects';
import { User } from '../../../users/domain/user.entity';
import { Comment } from './comment.entity';
import { CreateCommentLikesDomainDto } from './dto/create-comment-likes.domain.dto';

@Entity('comment_likes')
@Unique('comment_id_user_id_unique', ['commentId', 'userId'])
@Check(
  'status',
  `"status" IN ('${LikeStatusEnum.Like}', '${LikeStatusEnum.Dislike}', '${LikeStatusEnum.None}')`,
)
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'comment_likes_pkey',
  })
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'user_id' })
  user?: User;

  @Column({ name: 'comment_id', type: 'uuid' })
  commentId: string;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'comment_id', foreignKeyConstraintName: 'comment_id' })
  comment?: Comment;

  @Column({ type: 'varchar' })
  status: LikeStatusEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  static createCommentLikes(dto: CreateCommentLikesDomainDto): CommentLikes {
    const likes = new CommentLikes();
    likes.status = LikeStatus.create(dto.myStatus).value;
    likes.commentId = EntityId.create(
      dto.commentId,
      FieldNames.COMMENT_ID,
    ).value;
    likes.userId = EntityId.create(dto.userId, FieldNames.USER_ID).value;

    return likes;
  }
}
