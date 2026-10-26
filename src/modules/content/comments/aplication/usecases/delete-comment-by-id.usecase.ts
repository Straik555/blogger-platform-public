import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsService } from '../services/comments.service';

export class DeleteCommentByIdCommand {
  constructor(
    public id: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdUseCase implements ICommandHandler<DeleteCommentByIdCommand> {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly commentsService: CommentsService,
  ) {}
  async execute({ id, userId }: DeleteCommentByIdCommand): Promise<void> {
    await this.commentsService.findByIdAndCheckOwnershipOrFail(id, userId);
    await this.commentsRepository.deleteById(id);
  }
}
