import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { PaginatedViewDto } from '../../../src/core/dto/base.paginated.view-dto';
import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { CommentViewDto } from '../../../src/modules/content/comments/api/view-dto/comment.view-dto';
import { bearer } from '../common/auth-header';

export const getCommentsByPostId = async (
  app: INestApplication<App>,
  postId: string,
  query: Record<string, string | number> = {},
  status: HttpStatus = HttpStatus.OK,
  accessToken?: string,
): Promise<PaginatedViewDto<CommentViewDto[]>> => {
  const req = request(app.getHttpServer())
    .get(`${ROUTER_PATH.posts}/${postId}${ROUTER_PATH.comments}`)
    .query(query);
  if (accessToken) req.set('Authorization', bearer(accessToken));
  const response = await req.expect(status);
  return response.body as PaginatedViewDto<CommentViewDto[]>;
};
