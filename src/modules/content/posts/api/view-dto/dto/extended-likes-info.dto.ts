import { ApiProperty } from '@nestjs/swagger';

import { BaseLikesInfoDto } from '../../../../../../core/dto/base-likes-info.dto';
import { NewestLikeDto } from './newest-like.dto';

export class ExtendedLikesInfoDto extends BaseLikesInfoDto {
  @ApiProperty({
    type: [NewestLikeDto],
    nullable: true,
  })
  newestLikes: NewestLikeDto[];
}
