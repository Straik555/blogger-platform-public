import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { TemplateType } from '../../src/modules/notifications/application/service/template.type';
import { createAndLoginUser } from '../helpers/auth/create-and-login-user';
import { login, loginRaw } from '../helpers/auth/login';
import { getMe } from '../helpers/auth/me';
import {
  logout,
  refreshTokens,
  refreshTokensRaw,
} from '../helpers/auth/refresh-token';
import {
  confirmRegistration,
  newPassword,
  passwordRecovery,
  register,
  resendConfirmation,
} from '../helpers/auth/registration';
import {
  emailSenderMock,
  getLastSentCode,
  resetEmailSenderMock,
} from '../helpers/common/email-sender.mock';
import { userData } from '../helpers/common/test-data';
import {
  JWT_REGEX,
  parseSetCookie,
  waitNextSecond,
} from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createUser } from '../helpers/users/create-user';

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    app = await initSettings();
  });

  beforeEach(() => {
    resetEmailSenderMock();
  });

  afterEach(async () => {
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('registration flow', () => {
    it('register → email with code → confirm → login', async () => {
      const input = userData();

      await register(app, { ...input });

      expect(emailSenderMock.send).toHaveBeenCalledTimes(1);
      const code = getLastSentCode(input.email, TemplateType.Registration);
      await confirmRegistration(app, code);
      const tokens = await login(app, input.login, input.password);
      expect(tokens.accessToken).toEqual(expect.any(String));
    });

    it('confirmation code cannot be used twice', async () => {
      const input = userData();
      await register(app, { ...input });
      const code = getLastSentCode(input.email, TemplateType.Registration);
      await confirmRegistration(app, code);

      await confirmRegistration(app, code, HttpStatus.BAD_REQUEST);
    });

    it('rejects unknown confirmation code', async () => {
      await confirmRegistration(app, 'unknown-code', HttpStatus.BAD_REQUEST);
    });

    it('resending issues a new code; old code stops working', async () => {
      const input = userData();
      await register(app, { ...input });
      const oldCode = getLastSentCode(input.email, TemplateType.Registration);

      await resendConfirmation(app, input.email);

      const newCode = getLastSentCode(input.email, TemplateType.Registration);
      expect(newCode).not.toBe(oldCode);
      await confirmRegistration(app, oldCode, HttpStatus.BAD_REQUEST);
      await confirmRegistration(app, newCode);
    });

    it('resending for already confirmed email → 400', async () => {
      const input = userData();
      await createUser(app, input); // admin-created users are confirmed

      await resendConfirmation(app, input.email, HttpStatus.BAD_REQUEST);
    });

    it('resending for unknown email → 400', async () => {
      await resendConfirmation(
        app,
        'nobody@example.com',
        HttpStatus.BAD_REQUEST,
      );
    });
  });

  describe('POST /auth/login', () => {
    it('returns accessToken in body and refreshToken in a secure httpOnly cookie', async () => {
      const input = userData();
      await createUser(app, input);

      const response = await loginRaw(
        app,
        { loginOrEmail: input.login, password: input.password },
        HttpStatus.OK,
      );

      // body: only accessToken, refresh token must not leak into JSON
      expect(response.body).toEqual({
        accessToken: expect.stringMatching(JWT_REGEX) as unknown,
      });

      const cookies = parseSetCookie(response.headers['set-cookie']);
      expect(cookies).toHaveLength(1);
      expect(cookies[0].name).toBe('refreshToken');
      expect(cookies[0].value).toMatch(JWT_REGEX);
      expect(cookies[0].attributes).toEqual(
        expect.arrayContaining(['Path=/', 'HttpOnly', 'Secure']),
      );
    });

    it('logs in by login and by email (case-insensitive email)', async () => {
      const input = userData();
      await createUser(app, input);

      await login(app, input.login, input.password);
      await login(app, `  ${input.email.toUpperCase()} `, input.password);
    });

    it('returns 401 for wrong password', async () => {
      const input = userData();
      await createUser(app, input);

      await loginRaw(
        app,
        { loginOrEmail: input.login, password: 'wrong-pass' },
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('returns 401 for unknown user', async () => {
      await loginRaw(
        app,
        { loginOrEmail: 'nobody', password: 'qwerty123' },
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('GET /auth/me', () => {
    it('returns current user', async () => {
      const { user, accessToken } = await createAndLoginUser(app);

      const me = await getMe(app, accessToken);

      expect(me).toEqual({
        userId: user.id,
        login: user.login,
        email: user.email,
      });
    });

    it('returns 401 for invalid token', async () => {
      await getMe(app, 'invalid', HttpStatus.UNAUTHORIZED);
    });
  });

  describe('refresh token rotation', () => {
    it('sets new refreshToken cookie with the same security flags', async () => {
      const { refreshToken } = await createAndLoginUser(app);
      await waitNextSecond();

      const response = await refreshTokensRaw(app, refreshToken, HttpStatus.OK);

      expect(response.body).toEqual({
        accessToken: expect.stringMatching(JWT_REGEX) as unknown,
      });
      const [cookie] = parseSetCookie(response.headers['set-cookie']);
      expect(cookie.name).toBe('refreshToken');
      expect(cookie.value).toMatch(JWT_REGEX);
      expect(cookie.value).not.toBe(refreshToken);
      expect(cookie.attributes).toEqual(
        expect.arrayContaining(['Path=/', 'HttpOnly', 'Secure']),
      );
    });

    it('issues new pair; old refresh token becomes invalid', async () => {
      const { refreshToken } = await createAndLoginUser(app);
      await waitNextSecond();

      const next = await refreshTokens(app, refreshToken);

      expect(next.refreshToken).not.toBe(refreshToken);
      await refreshTokensRaw(app, refreshToken, HttpStatus.UNAUTHORIZED);
      await refreshTokens(app, next.refreshToken);
    });

    it('returns 401 without cookie', async () => {
      await refreshTokensRaw(app, null, HttpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /auth/logout', () => {
    it('clears refreshToken cookie (empty value, expired)', async () => {
      const { refreshToken } = await createAndLoginUser(app);

      const response = await logout(app, refreshToken);

      const [cookie] = parseSetCookie(response.headers['set-cookie']);
      expect(cookie.name).toBe('refreshToken');
      expect(cookie.value).toBe('');
      const expires = cookie.attributes.find((a) => a.startsWith('Expires='));
      expect(expires).toBeDefined();
      expect(
        new Date(expires!.slice('Expires='.length)).getTime(),
      ).toBeLessThan(Date.now());
    });

    it('logs out; refresh token no longer works', async () => {
      const { refreshToken } = await createAndLoginUser(app);

      await logout(app, refreshToken);

      await refreshTokensRaw(app, refreshToken, HttpStatus.UNAUTHORIZED);
      await logout(app, refreshToken, HttpStatus.UNAUTHORIZED);
    });

    it('returns 401 without cookie', async () => {
      await logout(app, null, HttpStatus.UNAUTHORIZED);
    });
  });

  describe('password recovery', () => {
    it('recovery code → new password → old password stops working', async () => {
      const input = userData();
      await createUser(app, input);

      await passwordRecovery(app, input.email);
      const recoveryCode = getLastSentCode(input.email, TemplateType.Recovery);
      await newPassword(app, { newPassword: 'newPass123', recoveryCode });

      await login(app, input.login, 'newPass123');
      await loginRaw(
        app,
        { loginOrEmail: input.login, password: input.password },
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('unknown email → 204 and no email sent (no user enumeration)', async () => {
      await passwordRecovery(app, 'nobody@example.com');

      expect(emailSenderMock.send).not.toHaveBeenCalled();
    });

    it('recovery code cannot be used twice', async () => {
      const input = userData();
      await createUser(app, input);
      await passwordRecovery(app, input.email);
      const recoveryCode = getLastSentCode(input.email, TemplateType.Recovery);
      await newPassword(app, { newPassword: 'newPass123', recoveryCode });

      await newPassword(
        app,
        { newPassword: 'another123', recoveryCode },
        HttpStatus.BAD_REQUEST,
      );
    });

    it('second recovery request replaces the code: old code rejected, new code works', async () => {
      const input = userData();
      await createUser(app, input);

      // 1st request: no row in recovery_passwords yet -> INSERT
      await passwordRecovery(app, input.email);
      const firstCode = getLastSentCode(input.email, TemplateType.Recovery);

      // 2nd request for the same user: row already exists -> must UPDATE it.
      // With a plain INSERT this returned 500 (duplicate key recovery_passwords_pkey).
      await passwordRecovery(app, input.email);
      const secondCode = getLastSentCode(input.email, TemplateType.Recovery);

      expect(secondCode).not.toBe(firstCode);

      // the first code was overwritten, so it no longer exists
      await newPassword(
        app,
        { newPassword: 'oldCode123', recoveryCode: firstCode },
        HttpStatus.BAD_REQUEST,
      );

      // the latest code works
      await newPassword(app, {
        newPassword: 'newPass123',
        recoveryCode: secondCode,
      });
      await login(app, input.login, 'newPass123');
    });
  });
});
