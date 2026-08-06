# LearnXai Architecture

Status: current architecture plus approved target boundaries. Planned components are not present until marked complete in `BUILD_PROGRESS.md`.

## System context

```text
Web / iOS / Android clients
        |
        | HTTPS JSON (future streaming only where approved)
        v
NestJS API
  |-- identity and authorization
  |-- LMS domain modules
  |-- organization/reporting modules
  |-- AI application boundary
  |-- notification/job boundary
        |
        +--> PostgreSQL + Prisma 7
        |       `-- pgvector (planned)
        +--> object storage (provider undecided, planned)
        +--> email provider (undecided, planned)
        +--> AI provider abstraction -> OpenAI implementation (later)
        `--> job/queue implementation (undecided, planned)
```

Infrastructure target: Docker Compose for reproducible local/staging-like services; GitHub Actions for quality/build/security gates; staging before production; environment-specific configuration and secrets.

## Current implementation

### Frontend

- Root: repository root.
- Route definitions: `app/`.
- Product implementation: `src/`.
- Shared starter components/hooks/constants remain tracked but are not the preferred destination for new product features.
- Expo Router resolves platform variants extensionlessly. `app/index.tsx` imports `LandingScreen`; web selects `LandingScreen.web.tsx`, native selects `LandingScreen.tsx`.
- Current routes: `/`, `/courses`, `/register`, `/login`, `/forgot-password`.
- Current authentication screens run demo/mock behavior and are not connected to backend session management.
- There are two frontend auth-service paths: direct functions in `src/features/auth/api/authApi.ts` and `src/features/auth/services/authService.ts`, which wraps the generic transport under `src/services/api/`; consolidation belongs to the frontend-auth milestone.
- Root TypeScript scope excludes `backend/**`; root scripts provide non-mutating typecheck and lint.

### Backend

- Only backend root: `backend/learnxai-api/`.
- Current NestJS modules: `AppModule`, `AuthModule`, `UsersModule`, `PrismaModule`.
- Controllers translate HTTP requests; `AuthService` owns current registration/login/current-user use cases; `UsersService` owns user persistence access; `PrismaService` owns the Prisma lifecycle.
- JWT access-token configuration is centralized in `src/config/env.ts`; there is no insecure secret fallback.
- The guard validates bearer token signature, expiry, issuer, audience, and safe claims; `/auth/me` reloads the user by token subject.
- Current endpoints: `GET /`, `GET /auth/health`, `POST /auth/register`, `POST /auth/login`, `GET /auth/me`.
- Generated Prisma client is written to `src/generated/prisma`, ignored, generated on install/prebuild, and excluded from lint.
- Production compilation emits `dist/main.js`, matching `start:prod`.

### Data

- PostgreSQL through Prisma 7 and the PostgreSQL driver adapter.
- Current application model: `User`; current table: `users`; Prisma migration metadata table also exists after migration deployment.
- One migration creates the user role enum, users table, and unique email index.
- No refresh session, LMS, organization, notification, audit, AI, vector, or job tables exist yet.

### Tests

- Backend unit tests cover starter controller, registration/login/current-user behavior, and JWT configuration/claims.
- Backend e2e tests use an isolated in-memory Prisma-compatible provider; they do not modify PostgreSQL.
- Frontend currently has typecheck and lint only; a frontend unit/component/browser harness is planned.

## Target frontend architecture

```text
app/                         thin route files and route groups
src/
  components/               shared product UI/layout primitives
  config/                   validated public runtime configuration
  features/
    auth/
    courses/
    learning/
    quizzes/
    projects/
    certificates/
    mentor/
    management/
    organizations/
    notifications/
  services/
    api/                     transport, auth retry, error normalization
    storage/                 platform-safe credential/session storage
  state/                     only approved cross-feature client state
  theme/                     design tokens
  types/                     intentionally shared client contracts
```

Rules:

- Route files compose feature screens; they do not contain business logic or large style systems.
- Public, authenticated learner, management, and organization route groups have distinct layouts and guards, while route-group names do not have to appear in URLs.
- Server state uses a consistent query/cache layer once selected; local form/UI state remains local.
- Access tokens are attached by one transport layer. Refresh credentials use platform-appropriate secure transport decided in the refresh milestone.
- Authorization failures clear/refresh session safely; the client never treats hidden UI as access control.
- Platform-specific implementations use `.web.tsx`, `.ios.tsx`, or `.android.tsx` only where behavior truly differs.
- API types and errors must match `API_CONTRACTS.md`.

## Target backend module boundaries

```text
src/
  auth/                 access/refresh sessions, verification, recovery
  users/                identity profile and preferences
  courses/              course lifecycle and publication versions
  curriculum/           modules, lessons, content blocks/resources
  enrollments/          access, assignment and lifecycle
  progress/             lesson/course progress and aggregates
  quizzes/              authoring, attempts, grading, results
  projects/             briefs, rubrics, submissions and review
  certificates/         eligibility, issuance, verification, revocation
  organizations/        tenants, memberships, cohorts, assignments
  notifications/        inbox and delivery preferences
  audit/                append-oriented security/business events
  analytics/            defined scoped aggregates
  ai/                   provider interface, mentor use cases, ingestion
  jobs/                 enqueueing, workers, retries and job state
  health/               liveness and dependency readiness
  common/               guards, decorators, filters, interceptors, utilities
  config/               validated environment configuration
  prisma/               database lifecycle only
```

### Layering

1. Controller: parse HTTP context, apply authentication/authorization, invoke one use case, map status.
2. DTO/validation: normalize and reject untrusted input at the boundary.
3. Application service: enforce workflow, policy, idempotency, and transaction boundaries.
4. Domain service/policy: reusable authorization and state-transition rules.
5. Repository/data access: Prisma queries hidden behind the owning module's service/repository.
6. Response mapper: explicit safe projection; raw persistence records do not escape.

Circular dependencies are not accepted as the default solution. Shared concepts should move to a narrow common contract or event boundary, not a catch-all module.

## Authentication and authorization architecture

- Access tokens are short-lived HS256 JWTs today, validated with explicit issuer/audience/algorithm. Future algorithm/key changes require a decision and rollout plan.
- Access-token custom claims are limited to `sub`, `email`, and `role`; authorization-sensitive current state is reloaded where needed.
- Refresh sessions will be opaque, rotated, stored only as hashes, grouped into token families, and revocable.
- Email verification and reset tokens will be random, hashed at rest, expiring, and single-use.
- Global role checks and resource ownership/assignment checks are separate. Organization access additionally requires active membership in the path tenant.
- Admin capability must be permission-aware where high-risk functions diverge; a broad role alone is not a reason to skip resource checks.
- Security-significant actions emit audit events without sensitive payloads.

## Course lifecycle and versioning

- Courses move through draft, published, and archived lifecycle states.
- Published learning must be stable for existing enrollments. The implementation milestone must select immutable publication snapshots or another explicit version strategy before schema creation.
- Modules, lessons, quizzes, projects, rubrics, and certificate rules participate in versioning where learner history depends on them.
- Management previews can access authorized drafts; public/learner APIs default to the applicable published version.
- Reordering is transactional and validated as an exact set to prevent duplication or loss.

## AI and RAG architecture

```text
Mentor request
  -> authenticate and authorize course/lesson
  -> classify/validate request and enforce quota
  -> build retrieval filter (course version + allowed content)
  -> vector retrieval from PostgreSQL pgvector
  -> rerank/threshold and assemble cited context
  -> provider-neutral generation interface
  -> validate/capture source references and safe metadata
  -> return grounded answer or explicit no-grounding result
```

Ingestion flow:

1. A published course version is selected and authorized.
2. Source content is normalized and checksummed.
3. Deterministic chunks record course/version/lesson/source provenance.
4. Embeddings are generated through a provider interface and stored with vectors.
5. Job state records progress, attempt, failure category, model/config identifiers, and completion.
6. Changed or removed source content invalidates/replaces prior chunks through an idempotent forward-fix strategy.

AI must not bypass course access, cross organizations, return embedding vectors, expose system prompts/provider errors, or invent an answer when grounding is insufficient. Provider selection, model, retention, budget, and legal/privacy terms are approval gates.

## Background jobs and external integrations

- Email, ingestion, embedding, certificate rendering, notifications, large reports, and retries are job candidates.
- API transactions persist required state/outbox intent before asynchronous delivery.
- Jobs use idempotency keys, bounded retries, exponential backoff, failure visibility, and dead-letter/manual recovery semantics.
- Webhooks validate signatures, timestamps, replay protection, and idempotency.
- Email, object storage, job queue, monitoring, and hosting providers remain undecided.

## Configuration and observability

- Environment variables are validated at startup. `.env.example` contains placeholders only.
- Frontend receives only explicitly public values prefixed for Expo; no server secret is bundled.
- Logs are structured, correlate requests/jobs, and exclude credentials, tokens, passwords, private content, and excessive personal data.
- Health checks are safe and coarse. Readiness covers required dependencies; liveness does not fail because an optional provider is unavailable.
- Metrics and traces must use approved privacy-safe dimensions and avoid user/course titles as unbounded labels.

## Deployment topology target

- Local: Docker Compose for PostgreSQL/pgvector and later job dependencies; frontend/backend can run on host or containers.
- CI: clean installs, generation, validation, lint, typecheck, unit/e2e/browser tests, build, migration checks, secret/dependency scanning, container build.
- Staging: production-like configuration, isolated data, migrations before application promotion, smoke/browser/security/accessibility gates.
- Production: explicit approval only; immutable artifact promotion where practical; backup and restore readiness; monitored rollout; forward-fix/rollback plan.

See `DEPLOYMENT_RUNBOOK.md` for the operational sequence.

## Architectural constraints and known debt

- Frontend API/demo implementations are duplicated and inconsistent with backend contracts; resolve in the frontend-auth milestone, not ad hoc.
- Frontend route `/courses` currently embeds its own preview UI while `CoursesPreviewScreen` also exists; consolidation belongs to catalogue work.
- Root/backend starter components and scripts remain; removal requires a scoped cleanup decision after verifying no references.
- The current `User.role` supports one global role only; multi-role and organization membership must be designed before organization schema work.
- The current root endpoint is a Nest starter response; health/readiness replacement and compatibility require a future milestone.
- No global API versioning, standardized error filter, CORS/headers/rate limit, job runner, storage provider, or observability provider is implemented.
