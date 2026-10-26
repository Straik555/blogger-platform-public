import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class PostShortDescription {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 100;
  private constructor(public readonly value: string) {}
  static create(value: unknown): PostShortDescription {
    if (typeof value !== 'string') {
      PostShortDescription.fail(
        errorMessageHelper.isNotCorrectFormat(FieldNames.SHORT_DESCRIPTION),
      );
    }

    const trimmed = value.trim();

    if (
      trimmed.length < PostShortDescription.MIN_LENGTH ||
      trimmed.length > PostShortDescription.MAX_LENGTH
    ) {
      PostShortDescription.fail(
        errorMessageHelper.charactersLength(
          FieldNames.SHORT_DESCRIPTION,
          PostShortDescription.MIN_LENGTH,
          PostShortDescription.MAX_LENGTH,
        ),
      );
    }

    return new PostShortDescription(trimmed);
  }

  static fromPersistence(value: string): PostShortDescription {
    return new PostShortDescription(value);
  }

  equals(other: PostShortDescription): boolean {
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
          field: FieldNames.SHORT_DESCRIPTION,
        },
      ],
    });
  }
}
