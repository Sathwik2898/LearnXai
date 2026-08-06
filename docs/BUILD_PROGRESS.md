# LearnXai Build Progress

## 1. Snapshot

- **Snapshot date:** 2026-08-06
- **Branch:** `codex/inspect-learnxai-repository`
- **Current milestone:** Milestone 4A — permanent product specification and autonomous execution framework
- **Milestone state:** Complete in this documentation commit, pending final commit hash at the time this file was written
- **Next approved implementation milestone:** F01 — refresh tokens, logout, and `/auth/me` hardening
- **Automatic continuation:** Disabled for Milestone 4A by the active instruction; do not begin F01 from this commit

This file records implemented evidence, not aspirations. Planned capabilities are tracked in [EXECUTION_PLAN.md](./EXECUTION_PLAN.md).

## 2. Completed milestones

| Milestone | Commit | Result |
| --- | --- | --- |
| Learner registration | `871830e73788e68f92c4b4a2a5c58a4837e7b4fb` | `POST /auth/register`, validation, normalized email, bcrypt password hash, duplicate protection, safe learner response, focused tests |
| Reproducible build baseline | `990c8053078824245ed5bc677cce15df5fc7bfaf` | Frontend typecheck/lint baseline, platform-safe landing resolution, Prisma generation/validation scripts, backend build/lint/unit/e2e/production-start baseline |
| Login and JWT authentication | `6884c1d823565f8345a340870b8b9316ab0ec9a8` | `POST /auth/login`, short-lived JWT access token, Bearer guard, `GET /auth/me`, safe response mapping, unit/e2e coverage |
| Product specification and execution framework | This commit | Permanent operating rules plus product, screen, API, architecture, database, execution, test, security, deployment, decision, and progress documentation |

The three implementation commits above are present in order on the current branch and their behavior is preserved by Milestone 4A.

## 3. Current implemented application

### Frontend

- Expo Router routes currently exist for `/`, `/courses`, `/register`, `/login`, and `/forgot-password`.
- Frontend implementation is under `src/`; routes remain under `app/`.
- The landing screen resolves `LandingScreen.web.tsx` on web and `LandingScreen.tsx` on native through extensionless platform resolution.
- Marketing, authentication, and course-preview UI exists, but frontend login/registration integration is still deliberately in demo mode.
- Email verification, reset password, authenticated shells, dashboards, authoring, learning workflows, organizations, and AI screens are planned.

### Backend

- NestJS modules currently include application, authentication, users, and Prisma integration.
- Implemented endpoints:
  - `GET /`
  - `GET /auth/health`
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /auth/me`
- Registration stores only a bcrypt password hash and returns an explicit safe user representation.
- Login normalizes email, uses generic unauthorized behavior, signs a minimal access token, and never returns the password hash.
- `/auth/me` validates the Bearer access token and reloads the current user.
- Refresh tokens, logout, revocation, recovery, role policies, domain modules, workers, readiness, and AI are not implemented.

### Data

- PostgreSQL with Prisma 7 is configured at `backend/learnxai-api/prisma/`.
- The current database model contains `User` and `UserRole`; current physical tables are `users` and `_prisma_migrations` in an initialized database.
- One initial User migration exists.
- Generated Prisma client code is intentionally ignored.
- Milestone 4A makes no schema or migration change.

### Quality baseline

- Root scripts provide non-mutating frontend typecheck and lint.
- Backend scripts provide Prisma generation/validation, non-mutating lint, build, unit tests, e2e tests, and production start.
- Existing authentication unit and e2e suites cover registration, login, health, and protected current-user behavior.
- Browser automation, native device tests, database integration suites, accessibility automation, security scans, and AI evaluations are future work.

## 4. Milestone 4A documentation delivered

- `AGENTS.md` — permanent milestone operating contract.
- `docs/PRODUCT_REQUIREMENTS.md` — product roles, scope, outcomes, and non-functional requirements.
- `docs/SCREEN_INVENTORY.md` — screen-level route, state, API, responsive, and acceptance contracts.
- `docs/API_CONTRACTS.md` — current and planned HTTP contracts.
- `docs/ARCHITECTURE.md` — current and target component boundaries.
- `docs/DATABASE_DESIGN.md` — current physical schema and planned conceptual model.
- `docs/EXECUTION_PLAN.md` — sequential F01–F20 implementation plan.
- `docs/TEST_STRATEGY.md` — quality layers, environments, fixtures, and release evidence.
- `docs/SECURITY_CHECKLIST.md` — current and future security gates.
- `docs/DEPLOYMENT_RUNBOOK.md` — staging-first release and recovery procedure.
- `docs/DECISIONS.md` — accepted, provisional, and open decisions.
- `docs/BUILD_PROGRESS.md` — this evidence ledger.

The root and backend README files and the repository tree are reconciled with the current project. Historical demo feedback and development history remain retained and are labeled as historical context.

## 5. Known gaps and debt

- Frontend authentication is not connected to the implemented backend and contains overlapping service abstractions.
- The forgot-password screen calls a capability that does not yet exist.
- The current `/courses` route and course-preview implementation overlap rather than sharing a settled catalogue component.
- Starter Expo components, assets, and documentation-era artifacts remain; their removal requires a separate approved cleanup milestone.
- The current User role representation does not yet express the complete four-role product policy or multi-role semantics.
- Refresh/revocation, verification/recovery, authorization policies, audit events, rate limits, and security response headers remain planned.
- The current e2e suite uses an isolated Prisma test double; a disposable PostgreSQL integration layer is still required.
- Docker, CI/CD, staging infrastructure, production readiness, operational monitoring, and background jobs do not yet exist.
- Product, privacy, hosting, provider, cost, and operational choices listed in [DECISIONS.md](./DECISIONS.md) remain unresolved.

## 6. Remaining sequence

| Order | ID | Milestone |
| ---: | --- | --- |
| 1 | F01 | Refresh tokens, logout, and `/auth/me` hardening |
| 2 | F02 | Email verification and password reset |
| 3 | F03 | Frontend authentication integration |
| 4 | F04 | Authenticated application shell and dashboards |
| 5 | F05 | Course database and APIs |
| 6 | F06 | Course catalogue and details |
| 7 | F07 | Course authoring |
| 8 | F08 | Enrollment and progress |
| 9 | F09 | Course player |
| 10 | F10 | Quizzes |
| 11 | F11 | Projects and submissions |
| 12 | F12 | Certificates |
| 13 | F13 | Instructor/admin workflows |
| 14 | F14 | Organizations and reporting |
| 15 | F15 | AI mentor and grounded RAG |
| 16 | F16 | Notifications and background jobs |
| 17 | F17 | Docker and CI/CD |
| 18 | F18 | Staging configuration |
| 19 | F19 | Security, accessibility, and production hardening |
| 20 | F20 | Final production-readiness verification |

The complete scope, tests, migrations, recovery strategy, gates, and commit message for each milestone are in [EXECUTION_PLAN.md](./EXECUTION_PLAN.md).

## 7. External dependencies eventually required

No credentials or paid services are required for Milestone 4A. Later approved milestones will require decisions and, where selected, credentials for:

- transactional email and an approved sending domain;
- private object storage and optional malware scanning;
- managed PostgreSQL with `pgvector` for staging/production;
- queue/background-job infrastructure;
- OpenAI API access and explicit cost/privacy controls;
- web/API hosting, DNS, TLS, and native signing/store accounts;
- logs, metrics, traces, error reporting, alerting, and incident communications;
- backup, restore, and disaster-recovery facilities.

Provisioning any paid service, credential, cloud resource, domain, or production environment is a pause-and-approval gate.

## 8. Update protocol

After every milestone:

1. move the milestone from planned to completed only after all acceptance checks pass;
2. record the commit hash, implemented behavior, migrations, test evidence, and remaining warnings;
3. update current endpoints, routes, modules, schema, and quality coverage;
4. update decisions and other contracts when implementation resolves or changes them;
5. name the next milestone and any approval gate;
6. commit the progress update with the milestone, never as unverified future status.

Do not mark a feature complete because it appears in a product or architecture specification. Only verified repository behavior belongs in the completed sections.
