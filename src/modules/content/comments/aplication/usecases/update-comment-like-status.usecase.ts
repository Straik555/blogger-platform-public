import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { CommentLikes } from '../../domain/comment-likes.entity';
import { CommentLikesRepository } from '../../infrastructure/comment-likes.repository';
import { CommentsService } from '../services/comments.service';

type UpdateCommentLikeStatusCommandType = {
  id: string;
  userId: string;
  status: LikeStatusEnum;
};

export class UpdateCommentLikeStatusCommand {
  public id: string;
  public userId: string;
  public status: LikeStatusEnum;
  constructor(command: UpdateCommentLikeStatusCommandType) {
    Object.assign(this, command);
  }
}

@CommandHandler(UpdateCommentLikeStatusCommand)
export class UpdateCommentLikeStatusUseCase implements ICommandHandler<UpdateCommentLikeStatusCommand> {
  constructor(
    private readonly commentLikesRepository: CommentLikesRepository,
    private readonly commentsService: CommentsService,
  ) {}
  async execute({
    userId,
    status,
    id,
  }: UpdateCommentLikeStatusCommand): Promise<void> {
    await this.commentsService.findByIdOrNotFoundFail(id);
    const likes = CommentLikes.createCommentLikes({
      userId,
      myStatus: status,
      commentId: id,
    });
    await this.commentLikesRepository.upsert(likes);
  }
}
