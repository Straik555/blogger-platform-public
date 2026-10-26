import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../src/core/path/router.path';
import { createBlog } from '../helpers/blogs/create-blog';
import { basicAuth } from '../helpers/common/auth-header';
import { expectValidationErrors } from '../helpers/common/errors';
import { blogData } from '../helpers/common/test-data';
import { deleteAllData, initSettings } from '../helpers/init-settings';

describe('Blogs validation (e2e)', () => {
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
      .post(`${ROUTER_PATH.sa}${ROUTER_PATH.blogs}`)
      .set('Authorization', basicAuth(app))
      .send(body)
      .expect(HttpStatus.BAD_REQUEST);

  const updateRaw = (id: string, body: Record<string, unknown>) =>
    request(app.getHttpServer())
      .put(`${ROUTER_PATH.sa}${ROUTER_PATH.blogs}/${id}`)
      .set('Authorization', basicAuth(app))
      .send(body)
      .expect(HttpStatus.BAD_REQUEST);

  describe('POST /sa/blogs', () => {
    it.each([
      ['name empty', { name: '' }, ['name']],
      ['name only spaces', { name: '   ' }, ['name']],
      ['name too long (16)', { name: 'a'.repeat(16) }, ['name']],
      ['description empty', { description: '' }, ['description']],
      [
        'description too long (501)',
        { description: 'a'.repeat(501) },
        ['description'],
      ],
      [
        'websiteUrl not https',
        { websiteUrl: 'http://myblog.com' },
        ['websiteUrl'],
      ],
      [
        'websiteUrl without domain',
        { websiteUrl: 'https://myblog' },
        ['websiteUrl'],
      ],
      [
        'websiteUrl too long (101)',
        { websiteUrl: `https://${'a'.repeat(89)}.com` },
        ['websiteUrl'],
      ],
    ])('rejects %s', async (_, override, fields) => {
      const response = await createRaw({ ...blogData(), ...override });
      expectValidationErrors(response, fields);
    });

    it('returns all invalid fields at once', async () => {
      const response = await createRaw({});
      expectValidationErrors(response, ['name', 'description', 'websiteUrl']);
    });
  });

  describe('PUT /sa/blogs/:id', () => {
    it('rejects invalid body with all field errors', async () => {
      const blog = await createBlog(app);

      const response = await updateRaw(blog.id, {
        name: '',
        description: '',
        websiteUrl: 'not-url',
      });

      expectValidationErrors(response, ['name', 'description', 'websiteUrl']);
    });
  });
});
