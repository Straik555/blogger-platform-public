import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeStatusEnum } from '../../../../../core/types/like-status.type';
import { UsersExternalService } from '../../../../users/application/external/users.external-service';
import { PostsExternalService } from '../../../posts/aplication/external/posts.external-service';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { Comment } from '../../domain/comment.entity';
import { MutateCommentDto } from '../../dto/mutate-comment.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';

type CreateCommentCommandType = {
  dto: MutateCommentDto;
  postId: string;
  userId: string;
};

export class CreateCommentCommand {
  dto: MutateCommentDto;
  postId: string;
  userId: string;
  constructor(command: CreateCommentCommandType) {
    Object.assign(this, command);
  }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsExternalService: PostsExternalService,
    private readonly usersExternalService: UsersExternalService,
  ) {}
  async execute({
    dto,
    userId,
    postId,
  }: CreateCommentCommand): Promise<CommentViewDto> {
    const [, user] = await Promise.all([
      this.postsExternalService.findByPostId(postId),
      this.usersExternalService.findByUserId(userId),
    ]);
    const newComment = Comment.createComment({
      content: dto.content,
      postId,
      userId,
    });
    const comment = await this.commentsRepository.create(newComment);
    return CommentViewDto.mapToView({
      comment,
      userLogin: user.login,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
    });
  }
}
