# LearnXai API

This directory is the only LearnXai backend. It is a NestJS/TypeScript application backed by PostgreSQL through Prisma 7.

Repository-wide product, architecture, API, database, security, test, and deployment contracts live under the root `docs/` directory. Read the root `AGENTS.md` before implementation work.

## Current capabilities

- learner registration with validated input, normalized email, duplicate detection, and bcrypt password hashing;
- login with generic unauthorized behavior and a short-lived JWT access token;
- Bearer-token authentication and protected current-user lookup;
- explicit safe user responses that exclude `passwordHash`;
- health endpoint and isolated unit/e2e coverage.

Current endpoints:

| Method | Path | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Basic application response |
| `GET` | `/auth/health` | Public | Current liveness response |
| `POST` | `/auth/register` | Public | Register a learner |
| `POST` | `/auth/login` | Public | Issue an access token |
| `GET` | `/auth/me` | Bearer JWT | Return the current safe user |

See `../../docs/API_CONTRACTS.md` for the exact current contracts and explicitly planned future contracts.

## Canonical layout

- `src/auth/` — authentication controller, service, DTOs, JWT service, and tests
- `src/common/` — reusable guards, decorators, and future cross-cutting primitives
- `src/config/` — validated environment access
- `src/prisma/` — Prisma module and service
- `src/users/` — user access and safe response mapping
- `prisma/schema.prisma` — the only Prisma schema
- `prisma/migrations/` — reviewed migration history
- `test/` — e2e configuration and tests

`src/generated/prisma/`, `dist/`, coverage, dependencies, and environment files are generated or local artifacts and remain ignored.

## Environment

Copy the keys from `.env.example` into a local ignored `.env` and provide environment-appropriate values:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `PORT`

The example values are placeholders. Never commit, print, or reuse real secrets. Staging and production must not use an insecure fallback secret.

## Installation and generation

From this directory:

```powershell
npm ci
```

The `postinstall` script runs `prisma:generate`. Generated Prisma client files are intentionally not tracked.

Explicit Prisma commands:

```powershell
npm run prisma:generate
npm run prisma:validate
```

Do not use `prisma db push`, create migrations, or apply migrations unless the active milestone explicitly includes a reviewed schema change.

## Development and production-style start

```powershell
npm run start:dev
```

For the compiled application:

```powershell
npm run build
npm run start:prod
```

`start:prod` runs `dist/main`. A real runtime needs a reachable PostgreSQL database and valid environment configuration.

## Quality checks

```powershell
npm run prisma:generate
npm run prisma:validate
npm run lint
npm run build
npm test -- --runInBand --no-cache
npm run test:e2e -- --runInBand --no-cache
```

The default lint command is non-mutating. Use `npm run lint:fix` only when an active implementation milestone authorizes formatting changes. The e2e suite is isolated from production data.

## Current boundaries

Refresh-token rotation, logout/revocation, verification/recovery email, role-policy enforcement, profiles, LMS domain modules, organizations, jobs, audit logging, readiness, Docker/CI, and AI/RAG are not implemented yet. Follow `../../docs/EXECUTION_PLAN.md`; do not skip ahead or add adjacent features to a milestone.
