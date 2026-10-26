import { FieldNames } from '../../../core/constants/field-names.constant';
import { IsTrimmedString, Trim } from '../../../core/decorators/validation';

export class UpdatePasswordDto {
  @IsTrimmedString({
    field: FieldNames.NEW_PASSWORD,
    max: 20,
    min: 6,
    description: 'New password',
    isMin: true,
  })
  newPassword: string;

  @Trim({
    required: true,
    description: 'New password',
    field: FieldNames.RECOVERY_CODE,
  })
  recoveryCode: string;
}
