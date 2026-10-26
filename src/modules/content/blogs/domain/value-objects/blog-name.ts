import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class BlogName {
  static readonly MIN_LENGTH = 1;
  static readonly MAX_LENGTH = 15;
  private constructor(public readonly value: string) {}
  static create(value: unknown): BlogName {
    if (typeof value !== 'string') {
      BlogName.fail(errorMessageHelper.isNotCorrectFormat(FieldNames.NAME));
    }
    const trimmed = value.trim();

    if (
      trimmed.length < BlogName.MIN_LENGTH ||
      trimmed.length > BlogName.MAX_LENGTH
    ) {
      BlogName.fail(
        errorMessageHelper.charactersLength(
          FieldNames.NAME,
          BlogName.MIN_LENGTH,
          BlogName.MAX_LENGTH,
        ),
      );
    }
    return new BlogName(trimmed);
  }

  static fromPersistence(value: string): BlogName {
    return new BlogName(value);
  }

  equals(other: BlogName): boolean {
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
          field: FieldNames.NAME,
        },
      ],
    });
  }
}
