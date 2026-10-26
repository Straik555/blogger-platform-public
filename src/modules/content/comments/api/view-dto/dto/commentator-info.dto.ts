import { ApiProperty } from '@nestjs/swagger';

export class CommentatorInfoDto {
  @ApiProperty({ type: String, required: true })
  userId: string;

  @ApiProperty({ type: String, required: true })
  userLogin: string;
}
