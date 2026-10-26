import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiDeleteUserById() {
  return ApiMutateEntity({
    summary: 'Delete user specified by id',
    notFound: true,
    unauthorized: true,
    isApiParams: true,
    notFoundMessage: 'If specified user is not exists',
    descriptionParam: 'User id',
  });
}
