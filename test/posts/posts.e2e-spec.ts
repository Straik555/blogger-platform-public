import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { LikeStatusEnum } from '../../src/core/types/like-status.type';
import { createBlog } from '../helpers/blogs/create-blog';
import { invalidBasicAuth } from '../helpers/common/auth-header';
import { postData } from '../helpers/common/test-data';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createPost } from '../helpers/posts/create-post';
import { deletePost } from '../helpers/posts/delete-post';
import { getPostById } from '../helpers/posts/get-post-by-id';
import { getPostsList } from '../helpers/posts/get-posts-list';
import { updatePost } from '../helpers/posts/update-post';

describe('Posts (e2e)', () => {
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

  describe('GET /posts', () => {
    it('returns empty list', async () => {
      const response = await getPostsList(app);
      expect(response).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });

    it('returns posts from all blogs with pagination', async () => {
      const blogA = await createBlog(app);
      const blogB = await createBlog(app);
      await createPost(app, blogA.id);
      await createPost(app, blogB.id);
      await createPost(app, blogB.id);

      const response = await getPostsList(app, { pageSize: 2 });

      expect(response).toMatchObject({
        totalCount: 3,
        pagesCount: 2,
        pageSize: 2,
      });
      expect(response.items).toHaveLength(2);
    });

    it('sorts by title asc', async () => {
      const blog = await createBlog(app);
      await createPost(app, blog.id, postData({ title: 'b' }));
      await createPost(app, blog.id, postData({ title: 'a' }));

      const response = await getPostsList(app, {
        sortBy: 'title',
        sortDirection: 'asc',
      });

      expect(response.items.map((p) => p.title)).toEqual(['a', 'b']);
    });
  });

  describe('POST /posts', () => {
    it('creates post', async () => {
      const blog = await createBlog(app);
      const input = postData();

      const post = await createPost(app, blog.id, input);

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

    it('returns 401 without basic auth', async () => {
      const blog = await createBlog(app);
      await createPost(
        app,
        blog.id,
        postData(),
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });

  describe('GET /posts/:id', () => {
    it('returns post by id', async () => {
      const blog = await createBlog(app);
      const created = await createPost(app, blog.id);

      const post = await getPostById(app, created.id);

      expect(post).toEqual(created);
    });

    it('returns 404 for non-existent id', async () => {
      await getPostById(app, nonExistentId(), HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /posts/:id', () => {
    it('updates post', async () => {
      const blog = await createBlog(app);
      const created = await createPost(app, blog.id);
      const update = postData({ title: 'New title', content: 'New content' });

      await updatePost(app, created.id, { ...update, blogId: blog.id });

      const post = await getPostById(app, created.id);
      expect(post).toEqual({ ...created, ...update });
    });

    it('returns 404 for non-existent post', async () => {
      const blog = await createBlog(app);
      await updatePost(
        app,
        nonExistentId(),
        { ...postData(), blogId: blog.id },
        HttpStatus.NOT_FOUND,
      );
    });

    it('returns 401 without basic auth', async () => {
      const blog = await createBlog(app);
      const created = await createPost(app, blog.id);
      await updatePost(
        app,
        created.id,
        { ...postData(), blogId: blog.id },
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });

  describe('DELETE /posts/:id', () => {
    it('deletes post', async () => {
      const blog = await createBlog(app);
      const created = await createPost(app, blog.id);

      await deletePost(app, created.id);

      await getPostById(app, created.id, HttpStatus.NOT_FOUND);
    });

    it('returns 404 when deleting twice', async () => {
      const blog = await createBlog(app);
      const created = await createPost(app, blog.id);
      await deletePost(app, created.id);

      await deletePost(app, created.id, HttpStatus.NOT_FOUND);
    });

    it('returns 401 without basic auth', async () => {
      const blog = await createBlog(app);
      const created = await createPost(app, blog.id);
      await deletePost(
        app,
        created.id,
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });
});
