import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsQueryParams } from '../../../posts/api/input-dto/posts-query-params.input-dto';
import { NewestLikesViewDto } from '../../../posts/api/view-dto/newest-likes.view-dto';
import { PostViewDto } from '../../../posts/api/view-dto/post.view-dto';
import { PostNewestLikesGroupingService } from '../../../posts/aplication/services/post-newest-likes-grouping.service';
import { PostsQueryRepository } from '../../../posts/infrastructure/query/posts-query.repository';
import { BlogsService } from '../services/blogs.service';

type GetPostsByBlogIdQueryType = {
  query: PostsQueryParams;
  blogId: string;
  userId: string | null;
};

export class GetPostsByBlogIdQuery {
  public query: PostsQueryParams;
  public blogId: string;
  public userId: string | null;
  constructor(command: GetPostsByBlogIdQueryType) {
    Object.assign(this, command);
  }
}

@QueryHandler(GetPostsByBlogIdQuery)
export class GetPostsByBlogIdQueryHandler implements IQueryHandler<GetPostsByBlogIdQuery> {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly postNewestLikesGroupingService: PostNewestLikesGroupingService,
  ) {}
  async execute({
    blogId,
    query,
    userId,
  }: GetPostsByBlogIdQuery): Promise<PaginatedViewDto<PostViewDto[]>> {
    const [, postsData] = await Promise.all([
      this.blogsService.findByIdOrNotFoundFail(blogId),
      this.postsQueryRepository.findAll(query, userId, blogId),
    ]);

    const postsIds: string[] = postsData.data.map((p): string => p.post.id);

    const newestLikes =
      await this.postNewestLikesGroupingService.groupByPostIds(postsIds);

    const items = postsData.data.map((p) =>
      PostViewDto.mapToView(
        p,
        NewestLikesViewDto.mapToNewestLikes(newestLikes.get(p.post.id) || []),
      ),
    );
    return PaginatedViewDto.mapToView({
      items: items,
      page: postsData.page,
      size: postsData.size,
      totalCount: postsData.totalCount,
    });
  }
}
