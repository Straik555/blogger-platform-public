import { LikeStatusEnum } from '../../../../../core/types/like-status.type';

export class CreatePostLikesDomainDto {
  userId: string;
  status: LikeStatusEnum;
  postId: string;
}
