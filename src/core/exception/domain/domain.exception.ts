import { ValidationErrorItemViewDto } from '../dto/view-dto/validation-error-item.view-dto';
import { DomainExceptionCode } from './domain-exception-codes';

export class DomainException extends Error {
  code: DomainExceptionCode;
  errorsMessages: ValidationErrorItemViewDto[];

  constructor(errorInfo: {
    code: DomainExceptionCode;
    errorsMessages?: ValidationErrorItemViewDto[];
    message?: string;
  }) {
    super(errorInfo.message);
    this.code = errorInfo.code;
    this.errorsMessages = errorInfo.errorsMessages ?? [];
  }
}
