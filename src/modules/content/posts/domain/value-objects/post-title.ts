import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class PostTitle {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 30;
  private constructor(public readonly value: string) {}
  static create(value: unknown): PostTitle {
    if (typeof value !== 'string') {
      PostTitle.fail(errorMessageHelper.isNotCorrectFormat(FieldNames.TITLE));
    }
    const trimmed = value.trim();

    if (
      trimmed.length < PostTitle.MIN_LENGTH ||
      trimmed.length > PostTitle.MAX_LENGTH
    ) {
      PostTitle.fail(
        errorMessageHelper.charactersLength(
          FieldNames.TITLE,
          PostTitle.MIN_LENGTH,
          PostTitle.MAX_LENGTH,
        ),
      );
    }
    return new PostTitle(trimmed);
  }

  static fromPersistence(value: string): PostTitle {
    return new PostTitle(value);
  }

  equals(other: PostTitle): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private static fail(message: string): never {
    throw new DomainException({
      code: DomainExceptionCode.BadRequest,
      message,
      errorsMessages: [
        {
          message,
          field: FieldNames.TITLE,
        },
      ],
    });
  }
}
