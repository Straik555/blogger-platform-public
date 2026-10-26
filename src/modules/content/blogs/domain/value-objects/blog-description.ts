import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class BlogDescription {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 500;
  private constructor(public readonly value: string) {}

  static create(value: unknown): BlogDescription {
    if (typeof value !== 'string') {
      BlogDescription.fail(
        errorMessageHelper.isNotCorrectFormat(FieldNames.DESCRIPTION),
      );
    }
    const trimmed = value.trim();

    if (
      trimmed.length < BlogDescription.MIN_LENGTH ||
      trimmed.length > BlogDescription.MAX_LENGTH
    ) {
      BlogDescription.fail(
        errorMessageHelper.charactersLength(
          FieldNames.DESCRIPTION,
          BlogDescription.MIN_LENGTH,
          BlogDescription.MAX_LENGTH,
        ),
      );
    }

    return new BlogDescription(trimmed);
  }

  static fromPersistence(value: string): BlogDescription {
    return new BlogDescription(value);
  }

  equals(other: BlogDescription): boolean {
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
          field: FieldNames.DESCRIPTION,
        },
      ],
    });
  }
}
