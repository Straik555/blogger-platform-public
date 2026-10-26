import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiLogoutDecorator() {
  return ApiMutateEntity({
    summary:
      'In cookie client must send correct refreshToken that will be revoked',
    noContent: true,
    unauthorized: true,
  });
}
