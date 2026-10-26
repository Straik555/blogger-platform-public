import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { BlogViewDto } from '../../../src/modules/content/blogs/api/view-dto/blog.view-dto';

export const getBlogById = async (
  app: INestApplication<App>,
  id: string,
  status: HttpStatus = HttpStatus.OK,
): Promise<BlogViewDto> => {
  const response = await request(app.getHttpServer())
    .get(`${ROUTER_PATH.blogs}/${id}`)
    .expect(status);
  return response.body as BlogViewDto;
};
