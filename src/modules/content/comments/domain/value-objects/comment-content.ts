import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class CommentContent {
  static readonly MIN_LENGTH = 20;
  static readonly MAX_LENGTH = 300;
  private constructor(public readonly value: string) {}
  static create(value: unknown): CommentContent {
    if (typeof value !== 'string') {
      CommentContent.fail(
        errorMessageHelper.isNotCorrectFormat(FieldNames.CONTENT),
      );
    }
    const trimmed = value.trim();
    if (
      trimmed.length < CommentContent.MIN_LENGTH ||
      trimmed.length > CommentContent.MAX_LENGTH
    ) {
      CommentContent.fail(
        errorMessageHelper.charactersLength(
          FieldNames.CONTENT,
          CommentContent.MIN_LENGTH,
          CommentContent.MAX_LENGTH,
        ),
      );
    }
    return new CommentContent(trimmed);
  }

  static fromPersistence(value: string): CommentContent {
    return new CommentContent(value);
  }

  equals(other: CommentContent): boolean {
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
