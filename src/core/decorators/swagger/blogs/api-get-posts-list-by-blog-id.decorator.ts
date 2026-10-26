import { PostSortField } from '../../../../modules/content/posts/api/input-dto/post-sort-field.type';
import { ApiPaginatedList } from '../common/api-paginated-query-params.decorator';
import { PaginatedPostsByBlogId } from './paginated-posts-by-blog-id.decorator';

export function ApiGetPostsListByBlogId() {
  return ApiPaginatedList({
    summary: 'Returns all posts for specified blog',
    sortFieldEnum: PostSortField,
    defaultSortField: PostSortField.CreatedAt,
    responseType: PaginatedPostsByBlogId,
  });
}
