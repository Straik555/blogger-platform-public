import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { extractRefreshToken } from '../common/utils';

export type AuthTokens = { accessToken: string; refreshToken: string };

/** Returns access token from body and refresh token from the cookie. */
export const login = async (
  app: INestApplication<App>,
  loginOrEmail: string,
  password: string,
  userAgent = 'e2e-tests',
): Promise<AuthTokens> => {
  const response = await request(app.getHttpServer())
    .post(ROUTER_PATH.auth.login)
    .set('User-Agent', userAgent)
    .send({ loginOrEmail, password })
    .expect(HttpStatus.OK);

  const { accessToken } = response.body as { accessToken: string };
  return {
    accessToken,
    refreshToken: extractRefreshToken(response.headers['set-cookie']),
  };
};

/** For negative cases: returns the raw response. */
export const loginRaw = async (
  app: INestApplication<App>,
  body: Record<string, unknown>,
  status: HttpStatus,
): Promise<request.Response> =>
  request(app.getHttpServer())
    .post(ROUTER_PATH.auth.login)
    .send(body)
    .expect(status);
