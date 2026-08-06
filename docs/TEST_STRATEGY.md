# LearnXai Test Strategy

## Purpose

Testing provides evidence that product contracts, authorization, data integrity, cross-platform behavior, and operations work as specified. Passing compilation alone is not feature completion.

## Current baseline

### Frontend

- `npm run typecheck`: strict, non-emitting frontend TypeScript check; excludes backend.
- `npm run lint`: non-mutating Expo/ESLint check for route/product/shared frontend directories.
- No committed frontend unit/component/browser runner yet. Selecting the minimal compatible harness is part of F03.

### Backend

- Prisma client generation and schema validation scripts.
- Non-mutating ESLint; generated Prisma ignored.
- Nest production build to `dist/main.js`.
- Jest unit tests: current app/auth/JWT behavior.
- Jest/Supertest e2e: isolated in-memory Prisma-compatible user store; current root/health/registration/login/current-user paths.
- Production-start smoke with process-local test configuration.

### Current baseline commands

```powershell
# Repository root
npm run typecheck
npm run lint

# backend/learnxai-api
npm run prisma:generate
npm run prisma:validate
npm run lint
npm run build
npm test -- --runInBand --no-cache
npm run test:e2e -- --runInBand --no-cache

# Repository root
git diff --check
```

## Test layers

### Static checks

- TypeScript errors: zero.
- Lint errors/warnings: zero unless an approved rule explicitly permits warnings and progress records them.
- Formatting/whitespace: `git diff --check` and project formatter checks where configured.
- Prisma schema/migration validation.
- Environment examples contain placeholders only; secret scanning later becomes CI-mandatory.
- Documentation consistency checks for every contract milestone.

### Unit tests

Cover pure validation, normalization, mapping, authorization policies, state machines, eligibility/scoring/progress calculations, provider adapters, chunking, idempotency, and error mapping. Unit tests do not replace database constraints or HTTP authorization tests.

Required patterns:

- Success and boundary values.
- Invalid/missing/oversized inputs.
- Safe responses exclude private fields.
- Same generic response where enumeration is a risk.
- Time behavior uses controlled clocks where practical.
- Provider calls are faked; fixtures are synthetic and contain no secrets.

### Component tests

Once F03 establishes a frontend harness:

- Render forms/screens with accessible queries.
- Verify loading, empty, error, success, disabled, and retry states.
- Verify keyboard and screen-reader semantics rather than implementation details.
- Mock the API transport at the boundary, not arbitrary component internals.
- Test compact and wide layout decisions where behavior changes.

### Database integration tests

Use a disposable PostgreSQL database/schema or isolated containers. They must never point at production. Cover:

- Clean migration and upgrade from the previously committed schema.
- Unique/foreign-key/check constraints and transaction behavior.
- Prisma query projections and indexes/query plans for critical access paths.
- Concurrent writes for registration, rotation, enrollment, submission, issuance, and reorder.
- Tenant and ownership filtering.
- Migration failure and forward-fix procedure where risk warrants.

In-memory adapters are useful for fast HTTP behavior but do not prove Prisma/PostgreSQL correctness. Data milestones must add real disposable-database integration coverage.

### API e2e tests

Run the Nest application through HTTP and cover:

- Exact method/path/status and safe response contracts.
- Authentication: missing, malformed, invalid-signature, expired, revoked, reused, and wrong-audience/issuer tokens as applicable.
- Authorization: every role, resource ownership, instructor assignment, and cross-organization denial.
- Validation and conflict/race behavior.
- Pagination, ordering, filtering, idempotency, and lifecycle transitions.
- No passwords, hashes, tokens, vectors, grading keys, stack traces, or internal provider errors in responses.
- Health/readiness and dependency failure behavior.

Fixtures are unique per test, reset or transactionally cleaned, and never modify production data.

### Browser tests

F03 must select a browser automation approach compatible with Expo Web and current dependencies. Critical browser coverage grows with milestones:

- Authentication and recovery.
- Protected direct URLs and role navigation.
- Catalogue/detail/enrollment/resume.
- Course player and progress.
- Quiz and project submission/review.
- Certificates and public verification.
- Instructor/Admin and Organization Admin denial/success flows.
- AI grounded/no-grounding/error states.

Run at representative desktop and compact/mobile viewport sizes. Prefer stable accessible selectors. Browser tests use isolated backend data and clean it up.

### Native smoke and platform tests

- Verify iOS/Android bundle/type compatibility for milestones affecting platform code.
- Run critical flows on at least one supported simulator/device per platform before release approval.
- Test deep links, safe areas, keyboard avoidance, secure storage, app background/resume, text scaling, orientation where supported, and network loss/recovery.
- App-store submission testing is out of scope until native release is approved.

### Accessibility tests

- Automated checks are necessary but insufficient.
- Manual keyboard-only flow, visible focus, semantic names/roles, heading structure, error association, contrast, reduced motion, zoom/reflow, screen-reader announcements, dynamic text, touch targets, and chart alternatives.
- Target WCAG 2.2 AA for applicable web content; record exceptions and remediation owners.

### Security tests

- Authentication/session rotation/revocation/replay.
- Object-level authorization and cross-tenant matrix.
- Mass assignment, injection, XSS/content sanitization, CSRF based on credential transport, CORS, security headers, rate limiting, file upload, SSRF/provider callbacks, and secret/log leakage.
- Dependency, SAST, secret, container, and DAST checks after CI milestone.
- AI prompt injection, retrieval-scope bypass, cross-course/org leakage, unsafe citations, system-prompt extraction, and quota abuse.

### AI evaluation

AI is not accepted on anecdotal output. Maintain versioned synthetic/approved evaluation sets for:

- retrieval recall/precision at useful thresholds;
- citation/source correctness;
- groundedness and explicit no-answer behavior;
- authorization isolation;
- prompt injection and malicious course content;
- provider failure/timeouts;
- latency and usage/cost classes after budgets are approved.

Never put private production learner/course data in local or third-party evaluation without approval.

### Performance and resilience

- Define budgets/SLOs before claiming them.
- Test pagination and worst credible query shapes; inspect critical query plans.
- Load-test login/refresh, catalogue, progress, quiz submit, reports, and mentor endpoints in staging-safe conditions.
- Test dependency timeouts, retries, circuit behavior where implemented, worker restarts, duplicate jobs, provider outage, and graceful shutdown.
- Verify backups/restores and migration runtime/locks before production readiness.

## Test data policy

- Synthetic by default; label examples.
- Use UUIDs/random suffixes to avoid collision.
- Keep credentials process-local and clearly test-only.
- Reset in-memory stores; rollback transactions or delete only owned disposable fixtures.
- Do not log test passwords/tokens. Do not copy real `.env` values into fixtures or snapshots.
- Seed scripts must be environment-gated and must refuse production unless an explicit, reviewed production operation exists.

## CI gate target

After F17, a pull/commit candidate should run:

1. clean lockfile installs;
2. Prisma generate/validate and migration drift/clean migration;
3. frontend typecheck/lint/unit;
4. backend lint/build/unit/integration/e2e;
5. browser critical smoke;
6. security/secret/dependency/container scans;
7. container build and health;
8. documentation links/contract checks;
9. artifact and Git cleanliness checks.

Flaky tests are defects. Quarantine requires an owner, reason, expiry, and equivalent manual evidence; silent retries are not a passing strategy.

## Milestone test report

`BUILD_PROGRESS.md` must record commands, suite/test counts, environment type, migrations tested, browser/native coverage, known warnings, and any skipped check with reason. A milestone cannot claim a capability based only on planned tests.
