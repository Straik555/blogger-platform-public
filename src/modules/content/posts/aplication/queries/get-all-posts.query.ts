import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsQueryParams } from '../../api/input-dto/posts-query-params.input-dto';
import { NewestLikesViewDto } from '../../api/view-dto/newest-likes.view-dto';
import { PostViewDto } from '../../api/view-dto/post.view-dto';
import { PostsQueryRepository } from '../../infrastructure/query/posts-query.repository';
import { PostNewestLikesGroupingService } from '../services/post-newest-likes-grouping.service';

export class GetAllPostsQuery {
  constructor(
    public query: PostsQueryParams,
    public userId: string | null,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler implements IQueryHandler<GetAllPostsQuery> {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postNewestLikesGroupingService: PostNewestLikesGroupingService,
  ) {}
  async execute({
    query,
    userId,
  }: GetAllPostsQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    const { page, totalCount, size, data } =
      await this.postsQueryRepository.findAll(query, userId);
    const postsIds: string[] = data.map((p): string => p.post.id);

    const newestLikes =
      await this.postNewestLikesGroupingService.groupByPostIds(postsIds);

    const items = data.map((p) =>
      PostViewDto.mapToView(
        p,
        NewestLikesViewDto.mapToNewestLikes(newestLikes.get(p.post.id) || []),
      ),
    );
    return PaginatedViewDto.mapToView({
      page,
      items,
      size,
      totalCount,
    });
  }
}
