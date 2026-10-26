import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { PostViewDto } from '../../../src/modules/content/posts/api/view-dto/post.view-dto';
import { CreatePostDto } from '../../../src/modules/content/posts/dto/create-post.dto';
import { basicAuth } from '../common/auth-header';
import { postData } from '../common/test-data';

export const createPost = async (
  app: INestApplication<App>,
  blogId: string,
  body: Partial<CreatePostDto> = postData(),
  status: HttpStatus = HttpStatus.CREATED,
  auth: string = basicAuth(app),
): Promise<PostViewDto> => {
  const response = await request(app.getHttpServer())
    .post(ROUTER_PATH.posts)
    .set('Authorization', auth)
    .send({ blogId, ...body })
    .expect(status);
  return response.body as PostViewDto;
};
