import { Module } from '@nestjs/common';
import Redis from 'ioredis';

import { CoreConfig } from '../core.config';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (coreConfig: CoreConfig): Redis => {
        return new Redis(coreConfig.redisUrl);
      },
      inject: [CoreConfig],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
