# LearnXai Security Checklist

Status values: **Done**, **Partial**, **Planned**, **Approval required**, **Not applicable**. Update status only with evidence and record milestone/commit in `BUILD_PROGRESS.md`.

## Governance and threat model

- [Partial] Roles and product boundaries are documented; formal data-flow threat model is planned for F19 and must evolve per major domain.
- [Done] Autonomous work pauses for secrets, paid services, destructive data changes, production deployment, DNS, legal/privacy, major upgrades, and genuine blockers.
- [Planned] Define security owner, incident contacts, severity policy, remediation timelines, and risk-acceptance expiry before staging.
- [Approval required] Privacy policy, terms, consent, age/minor scope, retention/deletion, AI data use, copyright/IP, breach obligations, and organization-data terms.

## Secrets and configuration

- [Done] `.env` is ignored; `.env.example` uses placeholders; generated/build output ignored.
- [Done] JWT access secret is required with no insecure fallback and is not printed.
- [Partial] Backend validates JWT configuration; full centralized validation for every environment variable is planned.
- [Planned] Separate development/test/staging/production secret stores and least-privilege service credentials.
- [Planned] Secret scanning in CI and history/release process.
- [Planned] Rotation/revocation runbooks for JWT, database, email, storage, AI, queue, monitoring, and deployment credentials.
- [Planned] Frontend bundle review proves only explicitly public `EXPO_PUBLIC_*` values exist.

## Authentication

- [Done] Registration normalizes unique email, validates input, hashes with bcrypt, stores only `passwordHash`, and returns a safe user.
- [Done] Login uses generic 401 for unknown/wrong credentials and validates password limits.
- [Done] Short-lived access JWT verifies explicit HS256 algorithm, expiry, issuer, and audience.
- [Done] Missing, malformed, wrong-signature, expired, and deleted-user token cases are tested.
- [Planned] Refresh tokens are opaque, high entropy, hash-only at rest, rotated on use, grouped into families, and reuse-detected.
- [Planned] Logout/session revocation, session list, bounded session lifetime, and security event audit.
- [Planned] Enumeration-safe email verification/recovery tokens: random, hashed, expiring, single-use, rate-limited.
- [Planned] Password-reset session revocation and password/history policy decision.
- [Planned] Login/registration/recovery rate limiting, abuse detection, and optional step-up/MFA decision for high-risk admins.
- [Approval required] Refresh credential transport, remember-session duration, MFA/SSO requirements.

## Authorization and tenant isolation

- [Partial] JWT role claim is validated and `/auth/me` reloads the user; general RBAC is not implemented.
- [Planned] Default-deny role guard/policy and resource ownership/assignment authorization.
- [Planned] Management permissions distinguish Instructor assignment from Admin platform scope.
- [Planned] Organization membership is path/resource scoped; cross-tenant tests cover every endpoint.
- [Planned] Last-Organization-Admin, self-role-change, protected Admin, and privilege-escalation invariants.
- [Planned] Public learner/course/certificate projections minimize data and conceal inaccessible resource existence when appropriate.
- [Approval required] Multi-role/permission model and PostgreSQL row-level-security decision.

## Input, output, and API security

- [Partial] Current auth inputs use explicit validation; global DTO validation/error normalization is not implemented.
- [Done] Current auth responses use a reusable safe user mapper; password fields are tested absent.
- [Planned] Allowlist DTOs, bounds, enum/UUID/date/URL validation, and mass-assignment tests for every endpoint.
- [Planned] Content sanitization for lesson/rich text, safe link policy, and XSS tests across web/native rendering.
- [Planned] Parameterized Prisma access only; raw SQL requires review and safe binding.
- [Planned] CORS allowlist, security headers, body limits, compression review, request IDs, safe error filter, and environment-sensitive docs exposure.
- [Planned] CSRF protection based on refresh credential transport; SameSite/Secure/HttpOnly policy if cookies are selected.
- [Planned] Per-user/IP/resource rate limits with proxy configuration and safe `429` behavior.
- [Planned] Pagination caps and query complexity/timeouts to limit abuse.

## Data protection and privacy

- [Done] Password hashes are not returned; access tokens are not stored in PostgreSQL.
- [Planned] Classify credentials, identity, learning, submission, organization, AI conversation, audit, and operational data.
- [Planned] TLS in transit and provider-managed/enforced encryption at rest; database connections verify certificates where required.
- [Planned] Least-privilege database roles for app, migration, backup, and reporting.
- [Planned] Backup encryption, access logging, restore tests, retention, point-in-time recovery, and deletion controls.
- [Planned] Personal-data export/correction/deletion/anonymization workflow consistent with learning/audit/certificate history.
- [Planned] Logs/metrics/traces redact tokens, emails where unnecessary, course private content, submissions, and provider payloads.
- [Approval required] Data residency, retention periods, legal holds, certificate public-name policy, small-cohort reporting thresholds.

## File and object storage

- [Planned] Allowlisted media types/extensions and magic-byte validation; bounded size/count.
- [Planned] Malware scanning/quarantine before reviewer/learner access.
- [Planned] Random object keys, private buckets, server-authorized expiring URLs, no permanent public paths.
- [Planned] Upload/download ownership and tenant checks; prevent path traversal and confused-deputy access.
- [Planned] Orphan cleanup, retention, checksum, and incident removal process.
- [Approval required] Storage/scanning provider, costs, supported content, copyright/IP rules.

## Email, notifications, and webhooks

- [Planned] Sender authentication and DNS after approval; no secrets/tokens in logs/analytics.
- [Planned] Links use approved HTTPS domain and single-use token; avoid leaking token through referrers where practical.
- [Planned] Generic recovery/resend responses, cooldowns, abuse handling.
- [Planned] Webhook signature/timestamp/replay verification and idempotency.
- [Planned] Notification payloads contain safe references rather than sensitive content.
- [Approval required] Email provider, sender/domain/DNS, templates/legal footer, retention.

## AI and RAG security

- [Planned] Provider interface keeps API credentials server-side and supports a fake test provider.
- [Planned] Retrieval filters by authorized user, enrollment, course version, lesson, and organization before returning context.
- [Planned] Chunk provenance/checksum/status; removed/unpublished content becomes unretrievable.
- [Planned] Prompt-injection tests for user messages and ingested content; system/provider details not exposed.
- [Planned] Grounding threshold and explicit no-answer behavior; citations validated against retrieved authorized chunks.
- [Planned] Output moderation/safety policy, bounded prompt/context/output, timeouts, cancellation, quota/cost controls.
- [Planned] AI conversations, provider payloads, and feedback follow approved retention/deletion policy.
- [Planned] Cross-course/org leakage, embedding/vector exposure, data exfiltration, tool abuse, and indirect injection evals.
- [Approval required] OpenAI/provider/model, paid usage, data-processing terms, retention, training opt-out, legal/privacy notice.

## Jobs and availability

- [Planned] Durable outbox/job state, idempotency, bounded retries/backoff, dead-letter/manual recovery.
- [Planned] Worker least privilege, graceful shutdown, concurrency limits, poison-message handling.
- [Planned] Health/readiness do not disclose hosts/secrets; required dependency failure prevents readiness.
- [Planned] Timeouts and safe retry boundaries for database, email, storage, AI, and webhooks.
- [Planned] Abuse/load/resilience tests and approved SLO/alert definitions.

## Supply chain, CI, and deployment

- [Partial] Lockfiles are committed and clean installs/build/test commands exist; dependency advisories remain known.
- [Planned] Dependency/SAST/secret/license/container scans in GitHub Actions; no automatic breaking vulnerability fix.
- [Planned] Minimal non-root container images, pinned base images/digests policy, SBOM/provenance as approved.
- [Planned] Protected branch/review/status checks and least-privilege GitHub/cloud tokens.
- [Planned] Immutable artifact promotion, staging gates, migration compatibility, backup and rollback/forward-fix evidence.
- [Planned] Production access controls, audit logs, emergency access, credential rotation, patch cadence.
- [Approval required] Major upgrades, CI/registry/cloud spend, production deployment.

## Client and accessibility safety

- [Planned] Platform secure credential storage; no access/refresh token in logs, URL, analytics, insecure general storage, or error reports.
- [Planned] Deep-link allowlist and token cleanup; no open redirects.
- [Planned] Sensitive screens consider app switcher/screenshot policy only when justified and usable.
- [Planned] Error messages remain accessible and do not trade privacy for detail.
- [Planned] Reduced-motion, focus, keyboard, screen-reader, contrast, zoom, and text-scaling checks reduce safety/access barriers.

## Release security gate

Before production approval:

- threat model and data inventory current;
- no unaccepted critical/high findings;
- auth/RBAC/tenant/file/RAG abuse suites pass;
- secrets/config/headers/CORS/rate limits verified in staging;
- backups and restore tested;
- monitoring/alerts and incident contacts tested;
- legal/privacy decisions complete;
- dependency/container findings reviewed with owners/expiry;
- production deployment remains an explicit approval action.
