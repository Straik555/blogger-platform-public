import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { PostViewDto } from '../../../src/modules/content/posts/api/view-dto/post.view-dto';
import { CreatePostCommonDto } from '../../../src/modules/content/posts/dto/create-post-common.dto';
import { basicAuth } from '../common/auth-header';
import { postData } from '../common/test-data';

export const createPostByBlogId = async (
  app: INestApplication<App>,
  blogId: string,
  body: Partial<CreatePostCommonDto> = postData(),
  status: HttpStatus = HttpStatus.CREATED,
  /** `null` sends the request without an Authorization header */
  auth: string | null = basicAuth(app),
): Promise<PostViewDto> => {
  const req = request(app.getHttpServer()).post(
    `${ROUTER_PATH.sa}${ROUTER_PATH.blogs}/${blogId}${ROUTER_PATH.posts}`,
  );
  if (auth) req.set('Authorization', auth);
  const response = await req.send(body).expect(status);
  return response.body as PostViewDto;
};
