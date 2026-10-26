import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { CommentViewDto } from '../../../src/modules/content/comments/api/view-dto/comment.view-dto';
import { bearer } from '../common/auth-header';

export const getCommentById = async (
  app: INestApplication<App>,
  id: string,
  status: HttpStatus = HttpStatus.OK,
  accessToken?: string,
): Promise<CommentViewDto> => {
  const req = request(app.getHttpServer()).get(`${ROUTER_PATH.comments}/${id}`);
  if (accessToken) req.set('Authorization', bearer(accessToken));
  const response = await req.expect(status);
  return response.body as CommentViewDto;
};
