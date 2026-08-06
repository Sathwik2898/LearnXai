# LearnXai

LearnXai is a production-oriented, cross-platform learning management system under active development. The current repository contains an Expo/React Native frontend and a NestJS/PostgreSQL backend with learner registration, login, JWT access-token authentication, and protected current-user access.

The long-term product scope, current implementation state, and approved implementation order are documented in the repository rather than implied by this README.

## Current stack

- Frontend: Expo Router, React Native, React Native Web, and TypeScript
- Backend: NestJS and TypeScript
- Database: PostgreSQL
- ORM: Prisma 7
- Planned AI: provider abstraction, a later OpenAI implementation, PostgreSQL `pgvector`, and grounded course-aware RAG
- Planned delivery: Docker Compose, GitHub Actions, staging-first deployment, and environment-based configuration

## Repository layout

- `app/` — Expo Router route entry points
- `src/` — frontend implementation
- `backend/learnxai-api/` — the only NestJS backend
- `backend/learnxai-api/prisma/` — the only Prisma schema and migrations
- `docs/` — product, architecture, contracts, execution, quality, security, and operations documentation
- `AGENTS.md` — permanent milestone operating rules

See [docs/PROJECT_TREE.txt](./docs/PROJECT_TREE.txt) for a documentation-oriented source tree.

## Implemented routes and endpoints

Frontend routes currently include `/`, `/courses`, `/register`, `/login`, and `/forgot-password`. Several screens remain demo-oriented and are not yet integrated with the authenticated backend flow.

The backend currently exposes:

- `GET /`
- `GET /auth/health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` with a Bearer access token

Refresh tokens, logout/revocation, email verification, password reset, frontend authentication integration, LMS domain modules, organizations, and AI are planned rather than implemented.

## Local setup

Prerequisites:

- a Node.js/npm version compatible with the committed lockfiles;
- PostgreSQL for a real backend runtime;
- environment values based on `backend/learnxai-api/.env.example`.

Never commit local `.env` files or print their values.

Install and run the frontend:

```powershell
npm ci
npm run typecheck
npm run lint
npm run web
```

Use `npm run start`, `npm run android`, or `npm run ios` for the other Expo development targets.

Install and verify the backend:

```powershell
Set-Location backend/learnxai-api
npm ci
npm run prisma:validate
npm run lint
npm run build
npm test -- --runInBand --no-cache
npm run test:e2e -- --runInBand --no-cache
npm run start:dev
```

`npm ci` generates the ignored Prisma client through the backend `postinstall` script. The e2e tests use isolated test doubles and do not require or modify production data.

## Product and execution documentation

- [Product requirements](./docs/PRODUCT_REQUIREMENTS.md)
- [Screen inventory](./docs/SCREEN_INVENTORY.md)
- [API contracts](./docs/API_CONTRACTS.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Database design](./docs/DATABASE_DESIGN.md)
- [Sequential execution plan](./docs/EXECUTION_PLAN.md)
- [Test strategy](./docs/TEST_STRATEGY.md)
- [Security checklist](./docs/SECURITY_CHECKLIST.md)
- [Deployment runbook](./docs/DEPLOYMENT_RUNBOOK.md)
- [Decision log](./docs/DECISIONS.md)
- [Build progress](./docs/BUILD_PROGRESS.md)

Historical context is retained in [demo feedback](./docs/DEMO_FEEDBACK.md) and [development history](./docs/DEV_HISTORY.md); those files are not the current source of truth.

## Contribution rules

Read `AGENTS.md` and the relevant documents before starting a milestone. Work in the approved sequence, keep milestones independently verified and committed, and never commit generated files, build output, or secrets. Do not push, merge into `main`, change production, provision paid services, or make destructive database changes without the required approval.

Do not publish fabricated testimonials, customer logos, user counts, placement claims, ratings, or outcomes.
