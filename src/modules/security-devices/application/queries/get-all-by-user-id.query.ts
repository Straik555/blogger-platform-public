import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SessionsExternalService } from '../../../sessions/application/external/sessions.external-service';
import { DeviceViewDto } from '../../api/view-dto/device.view-dto';

export class GetAllByUserIdQuery {
  constructor(public userId: string) {}
}

@QueryHandler(GetAllByUserIdQuery)
export class GetAllByUserIdQueryHandler implements IQueryHandler<GetAllByUserIdQuery> {
  constructor(
    private readonly sessionsExternalService: SessionsExternalService,
  ) {}

  async execute({ userId }: GetAllByUserIdQuery): Promise<DeviceViewDto[]> {
    const sessions =
      await this.sessionsExternalService.findAllActiveByUserId(userId);

    return sessions.map((session) => DeviceViewDto.mapToView(session));
  }
}
