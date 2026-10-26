import { IsEmail } from 'class-validator';

import { FieldNames } from '../../../core/constants/field-names.constant';
import { Trim } from '../../../core/decorators/validation';
import { Email } from '../domain/value-objects/email';

export class EmailUserDto {
  @Trim({
    field: FieldNames.EMAIL,
    pattern: Email.PATTERN_REGEX.source,
    example: 'example@example.dev',
    toLowerCase: true,
  })
  @IsEmail()
  email: string;
}
