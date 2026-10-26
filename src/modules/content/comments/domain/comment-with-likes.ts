import { LikeStatusEnum } from '../../../../core/types/like-status.type';
import { Comment } from './comment.entity';

export interface CommentWithLikes {
  comment: Comment;
  userLogin: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
}
