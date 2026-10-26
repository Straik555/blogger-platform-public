import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { extractRefreshToken, refreshCookie } from '../common/utils';
import { AuthTokens } from './login';

export const refreshTokens = async (
  app: INestApplication<App>,
  refreshToken: string,
): Promise<AuthTokens> => {
  const response = await request(app.getHttpServer())
    .post(ROUTER_PATH.auth.refreshToken)
    .set('Cookie', refreshCookie(refreshToken))
    .expect(HttpStatus.OK);
  const { accessToken } = response.body as { accessToken: string };
  return {
    accessToken,
    refreshToken: extractRefreshToken(response.headers['set-cookie']),
  };
};

export const refreshTokensRaw = (
  app: INestApplication<App>,
  refreshToken: string | null,
  status: HttpStatus,
): Promise<request.Response> => {
  const req = request(app.getHttpServer()).post(ROUTER_PATH.auth.refreshToken);
  if (refreshToken) req.set('Cookie', refreshCookie(refreshToken));
  return req.expect(status);
};

export const logout = (
  app: INestApplication<App>,
  refreshToken: string | null,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> => {
  const req = request(app.getHttpServer()).post(ROUTER_PATH.auth.logout);
  if (refreshToken) req.set('Cookie', refreshCookie(refreshToken));
  return req.expect(status);
};
