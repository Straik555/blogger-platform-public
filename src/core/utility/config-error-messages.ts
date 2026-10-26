export const configErrorMessages = {
  required: (env: string, example: string) =>
    `Set Env variable ${env}, example: ${example}`,

  boolean: (env: string, description = 'enable/disable') =>
    `Set Env variable ${env} to ${description}, available values: true, false, 0, 1`,

  enum: (env: string, values: string[]) =>
    `Set correct ${env} value, available values: ${values.join(', ')}`,

  number: (env: string, example: number) =>
    `Set Env variable ${env}, example: ${example}`,
  matches: (env: string, values: string) =>
    `${env} must be a valid duration ${values}`,
};
