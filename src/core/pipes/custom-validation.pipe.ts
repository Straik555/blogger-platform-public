import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { classValidatorFormatValidation } from '../exception/class-validator-format.validation';
import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../helpers/error-message.helper';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]): DomainException => {
        return new DomainException({
          errorsMessages: classValidatorFormatValidation(errors),
          message: errorMessageHelper.validationFailed(),
          code: DomainExceptionCode.ValidationError,
        });
      },
      ...options,
    });
  }
}
