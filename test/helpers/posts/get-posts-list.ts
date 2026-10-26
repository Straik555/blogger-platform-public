import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { PaginatedViewDto } from '../../../src/core/dto/base.paginated.view-dto';
import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { PostViewDto } from '../../../src/modules/content/posts/api/view-dto/post.view-dto';

export const getPostsList = async (
  app: INestApplication<App>,
  query: Record<string, string | number> = {},
  status: HttpStatus = HttpStatus.OK,
  accessToken?: string,
): Promise<PaginatedViewDto<PostViewDto[]>> => {
  const req = request(app.getHttpServer()).get(ROUTER_PATH.posts).query(query);
  if (accessToken) req.set('Authorization', `Bearer ${accessToken}`);
  const response = await req.expect(status);
  return response.body as PaginatedViewDto<PostViewDto[]>;
};
