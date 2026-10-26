import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { UsersSortField } from './user-sort-field.type';

export class UsersQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(UsersSortField)
  sortBy = UsersSortField.CreatedAt;

  @IsOptional()
  @IsString()
  searchLoginTerm: string | null = null;

  @IsOptional()
  @IsString()
  searchEmailTerm: string | null = null;
}
