import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnvFile } from 'node:process';

import { DataSource } from 'typeorm';

import { CoreConfigConstant } from './core/config/core-config.constant';
import { configValidationUtility } from './core/utility/config-validation.utility';

// DataSource for the TypeORM CLI (migration:generate/run/revert/show).
// The CLI runs without Nest, so CoreConfig and DI are not available here:
// env files are loaded manually and the variables are read by the same names.
const env = process.env.NODE_ENV ?? 'development';

// Same priority as config.module.ts: *.local first. loadEnvFile does not
// overwrite variables that are already set, so the first file wins.
// .env.production is intentionally not loaded: a CLI run without NODE_ENV
// must never reach the production database.
for (const file of [`.env.${env}.local`, `.env.${env}`]) {
  if (existsSync(file)) {
    loadEnvFile(file);
  }
}

// .ts when run via ts-node (CLI from the host), .js when run from dist (Docker)
const ext = __filename.endsWith('.ts') ? 'ts' : 'js';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Set Env variable ${name} in .env.${env}`);
  }
  return value;
}

const ssl = configValidationUtility.convertToBoolean(
  requiredEnv(CoreConfigConstant.postgresSsl),
);

export default new DataSource({
  type: 'postgres',
  host: requiredEnv(CoreConfigConstant.postgresHost),
  port: Number(requiredEnv(CoreConfigConstant.postgresPort)),
  username: requiredEnv(CoreConfigConstant.postgresUsername),
  password: requiredEnv(CoreConfigConstant.postgresPassword),
  database: requiredEnv(CoreConfigConstant.postgresDB),
  uuidExtension: 'pgcrypto',
  ssl: ssl ? { rejectUnauthorized: false } : false,
  entities: [join(__dirname, `**/*.entity.${ext}`)],
  migrations: [join(__dirname, `migrations/*.${ext}`)],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: ['error', 'warn', 'migration'],
});
