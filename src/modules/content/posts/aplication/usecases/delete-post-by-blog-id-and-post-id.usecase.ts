import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PostsService } from '../services/posts.service';

export class DeletePostByBlogIdAndPostIdCommand {
  constructor(
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostByBlogIdAndPostIdCommand)
export class DeletePostByBlogIdAndPostIdUseCase implements ICommandHandler<DeletePostByBlogIdAndPostIdCommand> {
  constructor(@Inject(PostsService) private postsService: PostsService) {}

  async execute({
    blogId,
    postId,
  }: DeletePostByBlogIdAndPostIdCommand): Promise<void> {
    const post = await this.postsService.findByBlogIdAndPostIdOrNotFoundFail(
      postId,
      blogId,
    );
    post.deleted();
    await this.postsService.updateWithVersionOrFail(post);
  }
}
