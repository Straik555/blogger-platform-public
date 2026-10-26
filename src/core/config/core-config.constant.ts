export const CoreConfigConstant = {
  nodeEnv: 'NODE_ENV',
  port: 'PORT',
  mongoUrl: 'MONGO_URL',
  postgresHost: 'POSTGRES_HOST',
  postgresPort: 'POSTGRES_PORT',
  postgresUsername: 'POSTGRES_USERNAME',
  postgresPassword: 'POSTGRES_PASSWORD',
  postgresDB: 'POSTGRES_DB',
  postgresSsl: 'POSTGRES_SSL',
  redisUrl: 'REDIS_URL',
  dbName: 'DB_NAME',
  adminUsername: 'ADMIN_USERNAME',
  adminPassword: 'ADMIN_PASSWORD',
  isSwaggerEnabled: 'IS_SWAGGER_ENABLED',
  includeTestingModule: 'INCLUDE_TESTING_MODULE',
} as const;

export type CoreConfigConstantVariables = Record<
  (typeof CoreConfigConstant)[keyof typeof CoreConfigConstant],
  string
>;
