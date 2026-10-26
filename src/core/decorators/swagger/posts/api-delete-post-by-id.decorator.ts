import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiDeletePostById() {
  return ApiMutateEntity({
    summary: 'Delete post specified by id',
    notFound: true,
    descriptionParam: 'Post id',
    unauthorized: true,
    isApiParams: true,
  });
}
