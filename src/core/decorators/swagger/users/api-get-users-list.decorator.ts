import { UsersSortField } from '../../../../modules/users/api/input-dto/user-sort-field.type';
import { ApiPaginatedList } from '../common/api-paginated-query-params.decorator';
import { PaginatedUsersList } from './paginated-users-list.decorator';

export function ApiGetUsersList() {
  return ApiPaginatedList({
    summary: 'Returns all users',
    sortFieldEnum: UsersSortField,
    defaultSortField: UsersSortField.CreatedAt,
    responseType: PaginatedUsersList,
    extraQueries: [
      {
        name: 'searchLoginTerm',
        type: 'string',
        required: false,
        default: null,
        description:
          'Search term for user Login: Login should contains this term in any position',
      },
      {
        name: 'searchEmailTerm',
        type: 'string',
        required: false,
        default: null,
        description:
          'Search term for user Email: Email should contains this term in any position',
      },
    ],
  });
}
