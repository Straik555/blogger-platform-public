import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../domain/user.entity';

export class UserViewDto {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  login: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;

  static mapToView(user: User): UserViewDto {
    const dto = new UserViewDto();

    dto.email = user.email;
    dto.login = user.login;
    dto.id = user.id;
    dto.createdAt = user.createdAt;

    return dto;
  }
}
