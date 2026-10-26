import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { PaginatedViewDto } from '../../../src/core/dto/base.paginated.view-dto';
import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { UserViewDto } from '../../../src/modules/users/api/view-dto/user.view-dto';
import { basicAuth } from '../common/auth-header';

export const getUsersList = async (
  app: INestApplication<App>,
  query: Record<string, string | number> = {},
  status: HttpStatus = HttpStatus.OK,
  auth: string = basicAuth(app),
): Promise<PaginatedViewDto<UserViewDto[]>> => {
  const response = await request(app.getHttpServer())
    .get(`${ROUTER_PATH.sa}${ROUTER_PATH.users}`)
    .set('Authorization', auth)
    .query(query)
    .expect(status);
  return response.body as PaginatedViewDto<UserViewDto[]>;
};
