import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { ROUTER_PATH } from '../../../src/core/path/router.path';
import { DeviceViewDto } from '../../../src/modules/security-devices/api/view-dto/device.view-dto';
import { refreshCookie } from '../common/utils';

export const getDevices = async (
  app: INestApplication<App>,
  refreshToken: string,
  status: HttpStatus = HttpStatus.OK,
): Promise<DeviceViewDto[]> => {
  const response = await request(app.getHttpServer())
    .get(ROUTER_PATH.security.devices)
    .set('Cookie', refreshCookie(refreshToken))
    .expect(status);
  return response.body as DeviceViewDto[];
};

export const deleteDevice = (
  app: INestApplication<App>,
  refreshToken: string,
  deviceId: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  request(app.getHttpServer())
    .delete(`${ROUTER_PATH.security.devices}/${deviceId}`)
    .set('Cookie', refreshCookie(refreshToken))
    .expect(status);

export const deleteOtherDevices = (
  app: INestApplication<App>,
  refreshToken: string,
  status: HttpStatus = HttpStatus.NO_CONTENT,
): Promise<request.Response> =>
  request(app.getHttpServer())
    .delete(ROUTER_PATH.security.devices)
    .set('Cookie', refreshCookie(refreshToken))
    .expect(status);
