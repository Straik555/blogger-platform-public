import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UsersExternalService } from '../../../users/application/external/users.external-service';
import { UserMeViewDto } from '../../api/view-dto/user-me.view-dto';

export class MeLoginQuery {
  constructor(public userId: string) {}
}

@QueryHandler(MeLoginQuery)
export class MeLoginQueryHandler implements IQueryHandler<MeLoginQuery> {
  constructor(private readonly usersExternalService: UsersExternalService) {}

  async execute({ userId }: MeLoginQuery): Promise<UserMeViewDto> {
    return await this.usersExternalService.findMeByUserId(userId);
  }
}
