import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';

import { BlogsExternalService } from '../../../blogs/aplication/external/blogs.external-service';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { Post } from '../../domain/post.entity';
import { CreatePostDto } from '../../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostLikesInfoBuilderService } from '../services/post-likes-info-builder.service';
import { PostWithLikesFinderService } from '../services/post-with-likes-finder.service';

export class CreatePostCommand {
  constructor(public dto: CreatePostDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly blogsExternalService: BlogsExternalService,
    private readonly postsRepository: PostsRepository,
    private readonly postLikesInfoBuilderService: PostLikesInfoBuilderService,
    private readonly postWithLikesFinderService: PostWithLikesFinderService,
  ) {}
  async execute({ dto }: CreatePostCommand): Promise<PostViewDto> {
    const post = await this.dataSource.transaction(async (manager) => {
      await this.blogsExternalService.findByIdForShare(dto.blogId, manager);

      const newPost = Post.createPost(dto);
      return await this.postsRepository.create(newPost, manager);
    });

    const [postInfo, newestLikes] = await Promise.all([
      this.postWithLikesFinderService.findByIdOrNotFoundFail(post.id, null),
      this.postLikesInfoBuilderService.build(post.id),
    ]);
    return PostViewDto.mapToView(postInfo, newestLikes);
  }
}
