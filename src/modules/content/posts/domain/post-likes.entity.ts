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
import { CreatePostLikesDomainDto } from './dto/create-post-likes.domain.dto';
import { Post } from './post.entity';

@Entity('post_likes')
@Unique('post_id_user_id_unique', ['postId', 'userId'])
@Check(
  'status',
  `"status" IN ('${LikeStatusEnum.Like}', '${LikeStatusEnum.Dislike}', '${LikeStatusEnum.None}')`,
)
export class PostLikes {
  @PrimaryGeneratedColumn('uuid', {
    primaryKeyConstraintName: 'post_likes_pkey',
  })
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

  @Column({ type: 'varchar' })
  status: LikeStatusEnum;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  static createPostLikes(likes: CreatePostLikesDomainDto): PostLikes {
    const dto = new PostLikes();
    dto.userId = EntityId.create(likes.userId, FieldNames.USER_ID).value;
    dto.status = LikeStatus.create(likes.status).value;
    dto.postId = EntityId.create(likes.postId, FieldNames.POST_ID).value;

    return dto;
  }
  updateStatus(status: LikeStatusEnum) {
    this.status = status;
  }
}
