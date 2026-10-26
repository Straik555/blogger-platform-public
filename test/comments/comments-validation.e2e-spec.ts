import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../src/core/path/router.path';
import {
  createAndLoginUser,
  LoggedInUser,
} from '../helpers/auth/create-and-login-user';
import { createBlog } from '../helpers/blogs/create-blog';
import { createComment } from '../helpers/comments/create-comment';
import { updateComment } from '../helpers/comments/update-comment';
import { bearer } from '../helpers/common/auth-header';
import { expectValidationErrors } from '../helpers/common/errors';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createPost } from '../helpers/posts/create-post';

describe('Comments validation (e2e)', () => {
  let app: INestApplication<App>;
  let postId: string;
  let author: LoggedInUser;

  beforeAll(async () => {
    app = await initSettings();
  });

  beforeEach(async () => {
    const blog = await createBlog(app);
    postId = (await createPost(app, blog.id)).id;
    author = await createAndLoginUser(app);
  });

  afterEach(async () => {
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const createRaw = (body: Record<string, unknown>) =>
    request(app.getHttpServer())
      .post(`${ROUTER_PATH.posts}/${postId}${ROUTER_PATH.comments}`)
      .set('Authorization', bearer(author.accessToken))
      .send(body)
      .expect(HttpStatus.BAD_REQUEST);

  const invalidContents: [string, unknown][] = [
    ['empty', ''],
    ['too short (19)', 'a'.repeat(19)],
    ['19 chars padded with spaces', `     ${'a'.repeat(19)}     `],
    ['too long (301)', 'a'.repeat(301)],
  ];

  it.each(invalidContents)('create rejects content %s', async (_, content) => {
    const response = await createRaw({ content });
    expectValidationErrors(response, ['content']);
  });

  it.each(invalidContents)('update rejects content %s', async (_, content) => {
    const comment = await createComment(app, postId, author.accessToken);

    const response = await updateComment(
      app,
      comment.id,
      author.accessToken,
      { content },
      HttpStatus.BAD_REQUEST,
    );

    expectValidationErrors(response, ['content']);
  });

  it('rejects missing content', async () => {
    const response = await createRaw({});
    expectValidationErrors(response, ['content']);
  });
});
