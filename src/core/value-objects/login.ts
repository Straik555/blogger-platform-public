import { FieldNames } from '../constants/field-names.constant';
import { DomainException } from '../exception/domain/domain.exception';
import { DomainExceptionCode } from '../exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../helpers/error-message.helper';

export class Login {
  static readonly MIN_LENGTH = 3;
  static readonly MAX_LENGTH = 10;
  static readonly PATTERN_REGEX = /^[a-zA-Z0-9_-]+$/;
  private constructor(public readonly value: string) {}

  static create(value: unknown): Login {
    if (typeof value !== 'string') {
      Login.fail(errorMessageHelper.isNotCorrectFormat(FieldNames.LOGIN));
    }
    const trimmed = value.trim();

    if (
      trimmed.length < Login.MIN_LENGTH ||
      trimmed.length > Login.MAX_LENGTH
    ) {
      Login.fail(
        errorMessageHelper.charactersLength(
          FieldNames.LOGIN,
          Login.MIN_LENGTH,
          Login.MAX_LENGTH,
        ),
      );
    }

    if (!Login.PATTERN_REGEX.test(trimmed)) {
      Login.fail(errorMessageHelper.isNotCorrectFormat(FieldNames.LOGIN));
    }

    return new Login(trimmed);
  }

  static fromPersistence(value: string): Login {
    return new Login(value);
  }

  equals(other: Login): boolean {
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
          field: FieldNames.LOGIN,
        },
      ],
    });
  }
}
