import { applyDecorators, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

import { errorMessageHelper } from '../../helpers/error-message.helper';

type TrimOptionType = {
  type?: Type<unknown>;
  pattern?: string;
  example?: string;
  field: string;
  description?: string;
  required?: boolean;
  toLowerCase?: boolean;
};

export function Trim(options: TrimOptionType) {
  const decorators = [
    ApiProperty({
      type: options.type ?? String,
      required: options.required ?? false,
      description: options.description,
      example: options.example,
      pattern: options.pattern,
    }),
    IsString({ message: errorMessageHelper.isString(options.field) }),
    Transform(({ value }: { value: unknown }) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return options.toLowerCase ? trimmed.toLowerCase() : trimmed;
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
