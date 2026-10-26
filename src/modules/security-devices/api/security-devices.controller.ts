import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { ApiDeleteDeviceByIdDecorator } from '../../../core/decorators/swagger/security-devices/api-delete-device-by-id.decorator';
import { ApiDeleteDevicesListDecorator } from '../../../core/decorators/swagger/security-devices/api-delete-devices-list.decorator';
import { ApiGetDevicesListDecorator } from '../../../core/decorators/swagger/security-devices/api-get-devices-list.decorator';
import { ROUTER_PATH } from '../../../core/path/router.path';
import { ExtractUserFromRequest } from '../../auth/guards/decorators/params/extract-user-from-request.decorator';
import { JwtRefreshAuthGuard } from '../../auth/guards/jwt-refresh/jwt-refresh-auth.guard';
import { RefreshTokenContextDto } from '../../auth/guards/jwt-refresh/refresh-token-context.dto';
import { GetAllByUserIdQuery } from '../application/queries/get-all-by-user-id.query';
import { DeleteAllCommand } from '../application/usecases/delete-all.usecase';
import { DeleteByUserIdAndDeviceIdCommand } from '../application/usecases/delete-by-user-id-and-device-id.usecase';
import { DeviceViewDto } from './view-dto/device.view-dto';

@UseGuards(JwtRefreshAuthGuard)
@Controller(ROUTER_PATH.security.devices)
export class SecurityDeviceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiGetDevicesListDecorator()
  @Get()
  async getSecurityDevices(
    @ExtractUserFromRequest() user: Pick<RefreshTokenContextDto, 'userId'>,
  ): Promise<DeviceViewDto[]> {
    return this.queryBus.execute(new GetAllByUserIdQuery(user.userId));
  }

  @ApiDeleteDeviceByIdDecorator()
  @Delete(':deviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @ExtractUserFromRequest() user: Pick<RefreshTokenContextDto, 'userId'>,
    @Param('deviceId') deviceId: string,
  ): Promise<void> {
    return await this.commandBus.execute(
      new DeleteByUserIdAndDeviceIdCommand(deviceId, user.userId),
    );
  }

  @ApiDeleteDevicesListDecorator()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllSession(
    @ExtractUserFromRequest()
    user: Pick<RefreshTokenContextDto, 'userId' | 'deviceId'>,
  ): Promise<void> {
    return await this.commandBus.execute(
      new DeleteAllCommand(user.userId, user.deviceId),
    );
  }
}
