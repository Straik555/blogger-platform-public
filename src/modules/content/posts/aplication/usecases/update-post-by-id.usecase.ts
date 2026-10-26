import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { BlogsExternalService } from '../../../blogs/aplication/external/blogs.external-service';
import { CreatePostDto } from '../../dto/create-post.dto';
import { PostsService } from '../services/posts.service';

export class UpdatePostByIdCommand {
  constructor(
    public dto: CreatePostDto,
    public postId: string,
  ) {}
}

@CommandHandler(UpdatePostByIdCommand)
export class UpdatePostByIdUseCase implements ICommandHandler<UpdatePostByIdCommand> {
  constructor(
    @Inject(PostsService)
    private readonly postsService: PostsService,
    @Inject(BlogsExternalService)
    private readonly blogsExternalService: BlogsExternalService,
  ) {}

  async execute({ postId, dto }: UpdatePostByIdCommand): Promise<void> {
    const [, post] = await Promise.all([
      this.blogsExternalService.findByBlogId(dto.blogId),
      this.postsService.findByIdOrNotFoundFail(postId),
    ]);
    post.updatePost(dto);
    await this.postsService.updateWithVersionOrFail(post);
  }
}
