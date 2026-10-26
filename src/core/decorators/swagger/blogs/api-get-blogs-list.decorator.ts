import { BlogSortFieldType } from '../../../../modules/content/blogs/api/input-dto/blog-sort-field.type';
import { ApiPaginatedList } from '../common/api-paginated-query-params.decorator';
import { PaginatedBlogs } from './paginated-blogs.decorator';

export function ApiGetBlogsList() {
  return ApiPaginatedList({
    summary: 'Returns blogs with paging',
    sortFieldEnum: BlogSortFieldType,
    defaultSortField: BlogSortFieldType.CreatedAt,
    responseType: PaginatedBlogs,
    extraQueries: [
      {
        name: 'searchNameTerm',
        type: 'string',
        required: false,
        default: null,
        description:
          'Search term for blog Name: Name should contains this term in any position',
      },
    ],
  });
}
