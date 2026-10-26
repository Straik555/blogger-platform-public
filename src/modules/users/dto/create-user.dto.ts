import { ApiProperty } from '@nestjs/swagger';

import { FieldNames } from '../../../core/constants/field-names.constant';
import { IsTrimmedString } from '../../../core/decorators/validation';
import { Login } from '../../../core/value-objects';
import { EmailUserDto } from './email-user.dto';

export class CreateUserDto extends EmailUserDto {
  @ApiProperty({ description: 'must be unique' })
  email: string;

  @IsTrimmedString({
    field: FieldNames.LOGIN,
    min: Login.MIN_LENGTH,
    max: Login.MAX_LENGTH,
    pattern: Login.PATTERN_REGEX.source,
    description: 'must be unique',
    isMin: true,
  })
  login: string;

  @IsTrimmedString({ field: FieldNames.PASSWORD, max: 20, min: 6, isMin: true })
  password: string;
}
