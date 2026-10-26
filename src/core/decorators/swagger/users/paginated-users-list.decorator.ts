import { ApiProperty } from '@nestjs/swagger';

import { UserViewDto } from '../../../../modules/users/api/view-dto/user.view-dto';
import { PaginatedViewDto } from '../../../dto/base.paginated.view-dto';

export class PaginatedUsersList extends PaginatedViewDto<UserViewDto[]> {
  @ApiProperty({
    type: [UserViewDto],
  })
  items: UserViewDto[];
}
