# LearnXai Deployment Runbook

## 1. Purpose and current state

This runbook defines the intended staging-first deployment process for LearnXai. It is a specification, not evidence that deployment automation already exists. As of Milestone 4A:

- the frontend and backend build and test locally;
- the backend exposes liveness through `GET /auth/health`;
- Docker Compose, GitHub Actions, readiness checks, background workers, managed infrastructure, and production environments are planned but not yet implemented;
- no production deployment is authorized by this document.

Production deployment always requires explicit approval. See [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) for the milestones that create and validate the delivery system.

## 2. Deployment principles

1. Promote the same immutable revision through development, staging, and production.
2. Validate in staging before considering production.
3. Supply configuration through environment variables or an approved secret manager; never bake secrets into images or source control.
4. Run database migrations as an explicit, observable release step.
5. Prefer backward-compatible expand-and-contract migrations.
6. Keep frontend, API, worker, migration, and AI-ingestion responsibilities independently observable.
7. Stop for approval before destructive migrations, paid services, credentials, cloud costs, production deployment, or DNS changes.
8. Preserve a tested forward-fix or rollback path for every release.

## 3. Planned runtime topology

| Component | Responsibility | Planned packaging |
| --- | --- | --- |
| Web frontend | Public and authenticated React Native Web application | Static/web artifact or container |
| Native clients | iOS and Android Expo applications | Signed store builds in a later approved release process |
| NestJS API | HTTP API, authentication, authorization, domain services | Container |
| Worker | Email, notifications, ingestion, and other asynchronous jobs | Container using the same reviewed revision |
| PostgreSQL | Transactional data and `pgvector` embeddings | Managed service or persistent container for local development only |
| Object storage | Course assets and submissions | Approved managed provider; private by default |
| Email provider | Verification, reset, and notifications | Approved transactional provider |
| Observability | Logs, metrics, traces, alerts, and error reporting | Approved provider(s) |

Local development will use Docker Compose once Milestone F17 is complete. Staging and production hosting remain open decisions.

## 4. Environment matrix

| Environment | Purpose | Data policy | Deployment gate |
| --- | --- | --- | --- |
| Local | Development and automated testing | Disposable or developer-owned non-production data | None beyond repository rules |
| CI | Reproducible quality checks | Ephemeral test data | Pull-request or commit checks |
| Staging | Integration, browser, migration, and release validation | Synthetic or explicitly approved test data | Successful CI and staging approval |
| Production | Real customer workloads | Production privacy and retention policy | Explicit human approval after staging sign-off |

Never copy production data into local or CI environments. Any production-derived staging dataset must be approved and irreversibly de-identified.

## 5. Configuration contract

The current backend example file defines:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `PORT`

Future capabilities will add documented variables for refresh-token policy, public URLs, CORS origins, email, object storage, queues, observability, OpenAI, and AI limits. Each addition must be represented by a placeholder in an example environment file and validated at startup. Real values belong in an approved secret store.

Minimum rules:

- use unique secrets per environment;
- use least-privilege database and service accounts;
- do not use a JWT fallback secret in staging or production;
- rotate credentials with an overlap/revocation plan;
- restrict access to secrets and audit reads and changes;
- never print environment contents in logs, CI output, or milestone reports.

## 6. Clean-checkout baseline

Before container automation exists, the repository baseline is verified with:

```powershell
npm ci
npm run typecheck
npm run lint

Set-Location backend/learnxai-api
npm ci
npm run prisma:generate
npm run prisma:validate
npm run lint
npm run build
npm test -- --runInBand --no-cache
npm run test:e2e -- --runInBand --no-cache
```

The frontend and backend lockfiles are authoritative. Do not run automatic dependency upgrades or vulnerability fixes as part of a deployment.

## 7. Planned CI pipeline

GitHub Actions should run, in order:

1. checkout the exact revision;
2. install frontend and backend dependencies with `npm ci`;
3. verify Prisma generation and schema validation;
4. run frontend typecheck and lint;
5. run backend lint, build, unit tests, and e2e tests;
6. scan committed content for secrets and generated/build artifacts;
7. build immutable frontend/API/worker artifacts;
8. publish artifacts only from an approved protected workflow;
9. deploy to staging;
10. run staging migrations and smoke/browser tests;
11. retain test reports, artifact identifiers, migration output, and deployment evidence.

Production promotion must be a separate protected action with environment approval. CI must not silently deploy production from an ordinary push.

## 8. Staging deployment procedure

### 8.1 Preflight

- Confirm the approved commit and expected milestone commit message.
- Confirm the working tree used to build the artifact is clean.
- Confirm every required CI check passed for that exact commit.
- Review dependency, schema, migration, configuration, and infrastructure diffs.
- Confirm migrations are additive or that a specific destructive-change approval exists.
- Confirm backup and restore evidence is current when persistent data is affected.
- Confirm required environment variables exist without displaying their values.
- Record the current staging artifact and database migration state.

### 8.2 Release

1. Build or select the immutable artifacts for the approved commit.
2. Put the new configuration in place through the environment/secret manager.
3. Run `prisma migrate deploy` as a single controlled migration job when migrations exist.
4. Deploy the API and worker with readiness gating.
5. Deploy the web artifact.
6. Wait for all instances to report ready before routing traffic.
7. Record artifact identifiers, migration names, timestamps, and operator/automation identity.

Do not use `prisma migrate dev`, `prisma db push`, or ad hoc SQL in staging or production.

### 8.3 Verification

- Verify liveness and the future readiness endpoint.
- Exercise registration, login, refresh/logout when available, and protected current-user access using disposable staging accounts.
- Exercise the changed domain journey with API and browser tests.
- Verify unauthorized and cross-role/cross-tenant requests are denied.
- Check logs, metrics, traces, error rate, latency, queue depth, and database health.
- Verify no response or log contains credentials, tokens, password hashes, or unexpected personal data.
- Clean up disposable test records through supported application/test tooling.

### 8.4 Observation and sign-off

Observe staging for a period proportional to release risk. Record test evidence, known warnings, and the decision to reject, revise, or approve the candidate. Staging success does not itself authorize production.

## 9. Production deployment procedure

Production deployment is paused until explicit approval. After approval:

1. verify that the candidate is the exact staging-tested artifact;
2. announce the maintenance/risk window through the approved operational channel;
3. verify current backups and restore readiness;
4. capture baseline service and database metrics;
5. apply approved configuration and migrations;
6. deploy gradually when the platform supports canary or rolling releases;
7. run non-destructive health and critical-journey smoke tests;
8. monitor security, application, queue, AI-cost, and database signals;
9. record the release evidence and close or escalate the change.

DNS, domain, certificate, and native-store changes are separate approval gates.

## 10. Health and readiness

- Current liveness: `GET /auth/health`, which must remain safe and unauthenticated.
- Planned readiness: a dedicated endpoint that checks only essential dependencies with strict timeouts and returns no sensitive topology or credentials.
- Root `GET /` is informational and must not substitute for readiness.

Load balancers should use readiness for traffic routing and liveness only for process recovery. Alerts should distinguish application failure from dependency degradation.

## 11. Migration operations

For every schema milestone:

1. generate a reviewed Prisma migration locally against a disposable database;
2. inspect SQL, constraints, indexes, lock risk, and expected duration;
3. test upgrade from a representative prior schema and test application compatibility;
4. take or verify a backup before risky production changes;
5. deploy expand changes before code that depends on them;
6. defer destructive contract changes to a later approved release;
7. run `prisma migrate deploy` once per environment;
8. verify migration state and domain smoke tests.

Never edit an already-applied migration. Add a corrective migration. Data loss, table rewrites, long locks, or irreversible transformations require an explicit pause and approval.

## 12. Forward-fix and rollback

Application-only regressions should normally roll back to the previous immutable artifact if it remains schema-compatible. Database changes should normally be forward-fixed because reversing applied migrations can lose data or create divergent histories.

Every milestone must identify:

- the last known-good artifact;
- schema compatibility across old and new application versions;
- feature-flag or traffic-disable options where relevant;
- the corrective migration or data-repair approach;
- who may authorize restoration from backup.

Stop traffic or disable the affected capability if continuing would corrupt data, leak data, or increase security impact.

## 13. Backup and restore

Before production readiness, the selected PostgreSQL service must provide encrypted automated backups, point-in-time recovery, retention appropriate to policy, and documented restoration to an isolated environment. Object storage needs versioning or an equivalent recovery mechanism.

Restore drills must verify both technical recovery and application consistency. Record recovery point objective and recovery time objective only after product and operational owners approve them; they are unresolved in Milestone 4A.

## 14. Incident and secret-rotation procedure

For a suspected incident:

1. preserve evidence and open the approved incident channel;
2. contain the affected service, credential, token family, tenant, or feature;
3. rotate exposed credentials without printing them;
4. revoke sessions or keys as supported;
5. assess data scope, legal/privacy notification duties, and customer impact;
6. recover from a verified artifact and data state;
7. document the timeline, cause, remediation, and follow-up tests.

Legal, privacy, and breach-notification decisions always require human approval.

## 15. Required release record

Each staging or production release record must contain:

- environment, commit, artifact identifiers, and milestone;
- approver and deployment actor;
- configuration keys changed, without values;
- migrations applied;
- verification commands and results;
- remaining warnings;
- rollback/forward-fix decision;
- incident links, if any.

Update [BUILD_PROGRESS.md](./BUILD_PROGRESS.md) after each completed implementation milestone. Architectural and product decisions belong in [DECISIONS.md](./DECISIONS.md).

## 16. Unresolved deployment decisions

- cloud/runtime provider and regions;
- managed PostgreSQL and `pgvector` provider;
- web and API domains, DNS owner, and TLS management;
- object storage, email, queue, observability, and error-reporting providers;
- backup retention, recovery objectives, and disaster-recovery region;
- staging and production sizing, budgets, and autoscaling;
- native build/signing/store process;
- incident ownership, support hours, and service-level objectives.

These choices must be approved in their relevant execution milestones before costs or credentials are created.
