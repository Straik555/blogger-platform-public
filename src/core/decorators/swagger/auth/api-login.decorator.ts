import { UserAccessTokenViewDto } from '../../../../modules/auth/api/view-dto/access-token.view-dto';
import { LoginDto } from '../../../../modules/auth/dto/login.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiLogin() {
  return ApiMutateEntity({
    summary: 'Try login user to the system',
    bodyType: LoginDto,
    bodyDescription: 'Login credentials',
    created: true,
    responseDescription:
      'Returns JWT accessToken (expired after 5 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 24 hours).',
    responseType: UserAccessTokenViewDto,
    unauthorized: true,
    unauthorizedDescription: 'If the password or login or email is wrong',
    badRequest: true,
  });
}
