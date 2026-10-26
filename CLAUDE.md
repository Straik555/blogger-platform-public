# Blogger Platform

Backend API for a blogging platform. Learning pet project for a junior backend developer portfolio.

## Stack
- NestJS 11, TypeScript 5 (`strictNullChecks` on, full `strict` off)
- PostgreSQL 16 + TypeORM 0.3 (`@nestjs/typeorm`). Raw SQL is being migrated to Repository API / QueryBuilder
- Redis (ioredis): session cache
- Auth: Passport (local, JWT access + refresh in cookie), bcrypt
- Docker + docker-compose; deploy: Vercel + Neon
- Tests: Jest + Supertest (e2e)
- Package manager: yarn

## Architecture: CQRS (@nestjs/cqrs) + module layers
- Change data only via Command + CommandHandler (class `*UseCase`)
- Read data only via Query + QueryHandler
- Events (EventBus/EventsHandler) are not used in this project. Do not add them
- A CommandHandler may return a view DTO, but do the reads for the response after the transaction commits
- Controller: guards, pipes, DTO → `commandBus` / `queryBus`. No business logic, no repositories
- Get another module's data only through its `*ExternalService` facade in `application/external`

## Module structure
```
src/modules/<module>/
  api/             <module>.controller.ts, input-dto/, view-dto/ (static mapToView)
  application/     usecases/  — command + handler in one *.usecase.ts
                   queries/   — query + handler in one *.query.ts
                   services/  — shared lookups (findByIdOrNotFoundFail)
                   external/  — facade for other modules
  domain/          *.entity.ts, value-objects/, dto/ (domain DTOs)
  dto/             command DTOs
  infrastructure/  *.repository.ts (write), query/*-query.repository.ts (read), mapper/
  <module>.module.ts
```
- Modules under `content/*` use the folder name `aplication` (historical typo). Keep the name a module already uses; new modules use `application`. Do not rename unless I ask
- Shared code: `src/core` (config, exception, value-objects, pipes, guards, swagger decorators, helpers)

## Domain (DDD-lite, OOP)
- Entities are rich models: create via a static factory (`Post.createPost(dto)`), change via methods (`updatePost`, `deleted()`). Do not assign entity fields directly from a handler
- Enforce invariants in value objects: private constructor + `static create()` that throws `DomainException`; store `.value` in the entity
- Soft delete via `deletedAt`. Always filter `deletedAt IS NULL`, including the parent entity (post and its blog)
- Optimistic locking: `@VersionColumn` + `updateWithVersion()` → `false` → `DomainExceptionCode.Conflict` (409)
- Principles in practice: one use case = one handler (SRP); repository = data access only, mapper = shape conversion only; dependencies only via DI (DIP); modules talk through facades (low coupling)

## Persistence (TypeORM)
- Table, column and PK/FK/UNIQUE/CHECK names in entities must match the DB: `name`, `primaryKeyConstraintName`, `foreignKeyConstraintName`, `@Unique`, `@Check`, `@Index`
- Relations on the owning side only (`@ManyToOne` / `@OneToOne` + `@JoinColumn`); keep both the `xId` column and the `x?` relation
- Write repository: `create` (insert) and `updateWithVersion` / `update` with an explicit list of fields
- Query repository returns data for the response; map raw rows via `infrastructure/mapper` (snake_case → camelCase)
- QueryBuilder:
  - use entity properties (`p.blogId`), not columns; columns only for subquery aliases
  - named parameters `:name`, unique within the query
  - sort field only through a whitelist / enum
  - one `.where()`, then `.andWhere()`; `clone()` before `getCount()`
  - `getRawMany` → `offset/limit`; `getMany` → `skip/take`
  - stable ordering: add `.addOrderBy('<alias>.id')`
  - FROM is the entity table → repository builder; FROM is a subquery → `manager.createQueryBuilder()`
  - new builder per call; never store one in a class field
- Do top-N per group in the DB (`ROW_NUMBER() OVER (PARTITION BY ...)`), not in JS
- A method returns exactly its declared type; strip extra fields at the method boundary
- Change the schema only via migrations in `src/migrations/` (CLI config: `src/migrations-data-source.ts`). Flow: change the entity → `yarn migration:generate src/migrations/<PascalCaseName>` → review the SQL → `yarn migration:run` and `yarn migration:run:test` → commit the entity and the migration together
- Review generated SQL for `DROP`: a renamed column is generated as DROP + ADD (data loss) — rewrite it as `RENAME COLUMN`
- Use `yarn migration:create` only for what TypeORM cannot generate: data changes, tables without entities (`comments`, `comment_likes`)
- Keep `uuidExtension: 'pgcrypto'` and other connection options identical in `app.module.ts` and `migrations-data-source.ts`, otherwise generate reports false diffs

## Transactions and concurrency
- `dataSource.transaction(async (manager) => ...)`; pass `manager` to every repository call inside
- Inside a transaction: sequential `await`s, no `Promise.all` (single connection)
- Keep transactions short: no emails, no external calls, no reads for the response
- Locks (`pessimistic_read` / `pessimistic_write`) only in methods with a required `manager` parameter (no default value)
- Insert-or-update with a UNIQUE constraint and a possible race → `upsert` with `conflictPaths`

## Redis
- Cache-aside: DB first, then cache; on a failed write invalidate the key; on a miss refill it
- A cache failure must not fail the request

## Coding rules
- Naming: kebab-case files with a suffix (`create-post.usecase.ts`, `get-all-posts.query.ts`, `posts.repository.ts`); PascalCase classes; commands are verbs (`CreatePostCommand` + `CreatePostUseCase`); queries `GetPostByIdQuery` + `GetPostByIdQueryHandler`
- Validation: class-validator in input DTOs; `UuidValidationPipe` for id params
- Errors: `throw new DomainException({ code: DomainExceptionCode.X, message })`; messages via `errorMessageHelper` + `FieldNames`. Repeated throws go into `private fail(...): never`. The global filter maps codes to HTTP status
- Dependencies only via DI
- Configuration only via `CoreConfig` (`@nestjs/config` + class-validator); do not use `process.env` outside config
- Routes from `ROUTER_PATH`; Swagger decorators in `src/core/decorators/swagger/<module>/`
- Imports sorted by simple-import-sort, formatting by Prettier
- async/await; no floating promises (exception: a deliberate `void` fire-and-forget, e.g. sending email)
- API responses only through an explicit view DTO mapper; never return entities

## Prohibitions
- Do not use `any` in new code: eslint allows it, but it hides type errors. Use `unknown` + narrowing or a precise type
- Do not put input into SQL via concatenation or template strings — SQL injection. Parameters only
- Do not enable `synchronize: true` — in this DB it already dropped FKs and CHECKs
- Do not put business logic in controllers — breaks CQRS and testability
- Do not use a query repository in a command handler or vice versa — the read model changes shape for the API and would break writes
- Do not access another module's repository or entity directly — bypassing the facade couples modules
- Do not use `repository.save()` — it hides the insert/update choice and skips the version check
- Do not take locks outside a transaction — TypeORM throws, and a lock without a transaction is meaningless
- Do not call `.where()` after the first condition — it wipes previous ones, including soft-delete filters
- Do not throw Nest HTTP exceptions (`NotFoundException`, etc.) in domain / application — the project uses `DomainException` so the domain stays HTTP-agnostic and the error format stays uniform
- Do not read or print `.env*` files or secrets
- Do not add new packages without my confirmation
- Do not edit a migration that was pushed or applied outside your local DB — other databases already ran it; write a new migration instead

## Workflow (important)
- Do NOT modify project files yourself. Show the corrected code and explain what changed and why. I apply the changes, then ask you for a review
- Exception: only when I explicitly ask in the current message ("write a test", "do it"), and only that change
- Explain as interview preparation: why this approach, what the alternatives and trade-offs are
- When reviewing: run `npx tsc --noEmit`, point to file:line, separate "must fix" from "optional"
- Git: read-only for you. For commits give one-line PowerShell commands (Windows); if `.ps1` is blocked use `npx.cmd` / `yarn.cmd`. Conventional commits (`refactor(posts): ...`), branches `refactor/<module>-...`

## Commands
- Start: `yarn start:dev`
- Unit tests: `yarn test`
- E2E: `yarn test:e2e` (NODE_ENV=testing, in band); one module: `yarn test:e2e test/posts`
- Lint: `yarn lint` — runs with `--fix` and modifies files; for review use `npx eslint <file>`
- Type check: `npx tsc --noEmit`
- Docker DB: `docker compose up -d postgres` (host port 5433)
- Daily start: `docker compose up -d postgres` → `yarn migration:run` → `yarn start:dev`
- Migrations: `yarn migration:run` (dev), `yarn migration:run:test` (test DB), `yarn migration:show`, `yarn migration:revert` (local only, before push)
