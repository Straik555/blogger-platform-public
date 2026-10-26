import { FieldNames } from '../constants/field-names.constant';
import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { LikeStatusEnum } from '../types/like-status.type';

export class LikeStatus {
  private constructor(public readonly value: LikeStatusEnum) {}

  static create(
    status: LikeStatusEnum,
    fieldName: string = FieldNames.LIKE_STATUS,
  ): LikeStatus {
    if (!Object.values(LikeStatusEnum).includes(status)) {
      throw new DomainException({
        code: DomainExceptionCode.ValidationError,
        message: `Invalid value for ${fieldName}: ${status}`,
      });
    }

    return new LikeStatus(status);
  }
}
