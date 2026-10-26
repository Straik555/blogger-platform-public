import { PostSortField } from '../../../../modules/content/posts/api/input-dto/post-sort-field.type';
import { ApiPaginatedList } from '../common/api-paginated-query-params.decorator';
import { PaginatedPosts } from './paginated-posts.decorator';

export function ApiGetPostsList() {
  return ApiPaginatedList({
    summary: 'Returns all posts',
    defaultSortField: PostSortField.CreatedAt,
    sortFieldEnum: PostSortField,
    responseType: PaginatedPosts,
  });
}
