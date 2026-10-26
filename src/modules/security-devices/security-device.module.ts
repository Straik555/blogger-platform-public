import { Module } from '@nestjs/common';

import { SessionModule } from '../sessions/session.module';
import { SecurityDeviceController } from './api/security-devices.controller';
import { GetAllByUserIdQueryHandler } from './application/queries/get-all-by-user-id.query';
import { DeleteAllUseCase } from './application/usecases/delete-all.usecase';
import { DeleteByUserIdAndDeviceIdUseCase } from './application/usecases/delete-by-user-id-and-device-id.usecase';

const useCases = [
  DeleteByUserIdAndDeviceIdUseCase,
  DeleteAllUseCase,
  GetAllByUserIdQueryHandler,
];

@Module({
  imports: [SessionModule],
  controllers: [SecurityDeviceController],
  providers: [...useCases],
  exports: [...useCases],
})
export class SecurityDeviceModule {}
