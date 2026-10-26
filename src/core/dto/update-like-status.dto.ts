import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { LikeStatusEnum } from '../types/like-status.type';

export class UpdateLikeStatusDto {
  @ApiProperty({
    enum: LikeStatusEnum,
    default: LikeStatusEnum.None,
    description: 'Send None if you want to unlike\\undislike',
  })
  @IsEnum(LikeStatusEnum)
  likeStatus: LikeStatusEnum;
}
