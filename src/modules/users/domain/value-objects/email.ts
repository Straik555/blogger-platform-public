import { FieldNames } from '../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../core/helpers/error-message.helper';

export class Email {
  static readonly MIN_LENGTH = 5;
  static readonly MAX_LENGTH = 255;
  static readonly PATTERN_REGEX =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  private constructor(public readonly value: string) {}

  static create(value: unknown): Email {
    if (typeof value !== 'string') {
      Email.fail(errorMessageHelper.isNotCorrectFormat(FieldNames.EMAIL));
    }
    const trimmed = value.trim().toLowerCase();

    if (
      trimmed.length < Email.MIN_LENGTH ||
      trimmed.length > Email.MAX_LENGTH
    ) {
      Email.fail(
        errorMessageHelper.charactersLength(
          FieldNames.EMAIL,
          Email.MIN_LENGTH,
          Email.MAX_LENGTH,
        ),
      );
    }
    if (!Email.PATTERN_REGEX.test(trimmed)) {
      Email.fail(errorMessageHelper.isNotCorrectFormat(FieldNames.EMAIL));
    }
    return new Email(trimmed);
  }

  static fromPersistence(value: string): Email {
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private static fail(message: string): never {
    throw new DomainException({
      code: DomainExceptionCode.BadRequest,
      message,
      errorsMessages: [{ message, field: FieldNames.EMAIL }],
    });
  }
}
