import { FieldNames } from '../../../../core/constants/field-names.constant';
import { Trim } from '../../../../core/decorators/validation';

export class UserAccessTokenViewDto {
  @Trim({
    field: FieldNames.ACCESS_TOKEN,
    description: 'JWT access token',
  })
  accessToken: string;
}
