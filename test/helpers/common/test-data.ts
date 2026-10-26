import { CreateBlogDto } from '../../../src/modules/content/blogs/dto/create-blog.dto';
import { CreatePostCommonDto } from '../../../src/modules/content/posts/dto/create-post-common.dto';
import { CreateUserDto } from '../../../src/modules/users/dto/create-user.dto';

/** Valid input factories. Pass overrides to build invalid variants. */
export const blogData = (
  overrides: Partial<CreateBlogDto> = {},
): CreateBlogDto => ({
  name: 'My blog',
  description: 'Blog about backend development',
  websiteUrl: 'https://myblog.com',
  ...overrides,
});

export const postData = (
  overrides: Partial<CreatePostCommonDto> = {},
): CreatePostCommonDto => ({
  title: 'First post',
  shortDescription: 'Short description of the post',
  content: 'Content of the first post',
  ...overrides,
});

let userCounter = 0;

/** Unique login/email on each call — login rule: 3-10 chars [a-zA-Z0-9_-]. */
export const userData = (
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto => {
  userCounter += 1;
  return {
    login: `user${userCounter}`,
    email: `user${userCounter}@example.com`,
    password: 'qwerty123',
    ...overrides,
  };
};

export const commentData = (
  content = 'This is a valid comment text!!',
): {
  content: string;
} => ({ content });
