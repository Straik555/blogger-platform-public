import { FieldNames } from '../../../core/constants/field-names.constant';
import { IsTrimmedString } from '../../../core/decorators/validation';

export class LoginDto {
  @IsTrimmedString({ field: FieldNames.LOGIN, max: 100, min: 3 })
  loginOrEmail: string;

  @IsTrimmedString({ field: FieldNames.PASSWORD, max: 20, min: 6 })
  password: string;
}
