import { PasswordRecoveryDto } from '../../../../modules/auth/dto/password-recovery.dto';
import { ApiMutateEntity } from '../common/api-mutate-entity.decorator';

export function ApiPasswordRecovery() {
  return ApiMutateEntity({
    summary:
      'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
    bodyType: PasswordRecoveryDto,
    badRequest: true,
    badRequestDescription:
      'If the inputModel has invalid email (for example 222^gmail.com)',
    noContentDescription:
      "Even if current email is not registered (for prevent user's email detection)",
    tooManyRequests: true,
  });
}
