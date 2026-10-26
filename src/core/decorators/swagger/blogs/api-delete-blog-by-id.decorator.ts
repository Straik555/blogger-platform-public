import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiDeleteBlogById() {
  return ApiMutateEntity({
    summary: 'Delete blog specified by id',
    unauthorized: true,
    notFound: true,
    isApiParams: true,
    descriptionParam: 'Blog id',
  });
}
