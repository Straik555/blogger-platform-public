import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsService } from '../services/posts.service';

export class DeletePostByIdCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeletePostByIdCommand)
export class DeletePostByIdUseCase implements ICommandHandler<DeletePostByIdCommand> {
  constructor(@Inject(PostsService) private postsService: PostsService) {}

  async execute({ id }: DeletePostByIdCommand): Promise<void> {
    const post = await this.postsService.findByIdOrNotFoundFail(id);
    post.deleted();
    await this.postsService.updateWithVersionOrFail(post);
  }
}
