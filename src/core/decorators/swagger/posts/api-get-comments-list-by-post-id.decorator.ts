import { CommentsSortField } from '../../../../modules/content/comments/api/input-dto/comments-sort-field.type';
import { ApiPaginatedList } from '../common/api-paginated-query-params.decorator';
import { PaginatedCommentsListByPostId } from './paginated-comments-list-by-post-id.decorator';

export function ApiGetCommentsListByPostId() {
  return ApiPaginatedList({
    summary: 'Return comments for specified post',
    sortFieldEnum: CommentsSortField,
    defaultSortField: CommentsSortField.CreatedAt,
    responseType: PaginatedCommentsListByPostId,
  });
}
