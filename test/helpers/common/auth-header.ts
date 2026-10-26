import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';

import { CoreConfig } from '../../../src/core/config/core.config';

/** `Basic base64(login:password)` built from the admin credentials in the test env. */
export const basicAuth = (app: INestApplication<App>): string => {
  const config = app.get(CoreConfig);
  const token = Buffer.from(
    `${config.adminUsername}:${config.adminPassword}`,
  ).toString('base64');
  return `Basic ${token}`;
};

export const invalidBasicAuth = (): string =>
  `Basic ${Buffer.from('wrong:credentials').toString('base64')}`;

export const bearer = (accessToken: string): string => `Bearer ${accessToken}`;
