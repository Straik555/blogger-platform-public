import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { LikeStatusEnum } from '../../src/core/types/like-status.type';
import {
  createAndLoginUser,
  LoggedInUser,
} from '../helpers/auth/create-and-login-user';
import { createBlog } from '../helpers/blogs/create-blog';
import { createComment } from '../helpers/comments/create-comment';
import { deleteComment } from '../helpers/comments/delete-comment';
import { getCommentById } from '../helpers/comments/get-comment-by-id';
import { getCommentsByPostId } from '../helpers/comments/get-comments-by-post-id';
import { updateComment } from '../helpers/comments/update-comment';
import { commentData } from '../helpers/common/test-data';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createPost } from '../helpers/posts/create-post';
import { deletePost } from '../helpers/posts/delete-post';

describe('Comments (e2e)', () => {
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

  describe('POST /posts/:postId/comments', () => {
    it('creates comment', async () => {
      const input = commentData();

      const comment = await createComment(
        app,
        postId,
        author.accessToken,
        input,
      );

      expect(comment).toEqual({
        id: expect.any(String) as unknown,
        content: input.content,
        createdAt: expect.any(String) as unknown,
        commentatorInfo: {
          userId: author.user.id,
          userLogin: author.user.login,
        },
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
        },
      });
    });

    it('returns 401 without token', async () => {
      await createComment(
        app,
        postId,
        'invalid',
        commentData(),
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('returns 404 for non-existent post', async () => {
      await createComment(
        app,
        nonExistentId(),
        author.accessToken,
        commentData(),
        HttpStatus.NOT_FOUND,
      );
    });
  });

  describe('GET /posts/:postId/comments', () => {
    it('returns comments of the post, newest first, paginated', async () => {
      const c1 = await createComment(app, postId, author.accessToken);
      const c2 = await createComment(app, postId, author.accessToken);
      const c3 = await createComment(app, postId, author.accessToken);

      const page1 = await getCommentsByPostId(app, postId, { pageSize: 2 });

      expect(page1).toMatchObject({
        totalCount: 3,
        pagesCount: 2,
        page: 1,
        pageSize: 2,
      });
      expect(page1.items.map((c) => c.id)).toEqual([c3.id, c2.id]);
      const page2 = await getCommentsByPostId(app, postId, {
        pageSize: 2,
        pageNumber: 2,
      });
      expect(page2.items.map((c) => c.id)).toEqual([c1.id]);
    });

    it('returns 404 for non-existent post', async () => {
      await getCommentsByPostId(app, nonExistentId(), {}, HttpStatus.NOT_FOUND);
    });

    it('returns 404 for deleted post', async () => {
      await deletePost(app, postId);
      await getCommentsByPostId(app, postId, {}, HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /comments/:id', () => {
    it('returns comment by id (public)', async () => {
      const created = await createComment(app, postId, author.accessToken);

      const comment = await getCommentById(app, created.id);

      expect(comment).toEqual(created);
    });

    it('returns 404 for non-existent comment', async () => {
      await getCommentById(app, nonExistentId(), HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /comments/:id', () => {
    it('author updates own comment', async () => {
      const created = await createComment(app, postId, author.accessToken);
      const update = commentData('Updated comment text, long enough');

      await updateComment(app, created.id, author.accessToken, update);

      const comment = await getCommentById(app, created.id);
      expect(comment.content).toBe(update.content);
    });

    it('returns 403 for another user', async () => {
      const created = await createComment(app, postId, author.accessToken);
      const other = await createAndLoginUser(app);

      await updateComment(
        app,
        created.id,
        other.accessToken,
        commentData(),
        HttpStatus.FORBIDDEN,
      );
    });

    it('returns 404 for non-existent comment', async () => {
      await updateComment(
        app,
        nonExistentId(),
        author.accessToken,
        commentData(),
        HttpStatus.NOT_FOUND,
      );
    });

    it('returns 401 without token', async () => {
      const created = await createComment(app, postId, author.accessToken);
      await updateComment(
        app,
        created.id,
        'invalid',
        commentData(),
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  describe('DELETE /comments/:id', () => {
    it('author deletes own comment', async () => {
      const created = await createComment(app, postId, author.accessToken);

      await deleteComment(app, created.id, author.accessToken);

      await getCommentById(app, created.id, HttpStatus.NOT_FOUND);
    });

    it('returns 403 for another user', async () => {
      const created = await createComment(app, postId, author.accessToken);
      const other = await createAndLoginUser(app);

      await deleteComment(
        app,
        created.id,
        other.accessToken,
        HttpStatus.FORBIDDEN,
      );
    });

    it('returns 404 for non-existent comment', async () => {
      await deleteComment(
        app,
        nonExistentId(),
        author.accessToken,
        HttpStatus.NOT_FOUND,
      );
    });
  });
});
