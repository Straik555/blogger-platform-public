import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { PostsService } from '../../../posts/aplication/services/posts.service';
import { CommentsQueryPrams } from '../../api/input-dto/comments-query-prams.input-dto';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentWithLikes } from '../../domain/comment-with-likes';
import { CommentsQueryRepository } from '../../infrastructure/query/comments-query.repository';

type GetAllCommentsByPostIdQueryType = {
  query: CommentsQueryPrams;
  postId: string;
  userId: string | null;
};

export class GetAllCommentsByPostIdQuery {
  query: CommentsQueryPrams;
  postId: string;
  userId: string | null;
  constructor(command: GetAllCommentsByPostIdQueryType) {
    Object.assign(this, command);
  }
}

@QueryHandler(GetAllCommentsByPostIdQuery)
export class GetAllCommentsByPostByIdQueryHandler implements IQueryHandler<GetAllCommentsByPostIdQuery> {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsService: PostsService,
  ) {}

  async execute({ postId, query, userId }: GetAllCommentsByPostIdQuery) {
    const [, { totalCount, page, size, data }] = await Promise.all([
      this.postsService.findByIdOrNotFoundFail(postId),
      this.commentsQueryRepository.findAll(query, postId, userId),
    ]);

    const items = data.map((comment: CommentWithLikes) =>
      CommentViewDto.mapToView(comment),
    );

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      size,
      page,
    });
  }
}
