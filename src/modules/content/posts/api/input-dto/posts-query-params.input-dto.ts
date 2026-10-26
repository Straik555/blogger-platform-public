import { IsEnum, IsOptional } from 'class-validator';

import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PostSortField } from './post-sort-field.type';

export class PostsQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(PostSortField)
  sortBy = PostSortField.CreatedAt;
}
