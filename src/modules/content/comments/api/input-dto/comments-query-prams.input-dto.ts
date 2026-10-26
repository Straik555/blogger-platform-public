import { IsEnum, IsOptional } from 'class-validator';

import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { CommentsSortField } from './comments-sort-field.type';

export class CommentsQueryPrams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(CommentsSortField)
  sortBy = CommentsSortField.CreatedAt;
}
