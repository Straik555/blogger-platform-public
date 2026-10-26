import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

type FormatIntegerOptions = {
  required?: boolean;
  default?: number;
  example?: number;
  description?: string;
};

export function FormatInteger(options?: FormatIntegerOptions) {
  return applyDecorators(
    ApiProperty({
      type: 'integer',
      format: 'int32',
      required: options?.required,
      example: options?.example,
      description: options?.description,
      default: options?.default,
    }),
  );
}
