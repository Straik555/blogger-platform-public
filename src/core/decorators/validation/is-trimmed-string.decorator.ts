import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';

import { errorMessageHelper } from '../../helpers/error-message.helper';

type IsTrimmedStringType = {
  field: string;
  min: number;
  max: number;
  pattern?: string;
  example?: string;
  description?: string;
  isMin?: boolean;
};

export function IsTrimmedString(options: IsTrimmedStringType) {
  const decorators = [
    ApiProperty({
      pattern: options.pattern,
      example: options.example,
      maxLength: options.max,
      minLength: options.isMin ? options.min : undefined,
      description: options.description,
    }),
    IsString({
      message: errorMessageHelper.isString(options.field),
    }),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    Length(options.min, options.max, {
      message: errorMessageHelper.charactersLength(
        options.field,
        options.min,
        options.max,
      ),
    }),
  ];
  if (options.pattern) {
    decorators.push(
      Matches(new RegExp(options.pattern), {
        message: errorMessageHelper.isNotCorrectFormat(options.field),
      }),
    );
  }
  return applyDecorators(...decorators);
}
