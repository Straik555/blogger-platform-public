import { ApiProperty } from '@nestjs/swagger';

import { EmailUserDto } from '../../users/dto/email-user.dto';

export class RegistrationEmailResendingDto extends EmailUserDto {
  @ApiProperty({
    description: 'Email of already registered but not confirmed user',
  })
  email: string;
}
