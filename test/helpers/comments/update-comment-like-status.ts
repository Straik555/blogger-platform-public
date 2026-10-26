import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { LikeStatusEnum } from '../../../src/core/types/like-status.type';
import { bearer } from '../common/auth-header';

export const updateCommentLikeStatus = (
  app: INestApplication<App>,
  id: string,
  accessToken: string,
  likeStatus: LikeStatusEnum | string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  request(app.getHttpServer())
    .put(`${ROUTER_PATH.comments}/${id}${ROUTER_PATH.likeStatus}`)
    .set('Authorization', bearer(accessToken))
    .send({ likeStatus })
    .expect(status);
