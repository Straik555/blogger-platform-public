import { FieldNames } from '../../../core/constants/field-names.constant';
import { Trim } from '../../../core/decorators/validation';

export class ConfirmRegistrationDto {
  @Trim({
    required: true,
    description: 'Code that be sent via Email inside link',
    field: FieldNames.CODE,
  })
  code: string;
}
