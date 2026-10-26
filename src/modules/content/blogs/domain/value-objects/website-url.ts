import { FieldNames } from '../../../../../core/constants/field-names.constant';
import { DomainException } from '../../../../../core/exception/domain/domain.exception';
import { DomainExceptionCode } from '../../../../../core/exception/domain/domain-exception-codes';
import { errorMessageHelper } from '../../../../../core/helpers/error-message.helper';

export class WebsiteUrl {
  static readonly MIN_LENGTH = 9;
  static readonly MAX_LENGTH = 100;
  static readonly PATTERN_REGEX =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
  private constructor(public readonly value: string) {}

  static create(value: unknown): WebsiteUrl {
    if (typeof value !== 'string') {
      WebsiteUrl.fail(
        errorMessageHelper.isNotCorrectFormat(FieldNames.WEBSITE_URL),
      );
    }

    const trimmed = value.trim();

    if (
      trimmed.length < WebsiteUrl.MIN_LENGTH ||
      trimmed.length > WebsiteUrl.MAX_LENGTH
    ) {
      WebsiteUrl.fail(
        errorMessageHelper.charactersLength(
          FieldNames.WEBSITE_URL,
          WebsiteUrl.MIN_LENGTH,
          WebsiteUrl.MAX_LENGTH,
        ),
      );
    }

    if (!WebsiteUrl.PATTERN_REGEX.test(trimmed)) {
      WebsiteUrl.fail(
        errorMessageHelper.isNotCorrectFormat(FieldNames.WEBSITE_URL),
      );
    }

    return new WebsiteUrl(trimmed);
  }

  static fromPersistence(value: string): WebsiteUrl {
    return new WebsiteUrl(value);
  }

  equals(other: WebsiteUrl): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  private static fail(message: string): never {
    throw new DomainException({
      code: DomainExceptionCode.BadRequest,
      message,
      errorsMessages: [{ message, field: FieldNames.WEBSITE_URL }],
    });
  }
}
