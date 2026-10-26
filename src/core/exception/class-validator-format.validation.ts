import { ValidationError } from 'class-validator';

import { errorMessageHelper } from '../helpers/error-message.helper';
import { ValidationErrorItemViewDto } from './dto/view-dto/validation-error-item.view-dto';

export function classValidatorFormatValidation(
  errors: ValidationError[],
  parentPath = '',
): ValidationErrorItemViewDto[] {
  return errors.flatMap((err): ValidationErrorItemViewDto[] => {
    const fieldPath = parentPath
      ? `${parentPath}.${err.property}`
      : err.property;

    if (err.children?.length) {
      return classValidatorFormatValidation(err.children, fieldPath);
    }

    return [
      {
        field: fieldPath,
        message:
          Object.values(err.constraints ?? {})[0] ??
          errorMessageHelper.invalidValue(),
      },
    ];
  });
}
