# LearnXai Database Design

Status: the current schema is implemented; all other models below are approved conceptual design inputs, not existing tables. Every implementation requires a reviewed Prisma migration in its owning milestone.

## Database principles

- PostgreSQL is the system of record; Prisma 7 is the application ORM.
- Use UUID primary keys unless a documented decision requires another identifier.
- Store timestamps as timezone-aware values; API serialization uses UTC ISO 8601.
- Use explicit enums only when lifecycle values are stable enough to justify migration cost; otherwise use constrained reference/state patterns.
- Normalize identity and relational data; denormalize only measured read models/aggregates with a rebuild strategy.
- Preserve learner history: published course versions, attempts, submissions, reviews, certificates, and audit records must remain interpretable after content changes.
- Use database constraints in addition to application validation for uniqueness, foreign keys, required values, and valid one-to-one relationships.
- Index demonstrated query/filter/order patterns; avoid speculative indexing without workload evidence.
- Sensitive tokens are never stored in plaintext. Access tokens are not stored in PostgreSQL.
- Destructive migration/data-retention work requires approval and backup/restore planning.

## Current implemented schema

Migration: `20260715160823_init_user_model`.

### Enum `UserRole`

Values: `LEARNER`, `ADMIN`, `INSTRUCTOR`, `ORG_ADMIN`.

### Table `users`

| Column | Type/constraints | Purpose |
|---|---|---|
| `id` | UUID primary key, generated | Stable user identity |
| `name` | varchar(120), required | Current display/full name |
| `email` | varchar(180), required, unique | Normalized login email |
| `password_hash` | varchar(255), required | Bcrypt hash only |
| `role` | `UserRole`, required, default `LEARNER` | Current single global role |
| `is_email_verified` | boolean, default false | Current verification state |
| `created_at` | timestamptz, default now | Creation time |
| `updated_at` | timestamptz, updated by Prisma | Last update time |

Indexes: primary key and unique `users_email_key`. PostgreSQL/Prisma also maintains `_prisma_migrations` after migration deployment.

Known limitations: single role, no profile split, no account status, no token/session tables, and no organization membership. These are planned, not defects to change outside their milestones.

## Planned identity and access entities

### `refresh_sessions`

- User foreign key; token-family identifier; current token hash; previous/reuse metadata as required; issued, last-used, expires, revoked timestamps; revoke reason; optional privacy-approved device metadata.
- Unique token/session selectors and indexes by user/status/expiry.
- Rotation must be transactional. Reuse detection revokes the family according to policy.

### `email_verification_tokens` and `password_reset_tokens`

- User foreign key, random token hash, purpose, expiry, consumed time, created time.
- Never store or log plaintext token. Limit active tokens per user/purpose through transaction/policy.
- Index token hash and cleanup expiry; token consumption uses a single transaction/conditional update.

### `user_profiles` and `user_preferences`

- Optional profile fields separated from credentials where useful.
- Preferences include only approved product preferences, notification settings, locale/time zone, and accessibility choices.
- Email changes require a separate verification workflow rather than direct profile patching.

### Role and permission evolution

Before organizations/admin hardening, decide between:

1. one global role plus organization membership roles;
2. global many-to-many user roles; or
3. explicit permissions assigned through roles.

Organization roles must not be represented as unrestricted global administration. The decision and migration from `users.role` require approval and backfill tests.

## Planned course and curriculum entities

### `courses`

- Stable course identity, owner/creator, slug, lifecycle status, current draft/published version references, timestamps.
- Unique normalized slug where public. Index status/owner/update queries.

### `course_versions`

- Course foreign key, version number, title/summary/description/category/level/prerequisites/outcomes, visibility, publication metadata, content checksum.
- Published records become immutable or follow an explicitly equivalent snapshot strategy.

### `modules` and `lessons`

- Belong to a course version; ordered with a transaction-safe position/rank.
- Lesson type, title, summary, estimated duration, required flag, and sanitized content representation.
- Unique ordering constraint within parent where practical; indexes by parent/order.

### `lesson_content_blocks` and `lesson_resources`

- Typed, ordered blocks with validated JSON payload or normalized subtype tables based on implementation findings.
- Resources record authorized storage object, display name, media type, size, checksum, accessibility metadata, and processing status.
- Never store public storage URLs as permanent authorization; use provider object keys and expiring access.

## Planned enrollment and progress entities

### `enrollments`

- User, course, pinned course version, source, optional organization assignment, status, enrolled/completed/revoked timestamps.
- Unique active enrollment policy by user/course/source as decided; indexes for user/status, course/status, organization/status.

### `lesson_progress`

- Enrollment and lesson identity, status, position/last-viewed state where appropriate, started/completed timestamps, version.
- Unique enrollment+lesson. Updates are idempotent and validate that lesson belongs to the enrollment version.

Course progress is preferably derived from required lesson progress and versioned rules initially. Persisted aggregates require transaction/outbox or rebuild semantics.

## Planned quiz entities

- `quizzes`: course version/module/lesson association, settings, pass score, attempt/timing/reveal policy, lifecycle/version.
- `quiz_questions`: typed prompt, order, points, explanation/reveal policy.
- `quiz_options` or type-specific answer definitions: private correctness data separated from learner projections.
- `quiz_attempts`: user/enrollment/quiz-version, attempt number, status, timing, score, pass state, submitted/graded timestamps.
- `quiz_answers`: attempt/question, learner value, awarded points, grading metadata.

Constraints must prevent cross-quiz question answers, post-submission mutation, duplicate attempt numbers, and premature answer-key disclosure. Randomized order must be persisted per attempt.

## Planned project and submission entities

- `projects` and `project_versions`: course association, brief, rules, availability, submission types.
- `rubric_criteria`: project version, order, description, maximum points.
- `project_submissions`: learner/enrollment/project version, draft/submitted/reviewed state, text/link payload, version, timestamps.
- `submission_files`: authorized object key, scan status, checksum, media type, size; no permanent public URL.
- `submission_reviews`: reviewer, decision/status, total, feedback, version/timestamps.
- `submission_review_scores`: review+rubric criterion, points and feedback.

History must preserve what the learner submitted and which rubric/version was used. Review changes and status transitions are audited.

## Planned certificate entities

- `certificate_rules` tied to a course version: required completion, quiz/project thresholds, and version.
- `certificates`: user, enrollment/course version, unique high-entropy public verification ID, issue status/time, revoked time/reason, immutable eligibility snapshot.
- Optional rendered artifact references use authorized storage and regeneration metadata.

Unique constraints prevent duplicate active issuance for the same rule/enrollment. Public verification returns a minimal projection.

## Planned organization entities

- `organizations`: name, status, approved metadata, timestamps.
- `organization_memberships`: organization+user, organization-scoped role/status, joined/invited/removed timestamps; unique active membership.
- `organization_invitations`: normalized email, organization role, token hash, expiry/accepted/revoked state.
- `cohorts`: organization, name, status, timestamps; unique name policy within organization.
- `cohort_memberships`: cohort+organization membership, timestamps; database/application constraints guarantee same organization.
- `course_assignments`: organization, course/version policy, target type, dates/status, creator, idempotency key.
- Assignment target join tables for cohorts/members and linkage to resulting enrollments.

Every organization query must include tenant scope. Foreign keys alone may not enforce all same-tenant relationships, so application policies and integration tests are mandatory; PostgreSQL row-level security is an open decision, not assumed.

## Planned notifications, audit, and jobs

### `notifications`

- Recipient, type, safe structured payload, read/delivered timestamps, action reference, deduplication key.
- Never place secrets, plaintext tokens, or unrestricted personal content in payload JSON.

### `audit_events`

- Event ID, timestamp, actor/user/session, organization scope, action, resource type/id, outcome, request correlation, redacted metadata.
- Append-oriented; normal application flows do not update/delete records. Retention/export access requires legal/privacy decision.

### `jobs` / outbox

- Job type, idempotency key, safe payload or reference, status, attempts, run-after/started/completed times, redacted failure category.
- Provider-specific queue may replace polling, but durable business intent/outbox semantics remain.

## Planned AI and vector entities

PostgreSQL `pgvector` extension is introduced only in the AI milestone through a reviewed migration and compatible deployment plan.

- `ai_content_sources`: course/version/lesson reference, source type, checksum, processing status.
- `ai_chunks`: source/course/version/lesson, deterministic ordinal, normalized text, token/character metadata, checksum, active state.
- `ai_embeddings`: chunk, provider/model/dimension, vector column, created time; unique compatible embedding per chunk/config.
- `ai_ingestion_jobs`: course version/config/checksum, status, attempts/counts, redacted error, timestamps.
- `ai_conversations`: user, authorized course context, retention/deletion state.
- `ai_messages`: conversation, role, safe content, provider/model/config metadata as approved, timestamps.
- `ai_message_sources`: answer message to retrieved chunk with rank/score/provenance.
- Optional usage ledger for cost/quota must avoid unbounded provider payloads and follow retention/privacy policy.

Vector indexes (HNSW/IVFFlat) and distance operator depend on chosen embedding dimensions and measured workload. Retrieval always filters authorization/course version before or safely with similarity ranking.

## Migration strategy

1. Design the entity and invariants in the owning milestone.
2. Prefer additive schema: new nullable columns/tables/indexes first.
3. Generate migration without applying to production; inspect SQL and lock impact.
4. Test clean migration, upgrade from current schema, constraints, backfill, and rollback/forward-fix on disposable data.
5. Separate long backfills/index creation when production lock/runtime risk warrants it.
6. Deploy backward-compatible application/schema in expand–migrate–contract phases.
7. Never edit an applied migration to change history; add a corrective migration.
8. Destructive contract/removal waits until old code/data is retired, backups verified, and approval granted.

Prisma commands:

```powershell
npm run prisma:generate
npm run prisma:validate
```

Migration creation/application commands must be specified by the owning milestone and environment. They are not automatic autonomous actions against production.

## Backup, restore, and retention

- Provider, cadence, retention, encryption, point-in-time recovery, and restore objectives remain unresolved.
- Before staging sign-off, perform and document an isolated restore test.
- Before destructive production migrations, verify a recent recoverable backup and forward-fix plan.
- User deletion/anonymization, course history, audit retention, AI conversation retention, organization export, and legal hold policies require legal/privacy approval.
