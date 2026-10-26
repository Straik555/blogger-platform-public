import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  VersionColumn,
} from 'typeorm';

import { FieldNames } from '../../../core/constants/field-names.constant';
import { EntityId } from '../../../core/value-objects';
import { User } from '../../users/domain/user.entity';
import { CreateSessionDomainDto } from './dto/create-session.domain.dto';
import { DeviceName, Ip } from './object-value';

@Entity('sessions')
export class Session {
  @PrimaryColumn({
    name: 'device_id',
    type: 'uuid',
    primaryKeyConstraintName: 'session_pkey',
  })
  deviceId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'session_user_id_fkey',
  })
  user?: User;

  @Column({ name: 'ip', type: 'varchar', length: Ip.MAX_LENGTH })
  ip: string;

  @Column({
    name: 'device_name',
    type: 'varchar',
    length: DeviceName.MAX_LENGTH,
  })
  deviceName: string;

  @Column({ name: 'expiration_date', type: 'timestamp with time zone' })
  expirationDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @VersionColumn({ name: 'version', type: 'integer' })
  version: number;

  static createSession(dto: CreateSessionDomainDto): Session {
    const session: Session = new Session();

    session.deviceId = dto.deviceId;
    session.userId = EntityId.create(dto.userId, FieldNames.USER_ID).value;
    session.deviceName = DeviceName.create(dto.deviceName).value;
    session.expirationDate = dto.expirationDate;
    session.ip = Ip.create(dto.ip).value;
    session.updatedAt = dto.updatedAt;

    return session;
  }

  updateExpirationDateAndIp(expirationDate: Date, ip: string, iat: Date) {
    this.expirationDate = expirationDate;
    this.updatedAt = iat;
    this.ip = Ip.create(ip).value;
  }
}
