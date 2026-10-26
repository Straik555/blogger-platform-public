import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { loginRaw } from '../helpers/auth/login';
import { invalidBasicAuth } from '../helpers/common/auth-header';
import { userData } from '../helpers/common/test-data';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createUser } from '../helpers/users/create-user';
import { deleteUser } from '../helpers/users/delete-user';
import { getUsersList } from '../helpers/users/get-users-list';

describe('Users (e2e)', () => {
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

  describe('POST /sa/users', () => {
    it('creates user (password is not returned)', async () => {
      const input = userData();

      const user = await createUser(app, input);

      expect(user).toEqual({
        id: expect.any(String) as unknown,
        login: input.login,
        email: input.email,
        createdAt: expect.any(String) as unknown,
      });
    });

    it('stores email in lower case', async () => {
      const input = userData();

      const user = await createUser(app, {
        ...input,
        email: input.email.toUpperCase(),
      });

      expect(user.email).toBe(input.email.toLowerCase());
    });

    it('returns 401 without basic auth', async () => {
      await createUser(
        app,
        userData(),
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });

  describe('GET /sa/users', () => {
    it('returns empty list', async () => {
      const response = await getUsersList(app);
      expect(response).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });

    it('returns users newest first with pagination', async () => {
      const u1 = await createUser(app);
      const u2 = await createUser(app);
      const u3 = await createUser(app);

      const page1 = await getUsersList(app, { pageSize: 2 });
      const page2 = await getUsersList(app, { pageSize: 2, pageNumber: 2 });

      expect(page1).toMatchObject({ totalCount: 3, pagesCount: 2 });
      expect(page1.items.map((u) => u.id)).toEqual([u3.id, u2.id]);
      expect(page2.items.map((u) => u.id)).toEqual([u1.id]);
    });

    it('searchLoginTerm OR searchEmailTerm', async () => {
      await createUser(
        app,
        userData({ login: 'alpha', email: 'one@mail.com' }),
      );
      await createUser(app, userData({ login: 'beta', email: 'two@mail.com' }));
      await createUser(
        app,
        userData({ login: 'gamma', email: 'three@mail.com' }),
      );

      const response = await getUsersList(app, {
        searchLoginTerm: 'alp',
        searchEmailTerm: 'two',
      });

      expect(response.items.map((u) => u.login).sort()).toEqual([
        'alpha',
        'beta',
      ]);
    });

    it('returns 401 without basic auth', async () => {
      await getUsersList(app, {}, HttpStatus.UNAUTHORIZED, invalidBasicAuth());
    });
  });

  describe('DELETE /sa/users/:id', () => {
    it('deletes user; deleted user cannot log in', async () => {
      const input = userData();
      const user = await createUser(app, input);

      await deleteUser(app, user.id);

      const list = await getUsersList(app);
      expect(list.totalCount).toBe(0);
      await loginRaw(
        app,
        { loginOrEmail: input.login, password: input.password },
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('returns 404 for non-existent user', async () => {
      await deleteUser(app, nonExistentId(), HttpStatus.NOT_FOUND);
    });

    it('returns 401 without basic auth', async () => {
      const user = await createUser(app);
      await deleteUser(
        app,
        user.id,
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });
});
