import { UpdatePasswordDto } from '../../../../modules/auth/dto/update-password.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiUpdatePassword() {
  return ApiMutateEntity({
    summary: 'Confirm password recovery',
    bodyType: UpdatePasswordDto,
    unauthorized: true,
    badRequest: true,
    badRequestDescription:
      'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
    noContentDescription: 'If code is valid and new password is accepted',
    tooManyRequests: true,
  });
}
