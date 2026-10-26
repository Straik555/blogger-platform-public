import { Injectable, Logger } from '@nestjs/common';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import type { Session } from '../../domain/session.entity';
import { SessionsRepository } from '../../infrastructure/sessions.repository';
import { SessionsCacheRepository } from '../../infrastructure/sessions-cache.repository';

@Injectable()
export class SessionsExternalService {
  private readonly logger = new Logger(SessionsExternalService.name);

  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly sessionsCacheRepository: SessionsCacheRepository,
  ) {}

  // ---------- read ----------

  async findSessionOrThrow(userId: string, deviceId: string): Promise<Session> {
    let cached: Session | null = null;
    try {
      cached = await this.sessionsCacheRepository.get(deviceId);
    } catch (err) {
      this.logger.warn('Redis unavailable, falling back to Postgres', err);
    }
    if (cached && cached.userId === userId) {
      return cached;
    }

    const session =
      await this.sessionsRepository.findSessionByUserIdAndDeviceId(
        deviceId,
        userId,
      );
    if (!session) {
      throw this.unauthorized();
    }
    await this.writeCache(session);
    return session;
  }

  async findByDeviceId(deviceId: string): Promise<Session | null> {
    return this.sessionsRepository.findSessionDeviceId(deviceId);
  }

  async findAllActiveByUserId(userId: string): Promise<Session[]> {
    return this.sessionsRepository.findAllByUserId(userId);
  }

  // ---------- write ----------

  async create(session: Session): Promise<void> {
    await this.sessionsRepository.create(session);
    await this.writeCache(session);
  }

  async update(session: Session): Promise<void> {
    const updated = await this.sessionsRepository.updateWithVersion(session);
    if (!updated) {
      throw this.unauthorized();
    }
    await this.writeCache(session);
  }

  async delete(userId: string, deviceId: string): Promise<void> {
    await this.sessionsRepository.deletedSessionByUserIdAndDeviceId(
      userId,
      deviceId,
    );
    await this.safeCache('delete', () =>
      this.sessionsCacheRepository.delete(deviceId),
    );
  }

  async deleteAllExceptCurrent(
    userId: string,
    currentDeviceId: string,
  ): Promise<void> {
    const deletedIds = await this.sessionsRepository.deleteSessionMany(
      userId,
      currentDeviceId,
    );
    await this.safeCache('deleteMany', () =>
      this.sessionsCacheRepository.deleteMany(deletedIds),
    );
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const deletedIds = await this.sessionsRepository.deleteAllByUserId(userId);
    await this.safeCache('deleteMany', () =>
      this.sessionsCacheRepository.deleteMany(deletedIds),
    );
  }

  private async writeCache(session: Session): Promise<void> {
    try {
      await this.sessionsCacheRepository.set(
        session.deviceId,
        session,
        this.ttlSeconds(session),
      );
    } catch (err) {
      this.logger.error('Redis set failed, invalidating key', err);
      await this.safeCache('delete', () =>
        this.sessionsCacheRepository.delete(session.deviceId),
      );
    }
  }

  // ---------- helpers ----------

  private ttlSeconds(session: Session): number {
    return Math.max(
      1,
      Math.ceil((session.expirationDate.getTime() - Date.now()) / 1000),
    );
  }

  private async safeCache(
    action: string,
    fn: () => Promise<void>,
  ): Promise<void> {
    try {
      await fn();
    } catch (err) {
      this.logger.error(
        `Redis ${action} failed, Postgres already updated`,
        err,
      );
    }
  }

  private unauthorized(): DomainException {
    const message = errorMessageHelper.unAuthorized();
    return new DomainException({
      code: DomainExceptionCode.Unauthorized,
      message,
      errorsMessages: [{ message, field: FieldNames.REFRESH_TOKEN }],
    });
  }
}
