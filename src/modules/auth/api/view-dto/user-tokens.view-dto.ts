import { FieldNames } from '../../../../core/constants/field-names.constant';
import { Trim } from '../../../../core/decorators/validation';
import { UserAccessTokenViewDto } from './access-token.view-dto';

export class UserTokensViewDto extends UserAccessTokenViewDto {
  @Trim({
    field: FieldNames.REFRESH_TOKEN,
    description: 'JWT refresh token',
  })
  refreshToken: string;
}
