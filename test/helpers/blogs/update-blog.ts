import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { CreateBlogDto } from '../../../src/modules/content/blogs/dto/create-blog.dto';
import { basicAuth } from '../common/auth-header';

export const updateBlog = async (
  app: INestApplication<App>,
  id: string,
  body: Partial<CreateBlogDto>,
  status: HttpStatus = HttpStatus.NO_CONTENT,
  auth: string = basicAuth(app),
): Promise<request.Response> =>
  request(app.getHttpServer())
    .put(`${ROUTER_PATH.sa}${ROUTER_PATH.blogs}/${id}`)
    .set('Authorization', auth)
    .send(body)
    .expect(status);
