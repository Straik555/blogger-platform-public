import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { CreatePostDto } from '../../../src/modules/content/posts/dto/create-post.dto';
import { basicAuth } from '../common/auth-header';

export const updatePost = async (
  app: INestApplication<App>,
  id: string,
  body: Partial<CreatePostDto>,
  status: HttpStatus = HttpStatus.NO_CONTENT,
  auth: string = basicAuth(app),
): Promise<request.Response> =>
  request(app.getHttpServer())
    .put(`${ROUTER_PATH.posts}/${id}`)
    .set('Authorization', auth)
    .send(body)
    .expect(status);
