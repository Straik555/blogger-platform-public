import { isUUID } from 'class-validator';

import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../helpers/error-message.helper';

export class EntityId {
  private constructor(public readonly value: string) {}

  static create(value: string, field: string): EntityId {
    if (!isUUID(value)) {
      const message = errorMessageHelper.isNotCorrectFormat(field);
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message,
        errorsMessages: [
          {
            message,
            field,
          },
        ],
      });
    }
    return new EntityId(value);
  }
}
