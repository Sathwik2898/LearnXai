# LearnXai Repository Operating Contract

This file is the permanent execution contract for work in this repository. It applies to human contributors and autonomous coding agents. A milestone-specific instruction may narrow scope further, but it must not silently weaken the safety, verification, documentation, or approval rules below.

## Required reading before every milestone

Before changing anything:

1. Read this file completely.
2. Read `docs/BUILD_PROGRESS.md` and `docs/EXECUTION_PLAN.md`.
3. Read every domain document relevant to the milestone:
   - product behavior: `docs/PRODUCT_REQUIREMENTS.md`
   - screens and routes: `docs/SCREEN_INVENTORY.md`
   - APIs: `docs/API_CONTRACTS.md`
   - system boundaries: `docs/ARCHITECTURE.md`
   - data changes: `docs/DATABASE_DESIGN.md`
   - tests: `docs/TEST_STRATEGY.md`
   - security: `docs/SECURITY_CHECKLIST.md`
   - operations: `docs/DEPLOYMENT_RUNBOOK.md`
   - established and unresolved decisions: `docs/DECISIONS.md`
4. Inspect the current implementation and Git state; documentation is not a substitute for source-of-truth verification.
5. Confirm the approved milestone, dependencies, acceptance criteria, and pause gates before editing.

## Product and repository boundaries

- Product: LearnXai, a production-oriented learning management system for learners, instructors, administrators, and organization administrators.
- Frontend stack: Expo Router, React Native, React Native Web, and TypeScript.
- Frontend route files: `app/`.
- Frontend implementation: `src/`; shared Expo starter components remain under `components/`, `hooks/`, and `constants/` until deliberately retired.
- Backend stack: NestJS and TypeScript.
- Backend root: `backend/learnxai-api/` only.
- Database: PostgreSQL.
- ORM: Prisma 7.
- Prisma root: `backend/learnxai-api/prisma/` only.
- Generated Prisma client: `backend/learnxai-api/src/generated/prisma/`; it is intentionally ignored and must never be edited or committed.
- Planned AI architecture: provider abstraction, an OpenAI implementation only after approval and credentials, PostgreSQL `pgvector`, and grounded course-aware retrieval-augmented generation.
- Planned infrastructure: Docker Compose, GitHub Actions, staging-first deployment, and environment-based configuration.

Do not create another frontend, backend, Prisma root, package root, or Git repository.

## Milestone execution rules

- Work through approved milestones sequentially and respect dependency order.
- Do not bundle unrelated features or opportunistic refactors into a milestone.
- Continue automatically after a normal successful milestone unless the active instruction explicitly says to stop, request approval, or limit work to that milestone.
- Update `docs/BUILD_PROGRESS.md` after every milestone with status, commit, checks, decisions, migrations, and the next approved milestone.
- Update the relevant permanent contracts whenever a milestone changes product behavior, routes, APIs, architecture, data, security posture, testing, deployment, or an accepted decision.
- Run every quality check specified by the milestone and `docs/TEST_STRATEGY.md`.
- Commit every successful milestone separately with its required commit message.
- Do not commit a partially passing milestone as complete.
- Do not rewrite, squash, reset, or discard completed milestone commits unless the user explicitly authorizes it.
- If a completed milestone has a genuine blocking defect, explain the evidence before making the smallest necessary correction and record it in `docs/BUILD_PROGRESS.md` and `docs/DECISIONS.md` when architectural.

## Approval and pause gates

Pause only when a milestone requires or encounters:

- destructive or irreversible database changes;
- paid services, subscriptions, or billable APIs;
- credentials, private keys, tokens, or secrets;
- cloud resources or material cloud costs;
- major dependency or framework upgrades;
- a production deployment or production-data operation;
- DNS, domain, certificate, or email-sender changes;
- legal, privacy, retention, consent, or compliance decisions;
- a genuine blocker after safe in-scope alternatives are exhausted.

Normal source edits, reversible local tests, additive migrations already approved in a milestone, disposable local test data, and documented non-production smoke tests do not require a new pause unless the active instruction says otherwise.

## Git and file safety

- Begin each milestone by reporting branch and working-tree status.
- Preserve user changes and unrelated worktree changes.
- Never use destructive Git or filesystem commands without explicit authorization and verified targets.
- Never commit generated files, dependency directories, build output, coverage output, logs, local database data, `.env` files, or secrets.
- Never push, merge into `main`, rewrite remote history, tag a release, or deploy production without approval.
- Keep commits scoped to one milestone and use the exact required message.
- End each milestone by reporting the commit hash and clean/dirty status.

## Environment and secret handling

- Configuration must come from environment variables, with safe placeholder-only `.env.example` files.
- Never print, copy, commit, paste into documentation, or return real environment values.
- Never add an insecure production fallback secret.
- Test secrets must be clearly synthetic, process-local, and non-production.
- Redact provider responses, connection strings, tokens, reset links, verification links, authorization headers, and personal data from logs and reports.

## Architecture rules

- Keep Expo Router route files thin; place screens and domain logic under `src/`.
- Use extensionless imports for platform-specific frontend files.
- Keep backend controllers responsible for HTTP translation, services for use cases, Prisma access behind domain services, and common guards/decorators reusable.
- Return explicit safe response contracts; never serialize raw Prisma records containing private fields.
- Normalize and validate input at trust boundaries.
- Apply role and organization authorization server-side; frontend hiding is not authorization.
- Keep AI providers behind an interface and require retrieval citations/provenance for grounded answers.
- Background work that can be retried or is slow must move to a job boundary once the jobs milestone exists.
- Prefer additive, forward-compatible database changes; follow `docs/DATABASE_DESIGN.md` for migration sequencing.

## Documentation truth rules

- Label capabilities as `Implemented`, `Planned`, `Blocked`, or `Deprecated`; never present planned behavior as shipped.
- Do not invent testimonials, customer logos, user counts, placement outcomes, partner claims, uptime, completion rates, revenue, or other social proof.
- Examples and fixtures must be labeled as examples or test data.
- Historical documents may be retained, but they must be clearly marked and linked to current sources of truth.
- Record material decisions and alternatives in `docs/DECISIONS.md`.

## Quality gates

Run the commands applicable to the changed scope. The minimum established baseline is:

```powershell
# Frontend, from repository root
npm run typecheck
npm run lint

# Backend, from backend/learnxai-api
npm run prisma:generate
npm run prisma:validate
npm run lint
npm run build
npm test -- --runInBand --no-cache
npm run test:e2e -- --runInBand --no-cache

# Repository
git diff --check
```

Additional browser, accessibility, security, migration, container, and staging checks are mandatory when the milestone defines them. Tests must not modify production data. Use isolated databases, transactions, disposable fixtures, or in-memory adapters as defined in `docs/TEST_STRATEGY.md`.

## Definition of milestone completion

A milestone is complete only when:

- its acceptance criteria pass;
- required tests and smoke checks pass;
- schema and migrations match the approved scope;
- no secret, generated output, or unrelated file is staged;
- permanent documentation and `docs/BUILD_PROGRESS.md` are current;
- `git diff --check` passes;
- the milestone has one focused commit; and
- the final Git status is reported.
