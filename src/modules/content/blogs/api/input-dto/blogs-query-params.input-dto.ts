import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { BlogSortFieldType } from './blog-sort-field.type';

export class BlogsQueryParams extends BaseQueryParams {
  @IsOptional()
  @IsEnum(BlogSortFieldType)
  sortBy = BlogSortFieldType.CreatedAt;

  @IsOptional()
  @IsString()
  searchNameTerm: string | null = null;
}
