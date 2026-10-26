import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

import { errorMessageHelper } from '../../helpers/error-message.helper';

export function IsMongoIdField(field: string) {
  return applyDecorators(
    IsString({ message: errorMessageHelper.isString(field) }),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    IsMongoId({ message: errorMessageHelper.isNotCorrectFormat(field) }),
  );
}
