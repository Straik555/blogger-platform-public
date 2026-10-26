import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { LikeStatusEnum } from '../../src/core/types/like-status.type';
import {
  createAndLoginUser,
  LoggedInUser,
} from '../helpers/auth/create-and-login-user';
import { createBlog } from '../helpers/blogs/create-blog';
import { createComment } from '../helpers/comments/create-comment';
import { getCommentById } from '../helpers/comments/get-comment-by-id';
import { getCommentsByPostId } from '../helpers/comments/get-comments-by-post-id';
import { updateCommentLikeStatus } from '../helpers/comments/update-comment-like-status';
import { expectValidationErrors } from '../helpers/common/errors';
import { nonExistentId } from '../helpers/common/utils';
import { deleteAllData, initSettings } from '../helpers/init-settings';
import { createPost } from '../helpers/posts/create-post';

describe('Comment likes (e2e)', () => {
  let app: INestApplication<App>;
  let postId: string;
  let commentId: string;
  let user1: LoggedInUser;
  let user2: LoggedInUser;

  beforeAll(async () => {
    app = await initSettings();
  });

  beforeEach(async () => {
    const blog = await createBlog(app);
    postId = (await createPost(app, blog.id)).id;
    user1 = await createAndLoginUser(app);
    user2 = await createAndLoginUser(app);
    commentId = (await createComment(app, postId, user1.accessToken)).id;
  });

  afterEach(async () => {
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('like → counters and myStatus updated', async () => {
    await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      LikeStatusEnum.Like,
    );

    const asUser2 = await getCommentById(
      app,
      commentId,
      HttpStatus.OK,
      user2.accessToken,
    );
    const anonymous = await getCommentById(app, commentId);

    expect(asUser2.likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.Like,
    });
    expect(anonymous.likesInfo.myStatus).toBe(LikeStatusEnum.None);
  });

  it('like → dislike → none, no duplicates', async () => {
    await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      LikeStatusEnum.Like,
    );
    await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      LikeStatusEnum.Like,
    );
    await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      LikeStatusEnum.Dislike,
    );

    let comment = await getCommentById(
      app,
      commentId,
      HttpStatus.OK,
      user2.accessToken,
    );
    expect(comment.likesInfo).toEqual({
      likesCount: 0,
      dislikesCount: 1,
      myStatus: LikeStatusEnum.Dislike,
    });

    await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      LikeStatusEnum.None,
    );

    comment = await getCommentById(
      app,
      commentId,
      HttpStatus.OK,
      user2.accessToken,
    );
    expect(comment.likesInfo).toEqual({
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatusEnum.None,
    });
  });

  it('several users: counters sum up, myStatus is per user', async () => {
    await updateCommentLikeStatus(
      app,
      commentId,
      user1.accessToken,
      LikeStatusEnum.Like,
    );
    await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      LikeStatusEnum.Dislike,
    );

    const list = await getCommentsByPostId(
      app,
      postId,
      {},
      HttpStatus.OK,
      user1.accessToken,
    );

    expect(list.items[0].likesInfo).toEqual({
      likesCount: 1,
      dislikesCount: 1,
      myStatus: LikeStatusEnum.Like,
    });
  });

  it('returns 400 for invalid likeStatus', async () => {
    const response = await updateCommentLikeStatus(
      app,
      commentId,
      user2.accessToken,
      'Super',
      HttpStatus.BAD_REQUEST,
    );
    expectValidationErrors(response, ['likeStatus']);
  });

  it('returns 401 without token', async () => {
    await updateCommentLikeStatus(
      app,
      commentId,
      'invalid',
      LikeStatusEnum.Like,
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('returns 404 for non-existent comment', async () => {
    await updateCommentLikeStatus(
      app,
      nonExistentId(),
      user2.accessToken,
      LikeStatusEnum.Like,
      HttpStatus.NOT_FOUND,
    );
  });
});
