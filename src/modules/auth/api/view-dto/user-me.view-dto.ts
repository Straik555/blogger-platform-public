import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../users/domain/user.entity';

export class UserMeViewDto {
  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: String })
  login: string;

  @ApiProperty({ type: String })
  email: string;

  static mapToView(user: User): UserMeViewDto {
    const dto = new UserMeViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.userId = user.id;

    return dto;
  }
}
