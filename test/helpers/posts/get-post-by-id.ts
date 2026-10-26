import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { PostViewDto } from '../../../src/modules/content/posts/api/view-dto/post.view-dto';

export const getPostById = async (
  app: INestApplication<App>,
  id: string,
  status: HttpStatus = HttpStatus.OK,
  accessToken?: string,
): Promise<PostViewDto> => {
  const req = request(app.getHttpServer()).get(`${ROUTER_PATH.posts}/${id}`);
  if (accessToken) req.set('Authorization', `Bearer ${accessToken}`);
  const response = await req.expect(status);
  return response.body as PostViewDto;
};
