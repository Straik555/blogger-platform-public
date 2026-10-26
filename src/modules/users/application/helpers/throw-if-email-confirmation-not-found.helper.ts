import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { EmailConfirmation } from '../../domain/email-confirmation.entity';

export function throwIfEmailConfirmationNotFound(
  emailConfirmation: EmailConfirmation | null,
  fieldNames: string,
): asserts emailConfirmation is EmailConfirmation {
  if (!emailConfirmation) {
    throw new DomainException({
      code: DomainExceptionCode.NotFound,
      message: errorMessageHelper.notFoundWithEntity(
        fieldNames,
        FieldNames.USER,
      ),
    });
  }
}
