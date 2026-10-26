import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { UsersExternalService } from '../../../../users/application/external/users.external-service';
import { PostLikes } from '../../domain/post-likes.entity';
import { PostLikesRepository } from '../../infrastructure/post-likes.repository';
import { PostsService } from '../services/posts.service';

type UpdatePostLikeStatusType = {
  postId: string;
  userId: string;
  status: LikeStatusEnum;
};

export class UpdatePostLikeStatusCommand {
  public postId: string;
  public userId: string;
  public status: LikeStatusEnum;
  constructor(command: UpdatePostLikeStatusType) {
    Object.assign(this, command);
  }
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler<UpdatePostLikeStatusCommand> {
  constructor(
    private readonly postsService: PostsService,
    private readonly postLikesRepository: PostLikesRepository,
    private readonly usersExternalService: UsersExternalService,
  ) {}

  async execute({
    userId,
    status,
    postId,
  }: UpdatePostLikeStatusCommand): Promise<void> {
    const [, , postLikes] = await Promise.all([
      this.postsService.findByIdOrNotFoundFail(postId),
      this.usersExternalService.findByUserId(userId),
      this.postLikesRepository.findByPostIdAndUserId(postId, userId),
    ]);
    if (!postLikes) {
      const newPostLike = PostLikes.createPostLikes({
        userId,
        postId,
        status,
      });
      await this.postLikesRepository.create(newPostLike);
    } else {
      postLikes.updateStatus(status);
      await this.postLikesRepository.update(postLikes);
    }
  }
}
