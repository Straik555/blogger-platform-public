import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'Details about single like' })
export class NewestLikeDto {
  // @ApiOperation({ description: 'Details about single like', summary: '' })
  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  addedAt: Date;

  @ApiProperty({ type: String, nullable: true })
  userId: string;

  @ApiProperty({ type: String, nullable: true })
  login: string;
}
