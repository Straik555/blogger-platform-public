import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { LikeStatusEnum } from '../../src/core/types/like-status.type';
import { createAndLoginUser } from '../helpers/auth/create-and-login-user';
import { createBlog } from '../helpers/blogs/create-blog';
import { createPostByBlogId } from '../helpers/blogs/create-post-by-blog-id';
import { deleteBlog } from '../helpers/blogs/delete-blog';
import { deletePostByBlogId } from '../helpers/blogs/delete-post-by-blog-id';
import { getPostsByBlogId } from '../helpers/blogs/get-posts-by-blog-id';
import { updatePostByBlogId } from '../helpers/blogs/update-post-by-blog-id';
import { invalidBasicAuth } from '../helpers/common/auth-header';
import { postData } from '../helpers/common/test-data';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { getPostById } from '../helpers/posts/get-post-by-id';
import { updatePostLikeStatus } from '../helpers/posts/update-post-like-status';

describe('Blog posts (e2e)', () => {
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

  describe('POST /sa/blogs/:blogId/posts', () => {
    it('creates post in blog', async () => {
      const blog = await createBlog(app);
      const input = postData();

      const post = await createPostByBlogId(app, blog.id, input);

      expect(post).toEqual({
        id: expect.any(String) as unknown,
        ...input,
        blogId: blog.id,
        blogName: blog.name,
        createdAt: expect.any(String) as unknown,
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatusEnum.None,
          newestLikes: [],
        },
      });
    });

    it('returns 404 for non-existent blog', async () => {
      await createPostByBlogId(
        app,
        nonExistentId(),
        postData(),
        HttpStatus.NOT_FOUND,
      );
    });

    it('returns 404 for deleted blog', async () => {
      const blog = await createBlog(app);
      await deleteBlog(app, blog.id);

      await createPostByBlogId(app, blog.id, postData(), HttpStatus.NOT_FOUND);
    });

    it('returns 401 without basic auth', async () => {
      const blog = await createBlog(app);
      await createPostByBlogId(
        app,
        blog.id,
        postData(),
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });

    it('returns 401 without auth header', async () => {
      const blog = await createBlog(app);
      await createPostByBlogId(app, blog.id, {}, HttpStatus.UNAUTHORIZED, null);
    });
  });

  describe('GET /blogs/:blogId/posts (public)', () => {
    it('returns only posts of this blog, newest first', async () => {
      const blog = await createBlog(app);
      const other = await createBlog(app);
      const first = await createPostByBlogId(
        app,
        blog.id,
        postData({ title: 'one' }),
      );
      const second = await createPostByBlogId(
        app,
        blog.id,
        postData({ title: 'two' }),
      );
      await createPostByBlogId(app, other.id);

      const response = await getPostsByBlogId(app, blog.id);

      expect(response.totalCount).toBe(2);
      expect(response.items.map((p) => p.id)).toEqual([second.id, first.id]);
    });

    it('returns 404 for non-existent blog', async () => {
      await getPostsByBlogId(app, nonExistentId(), {}, HttpStatus.NOT_FOUND);
    });

    it('returns myStatus for authorized user and None for anonymous', async () => {
      const blog = await createBlog(app);
      const post = await createPostByBlogId(app, blog.id);
      const { accessToken } = await createAndLoginUser(app);
      await updatePostLikeStatus(
        app,
        post.id,
        accessToken,
        LikeStatusEnum.Like,
      );

      const asUser = await getPostsByBlogId(
        app,
        blog.id,
        {},
        HttpStatus.OK,
        accessToken,
      );
      const anonymous = await getPostsByBlogId(app, blog.id);

      expect(asUser.items[0].extendedLikesInfo.myStatus).toBe(
        LikeStatusEnum.Like,
      );
      expect(anonymous.items[0].extendedLikesInfo.myStatus).toBe(
        LikeStatusEnum.None,
      );
      expect(anonymous.items[0].extendedLikesInfo.likesCount).toBe(1);
    });
  });

  describe('PUT /sa/blogs/:blogId/posts/:postId', () => {
    it('updates post', async () => {
      const blog = await createBlog(app);
      const post = await createPostByBlogId(app, blog.id);
      const update = postData({ title: 'Updated title' });

      await updatePostByBlogId(app, blog.id, post.id, update);

      const updated = await getPostById(app, post.id);
      expect(updated).toEqual({ ...post, ...update });
    });

    it('returns 404 when post belongs to another blog', async () => {
      const blog = await createBlog(app);
      const other = await createBlog(app);
      const post = await createPostByBlogId(app, blog.id);

      await updatePostByBlogId(
        app,
        other.id,
        post.id,
        postData(),
        HttpStatus.NOT_FOUND,
      );
    });

    it('returns 401 without auth header and with wrong credentials', async () => {
      const blog = await createBlog(app);
      const post = await createPostByBlogId(app, blog.id);

      // empty body on purpose: the guard must answer 401 before body validation (400)
      await updatePostByBlogId(
        app,
        blog.id,
        post.id,
        {},
        HttpStatus.UNAUTHORIZED,
        null,
      );
      await updatePostByBlogId(
        app,
        blog.id,
        post.id,
        {},
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });

  describe('DELETE /sa/blogs/:blogId/posts/:postId', () => {
    it('deletes post', async () => {
      const blog = await createBlog(app);
      const post = await createPostByBlogId(app, blog.id);

      await deletePostByBlogId(app, blog.id, post.id);

      await getPostById(app, post.id, HttpStatus.NOT_FOUND);
    });

    it('returns 404 for non-existent post', async () => {
      const blog = await createBlog(app);
      await deletePostByBlogId(
        app,
        blog.id,
        nonExistentId(),
        HttpStatus.NOT_FOUND,
      );
    });

    it('returns 401 without auth header and with wrong credentials', async () => {
      const blog = await createBlog(app);
      const post = await createPostByBlogId(app, blog.id);

      await deletePostByBlogId(
        app,
        blog.id,
        post.id,
        HttpStatus.UNAUTHORIZED,
        null,
      );
      await deletePostByBlogId(
        app,
        blog.id,
        post.id,
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );

      // the post must still exist after unauthorized delete attempts
      await getPostById(app, post.id);
    });
  });
});
