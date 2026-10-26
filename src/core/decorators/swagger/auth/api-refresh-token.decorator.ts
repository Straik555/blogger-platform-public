import { UserAccessTokenViewDto } from '../../../../modules/auth/api/view-dto/access-token.view-dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiRefreshTokenDecorator() {
  return ApiMutateEntity({
    summary:
      'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)\n' +
      'Device LastActiveDate should be overrode by issued Date of new refresh token',
    bodyType: UserAccessTokenViewDto,
    bodyDescription:
      'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
    unauthorized: true,
  });
}
