import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../src/core/path/router.path';
import { createBlog } from '../helpers/blogs/create-blog';
import { basicAuth } from '../helpers/common/auth-header';
import { expectValidationErrors } from '../helpers/common/errors';
import { postData } from '../helpers/common/test-data';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';

describe('Posts validation (e2e)', () => {
  let app: INestApplication<App>;
  let blogId: string;

  beforeAll(async () => {
    app = await initSettings();
  });

  beforeEach(async () => {
    blogId = (await createBlog(app)).id;
  });

  afterEach(async () => {
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const createRaw = (body: Record<string, unknown>) =>
    request(app.getHttpServer())
      .post(ROUTER_PATH.posts)
      .set('Authorization', basicAuth(app))
      .send(body)
      .expect(HttpStatus.BAD_REQUEST);

  it.each([
    ['title empty', { title: '' }, ['title']],
    ['title only spaces', { title: '   ' }, ['title']],
    ['title too long (31)', { title: 'a'.repeat(31) }, ['title']],
    ['shortDescription empty', { shortDescription: '' }, ['shortDescription']],
    [
      'shortDescription too long (101)',
      { shortDescription: 'a'.repeat(101) },
      ['shortDescription'],
    ],
    ['content empty', { content: '' }, ['content']],
    ['content too long (1001)', { content: 'a'.repeat(1001) }, ['content']],
  ])('rejects %s', async (_, override, fields) => {
    const response = await createRaw({ ...postData(), blogId, ...override });
    expectValidationErrors(response, fields);
  });

  it('rejects blogId that is not a uuid', async () => {
    const response = await createRaw({ ...postData(), blogId: 'abc' });
    expectValidationErrors(response, ['blogId']);
  });

  // Current API answers 404 here. If your homework spec requires 400 with
  // field "blogId", change the expectation and the use case accordingly.
  it('returns 404 for blogId of non-existent blog', async () => {
    await request(app.getHttpServer())
      .post(ROUTER_PATH.posts)
      .set('Authorization', basicAuth(app))
      .send({ ...postData(), blogId: nonExistentId() })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('returns all invalid fields at once', async () => {
    const response = await createRaw({});
    expectValidationErrors(response, [
      'title',
      'shortDescription',
      'content',
      'blogId',
    ]);
  });
});
