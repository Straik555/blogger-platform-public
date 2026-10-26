export const errorMessageHelper = {
  notFound: (field: string): string => `The ${field} not found`,
  notFoundWithEntity: (field: string, entity: string): string =>
    `Not found ${entity} with that ${field}`,
  notEmpty: (field: string, entity: string): string =>
    `This ${field} has ${entity}, delete ${entity} first`,
  notBeEmpty: (field: string): string => `The ${field} must not be empty`,
  charactersLength: (field: string, min: number, max: number): string =>
    `The ${field} must be between ${min} and ${max} characters`,
  isString: (field: string): string => `The ${field} must be a string`,
  isRequired: (field: string): string => `The ${field} is required`,
  isPositiveInteger: (field: string): string =>
    `The ${field} must be a positive integer`,
  isNotCorrectFormat: (field: string): string =>
    `The ${field} has an incorrect format`,
  isWrong: (field: string): string => `The ${field} is wrong`,
  isUnique: (field: string): string => `The ${field} must be unique`,
  wrongCredentials: () => `Wrong credentials`,
  forbidden: (field: string) =>
    `You try edit the ${field} that is not your own`,
  forbiddenDelete: (field: string) =>
    `You try to delete the ${field} of other user`,
  isExpirationDate: (field: string) => `The ${field} is expired`,
  nextEmail: () => `Next email will be sent in 2 minutes`,
  isConfirmed: (field: string) => `The ${field} is already confirmed`,
  unAuthorized: (): string => `Unauthorized`,
  somethingWrong: () => `Something went wrong`,
  moreAttempts: (attempts: number = 5, seconds: number = 10) =>
    `More than ${attempts} attempts from one IP-address during ${seconds} seconds`,
  internalServerError: () => 'Internal Server Error',
  isAuthorized: () => 'The user was authorized',
  isExist: () => 'User already exists',
  isUpdatedPassword: () => 'User already updated password',
  isNotUpdated: (field: string) => `The ${field} is not updated`,
  isDeleted: (field: string) => `The ${field} is deleted`,
  validationFailed: () => 'Validation failed',
  invalidValue: () => 'Invalid value',
  isInvalid: (field: string) => `Invalid ${field}`,
  unknownException: () => 'Unknown exception occurred',
  getModificationConflictMessage: (entity: string) =>
    `${entity} was modified by another request, please retry`,
};
