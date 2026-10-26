import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class PostContent {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 1000;
  private constructor(public readonly value: string) {}

  static create(value: unknown): PostContent {
    if (typeof value !== 'string') {
      PostContent.fail(
        errorMessageHelper.isNotCorrectFormat(FieldNames.CONTENT),
      );
    }
    const trimmed = value.trim();
    if (
      trimmed.length < PostContent.MIN_LENGTH ||
      trimmed.length > PostContent.MAX_LENGTH
    ) {
      PostContent.fail(
        errorMessageHelper.charactersLength(
          FieldNames.CONTENT,
          PostContent.MIN_LENGTH,
          PostContent.MAX_LENGTH,
        ),
      );
    }
    return new PostContent(trimmed);
  }

  static fromPersistence(value: string): PostContent {
    return new PostContent(value);
  }

  equals(other: PostContent): boolean {
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
          field: FieldNames.CONTENT,
        },
      ],
    });
  }
}
