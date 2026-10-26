import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { LikeStatusEnum } from '../../src/core/types/like-status.type';
import {
  createAndLoginUser,
  LoggedInUser,
} from '../helpers/auth/create-and-login-user';
import { createBlog } from '../helpers/blogs/create-blog';
import { expectValidationErrors } from '../helpers/common/errors';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createPost } from '../helpers/posts/create-post';
import { getPostById } from '../helpers/posts/get-post-by-id';
import { getPostsList } from '../helpers/posts/get-posts-list';
import { updatePostLikeStatus } from '../helpers/posts/update-post-like-status';

describe('Post likes (e2e)', () => {
  let app: INestApplication<App>;
  let postId: string;
  let user1: LoggedInUser;

  beforeAll(async () => {
    app = await initSettings();
  });

  beforeEach(async () => {
    const blog = await createBlog(app);
    postId = (await createPost(app, blog.id)).id;
    user1 = await createAndLoginUser(app);
  });

  afterEach(async () => {
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('like → counters and myStatus updated', async () => {
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );

    const post = await getPostById(
      app,
      postId,
      HttpStatus.OK,
      user1.accessToken,
    );

    expect(post.extendedLikesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.Like,
      newestLikes: [
        {
          addedAt: expect.any(String) as unknown,
          userId: user1.user.id,
          login: user1.user.login,
        },
      ],
    });
  });

  it('like twice does not duplicate', async () => {
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );

    const post = await getPostById(app, postId);
    expect(post.extendedLikesInfo.likesCount).toBe(1);
  });

  it('like → dislike → none', async () => {
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Dislike,
    );

    let post = await getPostById(app, postId, HttpStatus.OK, user1.accessToken);
    expect(post.extendedLikesInfo).toMatchObject({
      likesCount: 0,
      dislikesCount: 1,
      myStatus: LikeStatusEnum.Dislike,
      newestLikes: [],
    });

    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.None,
    );

    post = await getPostById(app, postId, HttpStatus.OK, user1.accessToken);
    expect(post.extendedLikesInfo).toMatchObject({
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
    });
  });

  it('myStatus is per user; anonymous sees None', async () => {
    const user2 = await createAndLoginUser(app);
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );
    await updatePostLikeStatus(
      app,
      postId,
      user2.accessToken,
      LikeStatusEnum.Dislike,
    );

    const asUser1 = await getPostById(
      app,
      postId,
      HttpStatus.OK,
      user1.accessToken,
    );
    const asUser2 = await getPostById(
      app,
      postId,
      HttpStatus.OK,
      user2.accessToken,
    );
    const anonymous = await getPostById(app, postId);

    expect(asUser1.extendedLikesInfo.myStatus).toBe(LikeStatusEnum.Like);
    expect(asUser2.extendedLikesInfo.myStatus).toBe(LikeStatusEnum.Dislike);
    expect(anonymous.extendedLikesInfo).toMatchObject({
      likesCount: 1,
      dislikesCount: 1,
      myStatus: LikeStatusEnum.None,
    });
  });

  it('newestLikes: last 3 likes, newest first', async () => {
    const users = [user1];
    for (let i = 0; i < 3; i++) users.push(await createAndLoginUser(app));
    for (const u of users) {
      await updatePostLikeStatus(
        app,
        postId,
        u.accessToken,
        LikeStatusEnum.Like,
      );
    }

    const post = await getPostById(app, postId);

    expect(post.extendedLikesInfo.likesCount).toBe(4);
    expect(post.extendedLikesInfo.newestLikes.map((l) => l.userId)).toEqual(
      users
        .slice(1)
        .reverse()
        .map((u) => u.user.id),
    );
  });

  it('list endpoint returns myStatus for each post', async () => {
    await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );

    const list = await getPostsList(app, {}, HttpStatus.OK, user1.accessToken);

    expect(list.items[0].extendedLikesInfo.myStatus).toBe(LikeStatusEnum.Like);
  });

  it('returns 400 for invalid likeStatus', async () => {
    const response = await updatePostLikeStatus(
      app,
      postId,
      user1.accessToken,
      'Super',
      HttpStatus.BAD_REQUEST,
    );
    expectValidationErrors(response, ['likeStatus']);
  });

  it('returns 401 without token', async () => {
    await updatePostLikeStatus(
      app,
      postId,
      'invalid-token',
      LikeStatusEnum.Like,
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('returns 404 for non-existent post', async () => {
    await updatePostLikeStatus(
      app,
      nonExistentId(),
      user1.accessToken,
      LikeStatusEnum.Like,
      HttpStatus.NOT_FOUND,
    );
  });
});
