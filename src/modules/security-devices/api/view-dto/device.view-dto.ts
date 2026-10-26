import { ApiProperty } from '@nestjs/swagger';

import { Session } from '../../../sessions/domain/session.entity';

export class DeviceViewDto {
  @ApiProperty({
    type: String,
    description: 'IP address of device during signing in',
  })
  ip: string;

  @ApiProperty({
    type: String,
    description:
      'Device name: for example Chrome 105 (received by parsing http header "user-agent")',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Date of the last generating of refresh/access tokens',
  })
  lastActiveDate: string;

  @ApiProperty({
    type: String,
    description: 'Id of connected device session',
  })
  deviceId: string;

  static mapToView(session: Session): DeviceViewDto {
    const dto = new DeviceViewDto();

    dto.deviceId = session.deviceId;
    dto.ip = session.ip;
    dto.lastActiveDate = session.updatedAt.toISOString();
    dto.title = session.deviceName;
    return dto;
  }
}
