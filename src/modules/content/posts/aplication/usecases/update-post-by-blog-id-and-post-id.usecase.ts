import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreatePostCommonDto } from '../../dto/create-post-common.dto';
import { PostsService } from '../services/posts.service';

export class UpdatePostByBlogIdAndPostIdCommand {
  constructor(
    public dto: CreatePostCommonDto,
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(UpdatePostByBlogIdAndPostIdCommand)
export class UpdatePostByBlogIdAndPostIdUseCase implements ICommandHandler<UpdatePostByBlogIdAndPostIdCommand> {
  constructor(private readonly postsService: PostsService) {}

  async execute({
    dto,
    blogId,
    postId,
  }: UpdatePostByBlogIdAndPostIdCommand): Promise<void> {
    const post = await this.postsService.findByBlogIdAndPostIdOrNotFoundFail(
      postId,
      blogId,
    );
    post.updatePost({ ...dto, blogId });
    await this.postsService.updateWithVersionOrFail(post);
  }
}
