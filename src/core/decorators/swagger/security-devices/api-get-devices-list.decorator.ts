import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { DeviceViewDto } from '../../../../modules/security-devices/api/view-dto/device.view-dto';

export function ApiGetDevicesListDecorator() {
  const decorators = [
    ApiOperation({
      summary: 'Returns all devices with active sessions for current user',
    }),
    ApiOkResponse({
      description: 'Success',
      type: [DeviceViewDto],
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  ];
  return applyDecorators(...decorators);
}
