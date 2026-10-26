import { LikeStatusEnum } from '../../../../core/types/like-status.type';
import { Post } from './post.entity';

export interface PostWithLikes {
  post: Post;
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusEnum;
}
