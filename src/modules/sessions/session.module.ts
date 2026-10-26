import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '../../core/config/redis/redis.module';
import { SessionsExternalService } from './application/external/sessions.external-service';
import { Session } from './domain/session.entity';
import { SessionsRepository } from './infrastructure/sessions.repository';
import { SessionsCacheRepository } from './infrastructure/sessions-cache.repository';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Session])],
  providers: [
    SessionsRepository,
    SessionsExternalService,
    SessionsCacheRepository,
  ],
  exports: [SessionsExternalService],
})
export class SessionModule {}
