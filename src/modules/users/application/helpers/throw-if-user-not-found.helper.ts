import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { User } from '../../domain/user.entity';

export function throwIfUserNotFound(
  user: User | null,
  field: string,
): asserts user is User {
  if (!user) {
    const message = errorMessageHelper.isInvalid(field);
    throw new DomainException({
      code: DomainExceptionCode.BadRequest,
      message,
      errorsMessages: [
        {
          message,
          field: field,
        },
      ],
    });
  }
}
