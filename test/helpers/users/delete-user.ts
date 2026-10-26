import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { basicAuth } from '../common/auth-header';

export const deleteUser = async (
  app: INestApplication<App>,
  id: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
  auth: string = basicAuth(app),
): Promise<request.Response> =>
  request(app.getHttpServer())
    .delete(`${ROUTER_PATH.sa}${ROUTER_PATH.users}/${id}`)
    .set('Authorization', auth)
    .expect(status);
