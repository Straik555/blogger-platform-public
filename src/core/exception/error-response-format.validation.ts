import { ValidationErrorItemViewDto } from './dto/view-dto/validation-error-item.view-dto';

export class ErrorResponseFormatValidation {
  private errorsMessages: ValidationErrorItemViewDto[];
  private constructor(errorsMessages: ValidationErrorItemViewDto[]) {
    this.errorsMessages = errorsMessages;
  }

  static build(
    errors: ValidationErrorItemViewDto | ValidationErrorItemViewDto[],
  ): ErrorResponseFormatValidation {
    const errorsMessages = Array.isArray(errors) ? errors : [errors];
    return new ErrorResponseFormatValidation(errorsMessages);
  }
}
