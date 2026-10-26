import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';

const post = (
  app: INestApplication<App>,
  path: string,
  body: Record<string, unknown>,
  status: HttpStatus,
): Promise<request.Response> =>
  request(app.getHttpServer()).post(path).send(body).expect(status);

export const register = (
  app: INestApplication<App>,
  body: Record<string, unknown>,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  post(app, ROUTER_PATH.auth.registration, body, status);

export const confirmRegistration = (
  app: INestApplication<App>,
  code: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  post(app, ROUTER_PATH.auth.registrationConfirmation, { code }, status);

export const resendConfirmation = (
  app: INestApplication<App>,
  email: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  post(app, ROUTER_PATH.auth.registrationEmailResending, { email }, status);

export const passwordRecovery = (
  app: INestApplication<App>,
  email: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  post(app, ROUTER_PATH.auth.passwordRecovery, { email }, status);

export const newPassword = (
  app: INestApplication<App>,
  body: { newPassword: string; recoveryCode: string },
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  post(app, ROUTER_PATH.auth.newPassword, body, status);
