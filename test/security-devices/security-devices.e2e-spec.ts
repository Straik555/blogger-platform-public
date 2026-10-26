import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { createAndLoginUser } from '../helpers/auth/create-and-login-user';
import { login } from '../helpers/auth/login';
import {
  logout,
  refreshTokens,
  refreshTokensRaw,
} from '../helpers/auth/refresh-token';
import {
  deviceIdFromRefreshToken,
  nonExistentId,
  waitNextSecond,
} from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import {
  deleteDevice,
  deleteOtherDevices,
  getDevices,
} from '../helpers/security-devices/security-devices';

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

describe('Security devices (e2e)', () => {
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

  /** One user logged in from 3 devices. */
  const loginFromThreeDevices = async () => {
    const main = await createAndLoginUser(app, CHROME_UA);
    const login2 = await login(app, main.user.login, main.password, SAFARI_UA);
    const login3 = await login(
      app,
      main.user.email,
      main.password,
      'some-cli/1.0',
    );
    return {
      main,
      tokens: [main.refreshToken, login2.refreshToken, login3.refreshToken],
    };
  };

  describe('GET /security/devices', () => {
    it('lists all sessions of the user', async () => {
      const { tokens } = await loginFromThreeDevices();

      const devices = await getDevices(app, tokens[0]);

      expect(devices).toHaveLength(3);
      devices.forEach((device) => {
        expect(device).toEqual({
          ip: expect.any(String) as unknown,
          title: expect.any(String) as unknown,
          lastActiveDate: expect.any(String) as unknown,
          deviceId: expect.any(String) as unknown,
        });
      });
    });

    it('lastActiveDate changes after refresh, deviceId stays', async () => {
      const { tokens } = await loginFromThreeDevices();
      const before = await getDevices(app, tokens[0]);
      await waitNextSecond();

      const next = await refreshTokens(app, tokens[0]);

      const after = await getDevices(app, next.refreshToken);
      expect(after.map((d) => d.deviceId).sort()).toEqual(
        before.map((d) => d.deviceId).sort(),
      );
      const refreshedId = deviceIdFromRefreshToken(tokens[0]);
      const lastActive = (list: typeof before) =>
        list.find((d) => d.deviceId === refreshedId)?.lastActiveDate;
      expect(lastActive(after)).not.toBe(lastActive(before));
    });

    it('returns 401 without refresh token', async () => {
      await getDevices(app, 'invalid', HttpStatus.UNAUTHORIZED);
    });
  });

  describe('DELETE /security/devices/:deviceId', () => {
    it('deletes another own session; its refresh token stops working', async () => {
      const { tokens } = await loginFromThreeDevices();
      const secondDeviceId = deviceIdFromRefreshToken(tokens[1]);

      await deleteDevice(app, tokens[0], secondDeviceId);

      const left = await getDevices(app, tokens[0]);
      expect(left).toHaveLength(2);
      expect(left.map((d) => d.deviceId)).not.toContain(secondDeviceId);
      await refreshTokensRaw(app, tokens[1], HttpStatus.UNAUTHORIZED);
    });

    it('returns 403 for a device of another user', async () => {
      const first = await createAndLoginUser(app);
      const second = await createAndLoginUser(app);
      const [secondDevice] = await getDevices(app, second.refreshToken);

      await deleteDevice(
        app,
        first.refreshToken,
        secondDevice.deviceId,
        HttpStatus.FORBIDDEN,
      );
    });

    it('returns 404 for non-existent device', async () => {
      const { refreshToken } = await createAndLoginUser(app);
      await deleteDevice(
        app,
        refreshToken,
        nonExistentId(),
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('DELETE /security/devices', () => {
    it('terminates all sessions except current', async () => {
      const { tokens } = await loginFromThreeDevices();

      await deleteOtherDevices(app, tokens[0]);

      const devices = await getDevices(app, tokens[0]);
      expect(devices).toHaveLength(1);
      await refreshTokensRaw(app, tokens[1], HttpStatus.UNAUTHORIZED);
      await refreshTokensRaw(app, tokens[2], HttpStatus.UNAUTHORIZED);
    });
  });

  describe('logout', () => {
    it('removes only the current session', async () => {
      const { tokens } = await loginFromThreeDevices();

      await logout(app, tokens[2]);

      const devices = await getDevices(app, tokens[0]);
      expect(devices).toHaveLength(2);
    });
  });
});
