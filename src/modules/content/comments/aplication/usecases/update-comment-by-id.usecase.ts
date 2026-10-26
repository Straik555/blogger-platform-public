import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsService } from '../services/comments.service';

type UpdateCommentByIdCommandType = {
  id: string;
  userId: string;
  content: string;
};

export class UpdateCommentByIdCommand {
  id: string;
  userId: string;
  content: string;
  constructor(command: UpdateCommentByIdCommandType) {
    Object.assign(this, command);
  }
}

@CommandHandler(UpdateCommentByIdCommand)
export class UpdateCommentByIdUseCase implements ICommandHandler<UpdateCommentByIdCommand> {
  constructor(private readonly commentsService: CommentsService) {}

  async execute({
    userId,
    id,
    content,
  }: UpdateCommentByIdCommand): Promise<void> {
    const comment = await this.commentsService.findByIdAndCheckOwnershipOrFail(
      id,
      userId,
    );

    comment.updateComment(content);
    await this.commentsService.updateWithVersionOrFail(comment);
  }
}
