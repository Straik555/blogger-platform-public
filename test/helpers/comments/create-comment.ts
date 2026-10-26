import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { CommentViewDto } from '../../../src/modules/content/comments/api/view-dto/comment.view-dto';
import { bearer } from '../common/auth-header';
import { commentData } from '../common/test-data';

export const createComment = async (
  app: INestApplication<App>,
  postId: string,
  accessToken: string,
  body: Record<string, unknown> = commentData(),
  status: HttpStatus = HttpStatus.CREATED,
): Promise<CommentViewDto> => {
  const response = await request(app.getHttpServer())
    .post(`${ROUTER_PATH.posts}/${postId}${ROUTER_PATH.comments}`)
    .set('Authorization', bearer(accessToken))
    .send(body)
    .expect(status);
  return response.body as CommentViewDto;
};
