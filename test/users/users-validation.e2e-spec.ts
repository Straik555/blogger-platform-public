import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../src/core/path/router.path';
import { basicAuth } from '../helpers/common/auth-header';
import { expectValidationErrors } from '../helpers/common/errors';
import { userData } from '../helpers/common/test-data';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createUser } from '../helpers/users/create-user';

describe('Users validation (e2e)', () => {
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

  const createRaw = (body: Record<string, unknown>) =>
    request(app.getHttpServer())
      .post(`${ROUTER_PATH.sa}${ROUTER_PATH.users}`)
      .set('Authorization', basicAuth(app))
      .send(body)
      .expect(HttpStatus.BAD_REQUEST);

  it.each([
    ['login too short (2)', { login: 'ab' }, ['login']],
    ['login too long (11)', { login: 'a'.repeat(11) }, ['login']],
    ['login with forbidden chars', { login: 'ab cd' }, ['login']],
    ['email without @', { email: 'mail.com' }, ['email']],
    ['email without domain', { email: 'user@' }, ['email']],
    ['password too short (5)', { password: '12345' }, ['password']],
    ['password too long (21)', { password: 'a'.repeat(21) }, ['password']],
  ])('rejects %s', async (_, override, fields) => {
    const response = await createRaw({ ...userData(), ...override });
    expectValidationErrors(response, fields);
  });

  it('returns all invalid fields at once', async () => {
    const response = await createRaw({});
    expectValidationErrors(response, ['login', 'email', 'password']);
  });

  it('rejects duplicate login', async () => {
    const existing = userData();
    await createUser(app, existing);

    const response = await createRaw({
      ...userData({ login: existing.login }),
    });

    expectValidationErrors(response, ['login']);
  });

  it('rejects duplicate email (case-insensitive)', async () => {
    const existing = userData();
    await createUser(app, existing);

    const response = await createRaw({
      ...userData({ email: existing.email.toUpperCase() }),
    });

    expectValidationErrors(response, ['email']);
  });
});
