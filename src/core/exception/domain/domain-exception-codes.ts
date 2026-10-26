export enum DomainExceptionCode {
  // Validation
  //common
  NotFound = 1,
  BadRequest = 2,
  InternalServerError = 3,
  Forbidden = 4,
  ValidationError = 5,
  ToManyRequest = 6,
  //auth
  Unauthorized = 11,
  EmailNotConfirmed = 12,
  ConfirmationCodeExpired = 13,
  PasswordRecoveryCodeExpired = 14,
  ConfirmationCodeAlreadyUsed = 15,
  Conflict = 16,
  //...
}
