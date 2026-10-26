import { PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

import { FieldNames } from '../constants/field-names.constant';
import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../helpers/error-message.helper';

export class UuidValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        errorsMessages: [
          {
            field: FieldNames.ID,
            message: errorMessageHelper.isNotCorrectFormat(value),
          },
        ],
      });
    }
    return value;
  }
}
