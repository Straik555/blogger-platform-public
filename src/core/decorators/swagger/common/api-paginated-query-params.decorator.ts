import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { SortDirection } from '../../../dto/base.query-params.input-dto';

type ExtraQueryParam = {
  name: string;
  type?: 'string' | 'integer' | 'boolean';
  required?: boolean;
  default?: null | string | number | boolean;
  example?: string | number | boolean;
  description?: string;
};

type ApiPaginatedListOptions = {
  summary: string;
  sortFieldEnum: Record<string, string>;
  defaultSortField: string;
  responseType: Type<unknown>;
  extraQueries?: ExtraQueryParam[];
};

export function ApiPaginatedList(options: ApiPaginatedListOptions) {
  const extraQueryDecorators = (options.extraQueries ?? []).map((q) =>
    ApiQuery({
      name: q.name,
      type: q.type ?? 'string',
      required: q.required ?? false,
      default: q.default ?? null,
      example: q.example,
      description: q.description,
    }),
  );

  return applyDecorators(
    ApiOperation({ summary: options.summary }),
    ApiQuery({
      name: 'pageNumber',
      type: 'integer',
      format: 'int32',
      required: false,
      default: 1,
      example: 1,
      description: 'pageNumber is number of portions that should be returned',
    }),
    ApiQuery({
      name: 'pageSize',
      type: 'integer',
      format: 'int32',
      required: false,
      default: 10,
      example: 10,
      description: 'pageSize is portions size that should be returned',
    }),
    ApiQuery({
      name: 'sortBy',
      type: 'string',
      default: options.defaultSortField,
      required: false,
      enum: Object.values(options.sortFieldEnum),
    }),
    ApiQuery({
      name: 'sortDirection',
      type: 'string',
      default: SortDirection.Desc,
      required: false,
      enum: Object.values(SortDirection),
    }),
    ...extraQueryDecorators,
    ApiOkResponse({
      description: 'Success',
      type: options.responseType,
    }),
  );
}
