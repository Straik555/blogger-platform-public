import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';
import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';

export class DeleteByUserIdAndDeviceIdCommand {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteByUserIdAndDeviceIdCommand)
export class DeleteByUserIdAndDeviceIdUseCase implements ICommandHandler<DeleteByUserIdAndDeviceIdCommand> {
  constructor(
    private readonly sessionsExternalService: SessionsExternalService,
  ) {}

  async execute({
    userId,
    deviceId,
  }: DeleteByUserIdAndDeviceIdCommand): Promise<void> {
    const session = await this.sessionsExternalService.findByDeviceId(deviceId);
    if (!session) {
      const message = errorMessageHelper.notFoundWithEntity(
        FieldNames.DEVICE_ID,
        FieldNames.DEVICE,
      );
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.DEVICE,
          },
        ],
      });
    }
    if (session.userId !== userId) {
      const message = errorMessageHelper.forbiddenDelete(FieldNames.DEVICE_ID);
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message,
        errorsMessages: [
          {
            message,
            field: FieldNames.DEVICE_ID,
          },
        ],
      });
    }
    await this.sessionsExternalService.delete(userId, deviceId);
  }
}
