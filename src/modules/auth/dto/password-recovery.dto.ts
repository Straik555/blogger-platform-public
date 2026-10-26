import { ApiProperty } from '@nestjs/swagger';

import { EmailUserDto } from '../../users/dto/email-user.dto';

export class PasswordRecoveryDto extends EmailUserDto {
  @ApiProperty({ description: 'Email of registered user' })
  email: string;
}
