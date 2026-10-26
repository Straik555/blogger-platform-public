import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { createBlog } from '../helpers/blogs/create-blog';
import { deleteBlog } from '../helpers/blogs/delete-blog';
import { getBlogById } from '../helpers/blogs/get-blog-by-id';
import { getBlogsList } from '../helpers/blogs/get-blogs-list';
import { updateBlog } from '../helpers/blogs/update-blog';
import { invalidBasicAuth } from '../helpers/common/auth-header';
import { blogData } from '../helpers/common/test-data';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';

describe('Blogs (e2e)', () => {
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

  describe('GET /blogs', () => {
    it('returns empty list', async () => {
      const response = await getBlogsList(app);
      expect(response).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });

    it('returns created blogs, newest first by default', async () => {
      const first = await createBlog(app, blogData({ name: 'First' }));
      const second = await createBlog(app, blogData({ name: 'Second' }));

      const response = await getBlogsList(app);

      expect(response.totalCount).toBe(2);
      expect(response.items.map((b) => b.id)).toEqual([second.id, first.id]);
    });

    it('paginates', async () => {
      for (let i = 1; i <= 3; i++) {
        await createBlog(app, blogData({ name: `Blog ${i}` }));
      }

      const response = await getBlogsList(app, {
        pageSize: '2',
        pageNumber: '2',
      });

      expect(response).toMatchObject({
        pagesCount: 2,
        page: 2,
        pageSize: 2,
        totalCount: 3,
      });
      expect(response.items).toHaveLength(1);
    });

    it('filters by searchNameTerm (case-insensitive)', async () => {
      await createBlog(app, blogData({ name: 'Timma' }));
      await createBlog(app, blogData({ name: 'other' }));

      const response = await getBlogsList(app, { searchNameTerm: 'tim' });

      expect(response.totalCount).toBe(1);
      expect(response.items[0].name).toBe('Timma');
    });

    it('sorts by name asc (uppercase before lowercase)', async () => {
      await createBlog(app, blogData({ name: 'timm' }));
      await createBlog(app, blogData({ name: 'Timma' }));

      const response = await getBlogsList(app, {
        sortBy: 'name',
        sortDirection: 'asc',
      });

      expect(response.items.map((b) => b.name)).toEqual(['Timma', 'timm']);
    });
  });

  describe('POST /sa/blogs', () => {
    it('creates blog', async () => {
      const input = blogData();

      const blog = await createBlog(app, input);

      expect(blog).toEqual({
        id: expect.any(String) as unknown,
        name: input.name,
        description: input.description,
        websiteUrl: input.websiteUrl,
        createdAt: expect.any(String) as unknown,
        isMembership: false,
      });
    });

    it('returns 401 without basic auth', async () => {
      await createBlog(
        app,
        blogData(),
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });

  describe('GET /blogs/:id', () => {
    it('returns blog by id', async () => {
      const created = await createBlog(app);

      const blog = await getBlogById(app, created.id);

      expect(blog).toEqual(created);
    });

    it('returns 404 for non-existent id', async () => {
      await getBlogById(app, nonExistentId(), HttpStatus.NOT_FOUND);
    });

    it('returns 400 for invalid uuid', async () => {
      await getBlogById(app, 'not-a-uuid', HttpStatus.BAD_REQUEST);
    });
  });

  describe('PUT /sa/blogs/:id', () => {
    it('updates blog', async () => {
      const created = await createBlog(app);
      const update = blogData({
        name: 'Updated',
        description: 'Updated description',
        websiteUrl: 'https://updated.com',
      });

      await updateBlog(app, created.id, update);

      const blog = await getBlogById(app, created.id);
      expect(blog).toEqual({ ...created, ...update });
    });

    it('returns 404 for non-existent blog', async () => {
      await updateBlog(app, nonExistentId(), blogData(), HttpStatus.NOT_FOUND);
    });

    it('returns 401 without basic auth', async () => {
      const created = await createBlog(app);
      await updateBlog(
        app,
        created.id,
        blogData(),
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });

  describe('DELETE /sa/blogs/:id', () => {
    it('deletes blog', async () => {
      const created = await createBlog(app);

      await deleteBlog(app, created.id);

      await getBlogById(app, created.id, HttpStatus.NOT_FOUND);
      const list = await getBlogsList(app);
      expect(list.totalCount).toBe(0);
    });

    it('returns 404 when deleting twice', async () => {
      const created = await createBlog(app);
      await deleteBlog(app, created.id);

      await deleteBlog(app, created.id, HttpStatus.NOT_FOUND);
    });

    it('returns 401 without basic auth', async () => {
      const created = await createBlog(app);
      await deleteBlog(
        app,
        created.id,
        HttpStatus.UNAUTHORIZED,
        invalidBasicAuth(),
      );
    });
  });
});
