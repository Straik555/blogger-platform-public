import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { BlogViewDto } from '../../../src/modules/content/blogs/api/view-dto/blog.view-dto';
import { CreateBlogDto } from '../../../src/modules/content/blogs/dto/create-blog.dto';
import { basicAuth } from '../common/auth-header';
import { blogData } from '../common/test-data';

export const createBlog = async (
  app: INestApplication<App>,
  body: Partial<CreateBlogDto> = blogData(),
  status: HttpStatus = HttpStatus.CREATED,
  auth: string = basicAuth(app),
): Promise<BlogViewDto> => {
  const response = await request(app.getHttpServer())
    .post(`${ROUTER_PATH.sa}${ROUTER_PATH.blogs}`)
    .set('Authorization', auth)
    .send(body)
    .expect(status);
  return response.body as BlogViewDto;
};
