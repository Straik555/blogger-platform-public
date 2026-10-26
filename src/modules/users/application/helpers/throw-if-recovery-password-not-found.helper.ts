import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { RecoveryPassword } from '../../domain/recovery-password.entity';

export function throwIfRecoveryPasswordNotFoundHelper(
  recoveryPassword: RecoveryPassword | null,
  fieldNames: string,
): asserts recoveryPassword is RecoveryPassword {
  if (!recoveryPassword) {
    const message = errorMessageHelper.notFoundWithEntity(
      fieldNames,
      FieldNames.USER,
    );
    throw new DomainException({
      code: DomainExceptionCode.BadRequest,
      message,
      errorsMessages: [
        {
          message,
          field: fieldNames,
        },
      ],
    });
  }
}
