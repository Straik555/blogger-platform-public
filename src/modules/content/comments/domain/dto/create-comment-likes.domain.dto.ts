import { LikeStatusEnum } from '../../../../../core/types/like-status.type';

export class CreateCommentLikesDomainDto {
  commentId: string;
  userId: string;
  myStatus: LikeStatusEnum;
}
