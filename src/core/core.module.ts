import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CoreConfig } from './config/core.config';
import { RedisModule } from './config/redis/redis.module';
import { BaseAuthGuard } from './guards/base-auth.guard';
import { BcryptService } from './services/bcrypt.service';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [BcryptService, BaseAuthGuard, CoreConfig, RedisModule],
  exports: [BcryptService, BaseAuthGuard, CqrsModule, CoreConfig, RedisModule],
})
export class CoreModule {}
