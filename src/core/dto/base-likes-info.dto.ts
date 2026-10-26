import { ApiProperty } from '@nestjs/swagger';

import { FormatInteger } from '../decorators/swagger/common/format-integer.decorator';
import { LikeStatusEnum } from '../types/like-status.type';

export class BaseLikesInfoDto {
  @FormatInteger({ description: 'Total likes for parent item' })
  likesCount: number;

  @FormatInteger({ description: 'Total dislikes for parent item' })
  dislikesCount: number;

  @ApiProperty({
    enum: LikeStatusEnum,
    default: LikeStatusEnum.None,
    description: 'Send None if you want to unlike\\undislike',
  })
  myStatus: LikeStatusEnum;
}
