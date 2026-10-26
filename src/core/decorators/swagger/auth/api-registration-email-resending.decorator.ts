import { RegistrationEmailResendingDto } from '../../../../modules/auth/dto/registration-email-resending.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiRegistrationEmailResendingDecorator() {
  return ApiMutateEntity({
    summary: 'Resend confirmation registration Email if user exists',
    bodyType: RegistrationEmailResendingDto,
    bodyDescription: 'Data for constructing new user',
    noContent: true,
    noContentDescription:
      'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
    badRequest: true,
    tooManyRequests: true,
  });
}
