import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { UserViewDto } from '../../../src/modules/users/api/view-dto/user.view-dto';
import { userData } from '../common/test-data';
import { createUser } from '../users/create-user';
import { AuthTokens, login } from './login';

export type LoggedInUser = AuthTokens & {
  user: UserViewDto;
  password: string;
};

/** Creates a confirmed user via SA endpoint and logs in. */
export const createAndLoginUser = async (
  app: INestApplication<App>,
  userAgent?: string,
): Promise<LoggedInUser> => {
  const input = userData();
  const user = await createUser(app, input);
  const tokens = await login(app, input.login, input.password, userAgent);
  return { user, password: input.password, ...tokens };
};
