import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

type ApiGetByIdOptions = {
  summary: string;
  responseType: Type<unknown>;
  notFound?: boolean;
  notFoundMessage?: string;
  nameParam?: string;
  typeParam?: Type<unknown>;
  descriptionParam: string;
};

export function ApiGetById(options: ApiGetByIdOptions) {
  const decorators = [
    ApiOperation({ summary: options.summary }),
    ApiParam({
      name: options.nameParam ?? 'id',
      type: options.typeParam ?? String,
      description: options.descriptionParam,
    }),
    ApiOkResponse({
      description: 'Success',
      type: options.responseType,
    }),
  ];

  if (options.notFound) {
    decorators.push(
      ApiNotFoundResponse({
        description: options.notFoundMessage ?? 'Not Found',
      }),
    );
  }

  return applyDecorators(...decorators);
}
