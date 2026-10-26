import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { basicAuth } from '../common/auth-header';

export const deletePostByBlogId = async (
  app: INestApplication<App>,
  blogId: string,
  postId: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
  /** `null` sends the request without an Authorization header */
  auth: string | null = basicAuth(app),
): Promise<request.Response> => {
  const req = request(app.getHttpServer()).delete(
    `${ROUTER_PATH.sa}${ROUTER_PATH.blogs}/${blogId}${ROUTER_PATH.posts}/${postId}`,
  );
  if (auth) req.set('Authorization', auth);
  return req.expect(status);
};
