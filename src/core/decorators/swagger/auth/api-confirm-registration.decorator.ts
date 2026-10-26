import { ConfirmRegistrationDto } from '../../../../modules/auth/dto/confirm-registration.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiConfirmRegistration() {
  return ApiMutateEntity({
    summary: 'Confirm registration',
    bodyType: ConfirmRegistrationDto,
    badRequest: true,
    badRequestDescription:
      'If the confirmation code is incorrect, expired or already been applied',
    tooManyRequests: true,
  });
}
