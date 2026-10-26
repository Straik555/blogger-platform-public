import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { UserViewDto } from '../../../src/modules/users/api/view-dto/user.view-dto';
import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';
import { basicAuth } from '../common/auth-header';
import { userData } from '../common/test-data';

export const createUser = async (
  app: INestApplication<App>,
  body: Partial<CreateUserDto> = userData(),
  status: HttpStatus = HttpStatus.CREATED,
  auth: string = basicAuth(app),
): Promise<UserViewDto> => {
  const response = await request(app.getHttpServer())
    .post(`${ROUTER_PATH.sa}${ROUTER_PATH.users}`)
    .set('Authorization', auth)
    .send(body)
    .expect(status);
  return response.body as UserViewDto;
};
