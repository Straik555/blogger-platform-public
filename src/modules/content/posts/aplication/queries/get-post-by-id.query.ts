import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostLikesInfoBuilderService } from '../services/post-likes-info-builder.service';
import { PostWithLikesFinderService } from '../services/post-with-likes-finder.service';

export class GetPostByIdQuery {
  constructor(
    public postId: string,
    public userId: string | null,
  ) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler<GetPostByIdQuery> {
  constructor(
    private readonly postWithLikesFinderService: PostWithLikesFinderService,
    private readonly postLikesInfoBuilderService: PostLikesInfoBuilderService,
  ) {}
  async execute({ postId, userId }: GetPostByIdQuery): Promise<PostViewDto> {
    const [postInfo, newestLikes] = await Promise.all([
      this.postWithLikesFinderService.findByIdOrNotFoundFail(postId, userId),
      this.postLikesInfoBuilderService.build(postId),
    ]);
    return PostViewDto.mapToView(postInfo, newestLikes);
  }
}
