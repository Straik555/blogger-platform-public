import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { bearer } from '../common/auth-header';

export const deleteComment = (
  app: INestApplication<App>,
  id: string,
  accessToken: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  request(app.getHttpServer())
    .delete(`${ROUTER_PATH.comments}/${id}`)
    .set('Authorization', bearer(accessToken))
    .expect(status);
