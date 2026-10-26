import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { PaginatedViewDto } from '../../../src/core/dto/base.paginated.view-dto';
import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { BlogViewDto } from '../../../src/modules/content/blogs/api/view-dto/blog.view-dto';

export const getBlogsList = async (
  app: INestApplication<App>,
  query: Record<string, string | number> = {},
  status: HttpStatus = HttpStatus.OK,
): Promise<PaginatedViewDto<BlogViewDto[]>> => {
  const response = await request(app.getHttpServer())
    .get(ROUTER_PATH.blogs)
    .query(query)
    .expect(status);

  return response.body as PaginatedViewDto<BlogViewDto[]>;
};
