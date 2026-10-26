import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { UserMeViewDto } from '../../../src/modules/auth/api/view-dto/user-me.view-dto';
import { bearer } from '../common/auth-header';

export const getMe = async (
  app: INestApplication<App>,
  accessToken: string,
  status: HttpStatus = HttpStatus.OK,
): Promise<UserMeViewDto> => {
  const response = await request(app.getHttpServer())
    .get(ROUTER_PATH.auth.me)
    .set('Authorization', bearer(accessToken))
    .expect(status);
  return response.body as UserMeViewDto;
};
