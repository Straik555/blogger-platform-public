import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';

import { Session } from '../domain/session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}
  async create(session: Session): Promise<Session> {
    await this.sessionRepository.insert(session);
    return session;
  }

  async updateWithVersion(session: Session): Promise<boolean> {
    const result = await this.sessionRepository.update(
      { deviceId: session.deviceId, version: session.version },
      {
        expirationDate: session.expirationDate,
        updatedAt: session.updatedAt,
        ip: session.ip,
      },
    );

    if (!result.affected) {
      return false;
    }
    session.version += 1;
    return true;
  }

  async findSessionByUserIdAndDeviceId(
    deviceId: string,
    userId: string,
  ): Promise<Session | null> {
    return this.sessionRepository.findOne({
      where: {
        deviceId,
        userId,
      },
    });
  }

  async findAllByUserId(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: {
        userId,
        expirationDate: MoreThan(new Date()),
      },
      order: { createdAt: 'ASC' },
    });
  }

  async findSessionDeviceId(deviceId: string): Promise<Session | null> {
    return this.sessionRepository.findOneBy({
      deviceId,
    });
  }

  async deleteSessionMany(userId: string, deviceId: string): Promise<string[]> {
    const result = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where({ userId, deviceId: Not(deviceId) })
      .returning('device_id')
      .execute();

    const rows = result.raw as { device_id: string }[];
    return rows.map((r) => r.device_id);
  }
  async deletedSessionByUserIdAndDeviceId(
    userId: string,
    deviceId: string,
  ): Promise<void> {
    await this.sessionRepository.delete({
      userId,
      deviceId,
    });
  }

  async deleteAllByUserId(userId: string): Promise<string[]> {
    const result = await this.sessionRepository
      .createQueryBuilder()
      .delete()
      .where({ userId })
      .returning('device_id')
      .execute();

    const rows = result.raw as { device_id: string }[];
    return rows.map((r) => r.device_id);
  }
}
