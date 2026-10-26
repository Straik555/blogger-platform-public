import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { loginRaw } from '../helpers/auth/login';
import {
  newPassword,
  passwordRecovery,
  register,
  resendConfirmation,
} from '../helpers/auth/registration';
import { expectValidationErrors } from '../helpers/common/errors';
import { userData } from '../helpers/common/test-data';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createUser } from '../helpers/users/create-user';

describe('Auth validation (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await initSettings();
  });

  afterEach(async () => {
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/registration', () => {
    it.each([
      ['login too short', { login: 'ab' }, ['login']],
      ['login with forbidden chars', { login: 'ab@cd' }, ['login']],
      ['invalid email', { email: 'not-email' }, ['email']],
      ['password too short', { password: '123' }, ['password']],
    ])('rejects %s', async (_, override, fields) => {
      const response = await register(
        app,
        { ...userData(), ...override },
        HttpStatus.BAD_REQUEST,
      );
      expectValidationErrors(response, fields);
    });

    it('returns all invalid fields at once', async () => {
      const response = await register(app, {}, HttpStatus.BAD_REQUEST);
      expectValidationErrors(response, ['login', 'email', 'password']);
    });

    it('rejects already used login and email', async () => {
      const existing = userData();
      await createUser(app, existing);

      const byLogin = await register(
        app,
        { ...userData(), login: existing.login },
        HttpStatus.BAD_REQUEST,
      );
      const byEmail = await register(
        app,
        { ...userData(), email: existing.email },
        HttpStatus.BAD_REQUEST,
      );

      expectValidationErrors(byLogin, ['login']);
      expectValidationErrors(byEmail, ['email']);
    });
  });

  describe('POST /auth/login', () => {
    it('should return 401 when body is empty', async () => {
      await loginRaw(app, {}, HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 when password is empty string', async () => {
      await loginRaw(
        app,
        { loginOrEmail: 'user1', password: '' },
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('email-based endpoints', () => {
    it('registration-email-resending rejects invalid email', async () => {
      const response = await resendConfirmation(
        app,
        'bad',
        HttpStatus.BAD_REQUEST,
      );
      expectValidationErrors(response, ['email']);
    });

    it('password-recovery rejects invalid email', async () => {
      const response = await passwordRecovery(
        app,
        'bad',
        HttpStatus.BAD_REQUEST,
      );
      expectValidationErrors(response, ['email']);
    });
  });

  describe('POST /auth/new-password', () => {
    it('rejects too short password', async () => {
      const response = await newPassword(
        app,
        { newPassword: '123', recoveryCode: 'some-code' },
        HttpStatus.BAD_REQUEST,
      );
      expectValidationErrors(response, ['newPassword']);
    });

    it('rejects unknown recovery code with field recoveryCode', async () => {
      const response = await newPassword(
        app,
        { newPassword: 'newPass123', recoveryCode: 'unknown-code' },
        HttpStatus.BAD_REQUEST,
      );
      expectValidationErrors(response, ['recoveryCode']);
    });
  });
});
