import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS_CLIENT } from '../../../core/config/redis/redis.module';
import { Session } from '../domain/session.entity';

const SESSIONS_CACHE_PREFIX = 'blogger-platform:sessions';

@Injectable()
export class SessionsCacheRepository {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  private getKey(deviceId: string): string {
    return `${SESSIONS_CACHE_PREFIX}:${deviceId}`;
  }

  async set(
    deviceId: string,
    session: Session,
    ttlSeconds: number,
  ): Promise<void> {
    const key = this.getKey(deviceId);
    const value = JSON.stringify(session);
    await this.redisClient.set(key, value, 'EX', ttlSeconds);
  }

  async get(deviceId: string): Promise<Session | null> {
    const key = this.getKey(deviceId);
    const raw = await this.redisClient.get(key);

    if (!raw) {
      return null;
    }
    const plainObject = JSON.parse(raw) as Record<string, unknown>;
    return this.hydrateSession(plainObject);
  }

  async update(
    deviceId: string,
    session: Session,
    ttlSeconds: number,
  ): Promise<void> {
    await this.set(deviceId, session, ttlSeconds);
  }

  async delete(deviceId: string): Promise<void> {
    const key = this.getKey(deviceId);
    await this.redisClient.del(key);
  }

  async deleteMany(deviceIds: string[]): Promise<void> {
    if (deviceIds.length === 0) return;
    const keys = deviceIds.map((deviceId) => this.getKey(deviceId));
    await this.redisClient.del(...keys);
  }

  private hydrateSession(plainObject: Record<string, unknown>): Session {
    const session = new Session();
    session.deviceId = plainObject.deviceId as string;
    session.userId = plainObject.userId as string;
    session.ip = plainObject.ip as string;
    session.deviceName = plainObject.deviceName as string;
    session.expirationDate = new Date(plainObject.expirationDate as string);
    session.createdAt = new Date(plainObject.createdAt as string);
    session.updatedAt = new Date(plainObject.updatedAt as string);
    session.version = plainObject.version as number;
    return session;
  }
}
