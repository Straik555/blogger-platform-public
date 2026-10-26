import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

export function ApiDeleteAllData() {
  return applyDecorators(
    ApiOperation({
      summary: 'Clear database: delete all data from all tables/collections',
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
  );
}
