# LearnXai API Contracts

Status: permanent contract catalogue. **Implemented** endpoints reflect current code. **Planned** endpoints are approved targets and must not be treated as available until `BUILD_PROGRESS.md` marks them complete.

## Contract conventions

- Current base path is unversioned. API versioning is unresolved in `DECISIONS.md`; do not change existing paths without a compatibility decision.
- JSON keys use camelCase; IDs are UUID strings unless a later entity contract explicitly chooses otherwise.
- Timestamps are ISO 8601 UTC strings at the HTTP boundary.
- Collection endpoints use deterministic ordering and cursor pagination: `{ items, nextCursor }`. Cursor format is opaque.
- Bearer authentication uses `Authorization: Bearer <accessToken>`.
- Role names are `LEARNER`, `INSTRUCTOR`, `ADMIN`, and `ORG_ADMIN`.
- Organization-scoped endpoints require both a valid role and active membership for the path organization.
- Safe responses include only documented fields. Raw Prisma records, password hashes, token hashes, provider secrets, internal prompts, and private storage paths are never serialized.
- Planned normalized errors use `{ statusCode, code, message, errors?, requestId? }`. Current endpoints retain existing NestJS behavior until an explicit error-envelope milestone.
- `400` validation errors describe fields safely; `401` never confirms account existence; `403` denies known identity scope; `404` may be used instead of `403` where resource existence must be concealed; `409` represents state/version conflicts; `429` includes safe retry guidance; `5xx` never exposes stack traces or provider internals.

## Shared safe response types

```ts
type Role = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN' | 'ORG_ADMIN';

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: string;
};

type AccessTokenResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: SafeUser;
};

type Page<T> = { items: T[]; nextCursor: string | null };
```

Domain response types are projections, not database mirrors. Course summaries omit draft content; learner progress omits grading keys; organization reports omit users outside the authorized organization; AI sources include authorized lesson/chunk identifiers but not embedding vectors.

## System and health

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Implemented starter | `GET /` | None | None | Plain text `Hello World!` | `200`; no private data | Unit and e2e exact response; remove only in a deliberate compatibility milestone |
| Implemented | `GET /auth/health` | None | None | `{ module: 'auth', status: 'ready', usersLayer: 'connected' }` | `200`; safe fixed response | E2E exact response and production-start smoke |
| Planned | `GET /health/live` | None | None | `{ status: 'ok', service, version? }` without secrets | `200` when process is alive; must not query optional dependencies | Unit/e2e and container healthcheck |
| Planned | `GET /health/ready` | None or protected network policy | None | `{ status, checks: { database, jobs?, ai? } }` with coarse states | `200` ready; `503` not ready; redact hosts/credentials | Dependency failure e2e, startup, container and staging probes |

## Authentication and account recovery

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Implemented | `POST /auth/register` | None | `RegisterDto { name, email, password }`; trimmed name 2–120, normalized valid email ≤180, password ≥8 characters and ≤72 UTF-8 bytes | `SafeUser` | `201`; `400` field validation; `409` normalized duplicate; no hash/internal Prisma error | Success, normalization, bcrypt hash, duplicate/race, invalid fields, safe response, HTTP e2e |
| Implemented | `POST /auth/login` | None | `LoginDto { email, password }`; normalized valid email, password 8+ and ≤72 bytes | `AccessTokenResponse` | `200`; `400` DTO; identical `401 Invalid email or password.` for unknown/wrong; no hash | Success, normalization, both 401 paths, JWT claims/expiry/issuer/audience, safe response, e2e |
| Implemented | `GET /auth/me` | Bearer; any authenticated role | None | `SafeUser` resolved from current database record | `200`; `401` missing/malformed/bad signature/expired/deleted user | Guard verification, safe response, deleted user, role variants, e2e |
| Planned | `POST /auth/refresh` | Refresh token in approved secure transport; no access token required | `RefreshDto` transport-specific token; valid UUID/session binding if used | New `AccessTokenResponse` plus rotated refresh credential via secure transport | `200`; generic `401` invalid/expired/revoked/reused; reuse revokes token family | Rotation, old-token replay, concurrent refresh, expiry, revoked session, no plaintext storage/logging |
| Planned | `POST /auth/logout` | Current refresh session; access token when available | Optional `{ allSessions?: false }`; all-session logout requires confirmed policy | `204` | Idempotent `204`; `401` only when policy requires current identity; revoke server-side session | Current-session revoke, repeat logout, other session remains, audit event |
| Planned | `GET /auth/sessions` | Bearer; self | Pagination optional | `{ items: [{ id, createdAt, lastUsedAt, expiresAt, current, deviceLabel? }] }` | `200`; `401`; no token/hash/IP beyond approved privacy policy | Self-only, redaction, ordering, expired exclusion |
| Planned | `DELETE /auth/sessions/:sessionId` | Bearer; self | UUID path | `204` | Idempotent or `404` by policy; cannot delete another user's session | Ownership denial, current/other session behavior, audit |
| Planned | `POST /auth/verify-email` | Public token holder | `{ token }`; nonempty bounded opaque token | `SafeUser` or `{ verified: true }` | `200`; safe `400/401` invalid, expired, used; token single-use | Success, replay, expiry, wrong token, concurrent consume, hash not returned |
| Planned | `POST /auth/resend-verification` | Public; optional Bearer | `{ email }`; normalized valid email | Generic `{ message }` | Always safe `202`; `400` malformed; `429` rate limited; do not enumerate | Existing/nonexistent equality, cooldown, provider failure, token replacement |
| Planned | `POST /auth/forgot-password` | None | `{ email }`; normalized valid email | Generic `{ message }` | `202` for existing/nonexistent; `400`; `429`; no account disclosure | Equality, rate limit, token hash/expiry, email job, no secret logs |
| Planned | `POST /auth/reset-password` | Public valid-token holder | `{ token, password }`; password policy and confirmation handled client-side/API as decided | `{ reset: true }` | `200`; safe invalid/expired/used token; `400` password; session revocation policy applied | Success, replay, expiry, password hash, session revocation, no token/password response |

## Current user, profile, preferences, and dashboard

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /users/me/profile` | Bearer; any role | None | `SafeUser` plus approved optional profile fields only | `200`, `401` | Safe projection and self-only e2e |
| Planned | `PATCH /users/me/profile` | Bearer; self | `UpdateProfileDto`; allowlisted trimmed fields and lengths; email/role excluded | Updated safe profile | `200`; `400`; `409` conflict; `401` | Allowlist, validation, mass-assignment denial, persistence |
| Planned | `GET /users/me/preferences` | Bearer; self | None | `{ locale, timeZone, reducedMotion?, notificationPreferences, ...approved }` | `200`, `401` | Defaults and self scope |
| Planned | `PATCH /users/me/preferences` | Bearer; self | Partial allowlisted preferences with enum/time-zone validation | Updated preferences | `200`; `400`; `401` | Partial update, invalid enum, no extra fields |
| Planned | `GET /users/me/dashboard` | Bearer; Learner | None | `{ continueLearning, dueItems, recentResults, certificateSignals, unreadNotifications }` safe summaries | `200`; `401/403`; partial dependencies must not leak | New learner empty state, ownership, deterministic next action, query bounds |

## Public courses and learning access

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /courses` | None | Query `{ q?, category?, level?, cursor?, limit? }`; bounded strings; limit capped | `Page<PublishedCourseSummary>` | `200`; `400` query; only published/public fields | Filters, search, ordering, pagination, no drafts/private fields |
| Planned | `GET /courses/:slug` | None | Normalized bounded slug | `PublishedCourseDetail` with curriculum outline and optional current-user enrollment state | `200`; `404` missing/unpublished | Published version, slug, draft denial, enrollment projection |
| Planned | `POST /courses/:courseId/enrollments` | Bearer; Learner | UUID path; optional approved enrollment source | `EnrollmentSummary` | `201`; idempotent existing result or `409` per decision; `403` ineligible; `404` unavailable | Duplicate/concurrent enrollment, eligibility, audit, no cross-user assignment |
| Planned | `GET /users/me/enrollments` | Bearer; Learner | Query status/cursor/limit enums and caps | `Page<EnrollmentSummary>` | `200`; `400`; `401/403` | Status filters, ownership, empty, pagination |
| Planned | `GET /users/me/enrollments/:enrollmentId/course` | Bearer; enrollment owner | UUID path | Authorized `CoursePlayerOutline` pinned to enrollment course version | `200`; `401`; concealed `404` for non-owner/inaccessible | Ownership, version pin, unpublished edits isolated |
| Planned | `GET /users/me/enrollments/:enrollmentId/progress` | Bearer; enrollment owner | UUID path | `CourseProgressResponse` with aggregate and lesson states | `200`; `401/404` | Calculation, ownership, zero-state, completed state |
| Planned | `GET /lessons/:lessonId` | Bearer; authorized enrollment or authorized management role | UUID path | Sanitized `LessonContentResponse`; management draft access explicitly marked | `200`; `401/403/404` | Published access, prerequisite policy, draft denial, sanitization |
| Planned | `PUT /users/me/lesson-progress/:lessonId` | Bearer; Learner with access | `{ status: 'IN_PROGRESS'\|'COMPLETED', position? }`; bounded position and valid transition | `LessonProgressResponse` | `200`; `400`; `401/403/404`; `409` invalid transition | Idempotency, ownership, prerequisite, concurrent update, aggregate recalculation |

## Course authoring and lifecycle

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /management/courses` | Bearer; Instructor assigned scope, Admin all | Filters `{ status?, ownerId?, q?, cursor?, limit? }` | `Page<ManagementCourseSummary>` | `200`; `400`; `401/403` | Assignment scope, admin scope, filters, no leakage |
| Planned | `POST /management/courses` | Bearer; Instructor/Admin per policy | `CreateCourseDto`; title/slug/outcome/visibility allowlist | Draft `ManagementCourseDetail` | `201`; `400`; `403`; `409` slug | Creation ownership, duplicate slug, mass assignment, audit |
| Planned | `GET /management/courses/:courseId` | Bearer; assigned Instructor/Admin | UUID path | Draft-capable `ManagementCourseDetail` with version | `200`; concealed `404` out of scope | Scope, draft data, version |
| Planned | `PATCH /management/courses/:courseId` | Bearer; assigned Instructor/Admin | `UpdateCourseDto` plus expected version; allowlisted fields | Updated detail/version | `200`; `400`; `403/404`; `409` stale version/slug | Optimistic concurrency, validation, audit, no status bypass |
| Planned | `POST /management/courses/:courseId/publish` | Bearer; assigned Instructor/Admin with publish permission | `{ expectedVersion }` | Published course/version summary | `200`; `400` readiness; `403/404`; `409` stale/already changed | Curriculum validation, atomic publish/version, permissions, audit |
| Planned | `POST /management/courses/:courseId/archive` | Bearer; permitted Instructor/Admin | `{ expectedVersion, reason? }`; bounded reason | Archived summary | `200`; `403/404`; `409`; preserve enrolled access policy | Confirmation/use-case, active enrollments, audit, idempotency |
| Planned | `POST /management/courses/:courseId/modules` | Bearer; assigned Instructor/Admin | `CreateModuleDto { title, description?, position? }`; lengths/order | `ModuleDetail` | `201`; `400`; `403/404`; `409` order/version | Scope, ordering, concurrent create, audit |
| Planned | `PATCH /management/modules/:moduleId` | Bearer; assigned Instructor/Admin | `UpdateModuleDto` with expected version | Updated module | `200`; `400`; concealed `404`; `409` | Scope, concurrency, validation |
| Planned | `DELETE /management/modules/:moduleId` | Bearer; assigned Instructor/Admin | Expected version/confirmation policy | `204` | `204`; `409` published/dependent content; concealed `404` | Dependency protection, idempotency decision, audit |
| Planned | `PUT /management/courses/:courseId/modules/order` | Bearer; assigned Instructor/Admin | `{ moduleIds: UUID[] , expectedVersion }`; exact set/no duplicates | Ordered module summaries/new version | `200`; `400`; `409` mismatch/stale | Transactionality, duplicates/missing IDs, concurrency |
| Planned | `POST /management/modules/:moduleId/lessons` | Bearer; assigned Instructor/Admin | `CreateLessonDto`; title/type/blocks/duration/position validation | Draft `LessonDetail` | `201`; `400`; concealed `404`; `409` | Scope, sanitization, ordering, block types |
| Planned | `PATCH /management/lessons/:lessonId` | Bearer; assigned Instructor/Admin | `UpdateLessonDto` plus expected version; allowlisted block schema | Updated lesson/version | `200`; `400`; concealed `404`; `409` | Block validation/sanitization, concurrency, audit |
| Planned | `DELETE /management/lessons/:lessonId` | Bearer; assigned Instructor/Admin | Expected version/confirmation | `204` | `204`; `409` published/progress dependency; concealed `404` | Dependency protection and audit |
| Planned | `PUT /management/modules/:moduleId/lessons/order` | Bearer; assigned Instructor/Admin | `{ lessonIds: UUID[], expectedVersion }`; exact set/no duplicates | Ordered lessons/new version | `200`; `400`; `409` | Atomic reorder, scope, concurrency |

## Enrollment administration and progress reporting

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /admin/enrollments` | Bearer; Admin; approved Instructor read scope | Filters by user/course/status/org with cursor/cap | `Page<EnrollmentAdminSummary>` | `200`; `400`; `401/403` | Role scope, filters, pagination, privacy |
| Planned | `POST /admin/enrollments` | Bearer; Admin | `{ userId, courseId, source?, organizationId? }`; UUIDs and eligibility | `EnrollmentAdminSummary` | `201`; `400`; `403`; `404`; duplicate idempotency/`409` | Duplicate/concurrency, eligibility, org consistency, audit |
| Planned | `PATCH /admin/enrollments/:enrollmentId` | Bearer; Admin | `{ status, reason?, expectedVersion }`; transition allowlist | Updated enrollment | `200`; `400`; `403/404`; `409` transition/version | State machine, progress preservation, audit |
| Planned | `GET /management/analytics` | Bearer; assigned Instructor/Admin | Date range/course filters bounded; cursor for detail | Defined aggregate response with metric metadata | `200`; `400`; `401/403` | Metric formulas, scope, empty vs zero, timezone, query bounds |

## Quizzes and attempts

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /quizzes/:quizId` | Bearer; eligible Learner or authorized management role | UUID path | Learner-safe quiz without answer keys; management projection separate by role | `200`; `401/403/404`; `409` unavailable | Answer-key non-disclosure, eligibility, version pin |
| Planned | `POST /quizzes/:quizId/attempts` | Bearer; eligible Learner | Optional idempotency key; no client score | `QuizAttempt` with question order and server timing | `201`; `400`; `403/404`; `409` attempts/timing | Limits, concurrent create, randomized order persistence, ownership |
| Planned | `PUT /quiz-attempts/:attemptId/answers` | Bearer; attempt owner | `{ answers: [{ questionId, value }] }`; exact schema/size; idempotency | Updated save metadata, never score/key before submit | `200`; `400`; `401/404`; `409` submitted/expired | Ownership, validation, retry/idempotency, no early grading leak |
| Planned | `POST /quiz-attempts/:attemptId/submit` | Bearer; attempt owner | `{ expectedVersion }` | Submission summary and result link/status | `200`; `400`; `401/404`; `409` already submitted/stale | Atomic submission, duplicate submit, timing, grading |
| Planned | `GET /quiz-attempts/:attemptId/results` | Bearer; owner or authorized reviewer | UUID path | `QuizResultResponse` obeying reveal/manual-grade policy | `200`; `401/403/404`; `202` or pending state by contract decision | Ownership, reveal policy, scoring, pending/manual state |
| Planned | `GET /management/quizzes` | Bearer; assigned Instructor/Admin | Course/status/cursor filters | `Page<ManagementQuizSummary>` | `200`; `400`; `401/403` | Scope and filters |
| Planned | `POST /management/courses/:courseId/quizzes` | Bearer; assigned Instructor/Admin | Quiz settings DTO; title, attempts, pass score, timing/reveal validation | Draft management quiz | `201`; `400`; concealed `404`; `409` | Settings validation, permission, audit |
| Planned | `PATCH /management/quizzes/:quizId` | Bearer; assigned Instructor/Admin | Settings/questions DTO with expected version | Updated draft/version | `200`; `400`; concealed `404`; `409` | Score integrity, keys retained privately, concurrency |
| Planned | `PUT /management/quizzes/:quizId/questions/order` | Bearer; assigned Instructor/Admin | Exact ordered question UUID set/version | Ordered question summaries/version | `200`; `400`; `409` | Atomicity, duplicates/missing, scope |

## Projects and submissions

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /users/me/projects` | Bearer; Learner | Status/course/cursor filters | `Page<LearnerProjectSummary>` | `200`; `400`; `401/403` | Ownership, statuses, empty, pagination |
| Planned | `GET /projects/:projectId` | Bearer; assigned Learner or authorized reviewer | UUID path | Role-safe brief/rubric/submission state | `200`; `401/403/404` | Assignment scope, published version, reviewer view |
| Planned | `GET /projects/:projectId/submission` | Bearer; assigned Learner | UUID path | Safe draft/submission/feedback for owner | `200`; `401/404`; absent draft returns defined empty response | Ownership, empty draft, feedback visibility |
| Planned | `PUT /projects/:projectId/submission` | Bearer; assigned Learner | Draft DTO with bounded text/URLs and approved uploaded file IDs; expected version | Saved draft/version | `200`; `400`; `401/403/404`; `409` locked/stale | Validation, ownership, file authorization/scanning, idempotency |
| Planned | `POST /projects/:projectId/submission/submit` | Bearer; assigned Learner | `{ expectedVersion }` | Submitted status/timestamp | `200`; `400`; `401/404`; `409` incomplete/closed/already submitted | Atomic submit, deadline, replay, audit/event |
| Planned | `GET /management/projects` | Bearer; assigned Instructor/Admin | Course/status/cursor filters | `Page<ManagementProjectSummary>` | `200`; `400`; `401/403` | Scope and pagination |
| Planned | `POST /management/courses/:courseId/projects` | Bearer; assigned Instructor/Admin | Project/rubric/submission-rule DTO | Draft project | `201`; `400`; concealed `404`; `409` | Rubric validation, file rules, audit |
| Planned | `PATCH /management/projects/:projectId` | Bearer; assigned Instructor/Admin | Allowlisted DTO with expected version | Updated project/version | `200`; `400`; concealed `404`; `409` | Versioning for existing submissions, scope |
| Planned | `GET /management/submissions` | Bearer; assigned Instructor/Admin | Project/course/status/reviewer/cursor filters | `Page<SubmissionReviewSummary>` | `200`; `400`; `401/403` | Assignment scope, privacy, filters |
| Planned | `GET /management/submissions/:submissionId/review` | Bearer; authorized reviewer/Admin | UUID path | Submission, authorized file links, rubric, history | `200`; concealed `404`; expired file-link regeneration | Reviewer scope, link expiry, malware state, redaction |
| Planned | `PATCH /management/submissions/:submissionId/review` | Bearer; authorized reviewer/Admin | Scores/feedback/status/expected version; rubric bounds | Updated review summary/history | `200`; `400`; concealed `404`; `409` stale/invalid transition | Scoring, concurrency, reviewer assignment, audit, learner notification event |

## Certificates

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /users/me/certificates` | Bearer; Learner | Status/cursor filters | `Page<LearnerCertificateSummary>` | `200`; `400`; `401` | Ownership, pending/revoked, pagination |
| Planned | `GET /certificates/:certificateId` | Bearer; owner or authorized Admin | UUID path | Private certificate detail and eligibility evidence allowed to role | `200`; `401/403/404` | Ownership and revoked state |
| Planned | `GET /certificates/verify/:publicId` | None | High-entropy public identifier, bounded | Minimal `{ valid, certificateId/publicId, courseTitle, issuedAt, status, learnerDisplayNamePolicy }` | `200` valid/revoked status or `404`; no email/internal IDs unless approved | Valid, revoked, guessed IDs, privacy projection, cache policy |
| Planned | `GET /admin/certificates` | Bearer; Admin | Status/course/user/cursor filters | `Page<CertificateAdminSummary>` | `200`; `400`; `401/403` | Scope, eligibility state, filters |
| Planned | `POST /admin/certificates` | Bearer; Admin | `{ userId, courseId, reason?, idempotencyKey }`; eligibility server-calculated | Issued certificate summary | `201`; `400`; `403`; `404`; `409` ineligible/duplicate | Eligibility, duplicate/concurrent issue, audit, notification |
| Planned | `POST /admin/certificates/:certificateId/revoke` | Bearer; Admin | `{ reason }`; required bounded reason | Revoked certificate summary | `200`; `400`; `403/404`; idempotent repeat | Public verification update, audit, repeat, protected history |

## Notifications, audit, and settings

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /notifications` | Bearer; self | Read/status/type/cursor filters | `Page<NotificationResponse>` with safe action targets | `200`; `400`; `401` | Ownership, pagination, redacted payloads |
| Planned | `POST /notifications/:notificationId/read` | Bearer; owner | UUID path | Updated read state or `204` | `200/204`; concealed `404`; idempotent | Ownership and repeat |
| Planned | `POST /notifications/read-all` | Bearer; self | Optional bounded type filter | `{ updatedCount }` | `200`; `400`; `401` | Self scope, idempotency, count |
| Planned | `GET /admin/audit-logs` | Bearer; Admin with audit permission | Actor/action/resource/date/cursor filters; bounded range | `Page<AuditEventResponse>` with redacted metadata | `200`; `400`; `401/403` | Permission, immutability, redaction, pagination |
| Planned | `GET /admin/settings` | Bearer; Admin | None | Allowlisted non-secret settings with versions/default source | `200`; `401/403`; never return env/provider secrets | Allowlist, defaults, no secrets |
| Planned | `PATCH /admin/settings` | Bearer; Admin | Allowlisted typed changes plus expected version | Updated settings/version | `200`; `400`; `401/403`; `409` stale/protected | Mass-assignment denial, version, audit, rollback value |

## Organizations

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `GET /organizations/:organizationId/dashboard` | Bearer; Organization Admin member, authorized Admin | UUID path | Organization-scoped summary metrics and actions | `200`; concealed `404` out of tenant; `401` | Tenant isolation, archived org, metric definitions |
| Planned | `GET /organizations/:organizationId/members` | Bearer; Organization Admin/Admin | Status/role/q/cursor filters | `Page<OrganizationMemberResponse>` | `200`; `400`; concealed `404` | Cross-tenant denial, privacy projection, pagination |
| Planned | `POST /organizations/:organizationId/invitations` | Bearer; Organization Admin/Admin | `{ email, organizationRole }`; normalized email, allowed org role | Generic invitation summary without token | `202`; `400`; concealed `404`; `409` active member; `429` | Tenant scope, duplicate/cooldown, token hash, email job, last-admin rules |
| Planned | `PATCH /organizations/:organizationId/members/:memberId` | Bearer; Organization Admin/Admin | `{ role?, status?, expectedVersion }`; transition policy | Updated member summary | `200`; `400`; concealed `404`; `409` last admin/stale | Tenant scope, role escalation denial, last admin, audit |
| Planned | `DELETE /organizations/:organizationId/members/:memberId` | Bearer; Organization Admin/Admin | Confirmation/reason policy | `204` | `204`; concealed `404`; `409` last admin/active dependencies | Cross-tenant, self/last admin, history, audit |
| Planned | `GET /organizations/:organizationId/cohorts` | Bearer; Organization Admin/Admin | Status/q/cursor filters | `Page<CohortResponse>` | `200`; `400`; concealed `404` | Tenant isolation and pagination |
| Planned | `POST /organizations/:organizationId/cohorts` | Bearer; Organization Admin/Admin | `{ name, description?, memberIds? }`; lengths, unique name, same-org members | Created cohort | `201`; `400`; concealed `404`; `409` name/member conflict | Transaction, cross-tenant member denial, audit |
| Planned | `PATCH /organizations/:organizationId/cohorts/:cohortId` | Bearer; Organization Admin/Admin | Allowlisted fields/member set/expected version | Updated cohort/version | `200`; `400`; concealed `404`; `409` | Tenant scope, exact member set, concurrency |
| Planned | `GET /organizations/:organizationId/assignments` | Bearer; Organization Admin/Admin | Course/cohort/status/cursor filters | `Page<OrganizationAssignmentResponse>` | `200`; `400`; concealed `404` | Tenant scope and filters |
| Planned | `POST /organizations/:organizationId/assignments` | Bearer; Organization Admin/Admin | `{ courseId, memberIds?, cohortIds?, startsAt?, dueAt?, idempotencyKey }`; targets required and same org | Assignment summary with affected counts | `201`; `400`; concealed `404`; `409` conflicts | Idempotency, target expansion, eligibility, cross-tenant denial, audit |
| Planned | `PATCH /organizations/:organizationId/assignments/:assignmentId` | Bearer; Organization Admin/Admin | Status/dates/expected version; valid transitions | Updated assignment | `200`; `400`; concealed `404`; `409` | Transition, enrollment effects, tenant scope, audit |
| Planned | `GET /organizations/:organizationId/reports/progress` | Bearer; Organization Admin/Admin | Cohort/course/member/date/cursor filters; bounded range | Privacy-filtered aggregate/detail report with metric definitions | `200`; `400`; concealed `404` | Tenant isolation, small-cohort policy, time zones, empty vs zero, performance |

## AI mentor and ingestion

| Status | Method and path | Authentication / roles | Request DTO and validation | Safe response | Status codes and error behavior | Required tests |
|---|---|---|---|---|---|---|
| Planned | `POST /ai/mentor/messages` | Bearer; authorized Learner; management roles only in approved preview mode | `{ conversationId?, courseId, lessonId?, message }`; UUIDs, bounded text, course access, rate/cost quota | `{ conversationId, messageId, answer, sources: [{ lessonId, chunkId, title }], grounded, usageClass? }`; streaming transport decided later | `200`; `400`; `401/403/404`; `422` no grounding; `429`; `503` provider; never expose prompt/provider internals | Authorization, retrieval filters, citations, prompt injection, no-grounding, provider failure, quota, data leakage, eval set |
| Planned | `GET /ai/mentor/conversations/:conversationId` | Bearer; conversation owner | UUID path, cursor for messages | Safe conversation/messages/sources; retention status | `200`; concealed `404`; `401` | Ownership, redaction, pagination, deleted content references |
| Planned | `GET /ai/ingestion/jobs` | Bearer; Admin; assigned Instructor scope | Course/status/cursor filters | `Page<IngestionJobResponse>` with redacted error/category/counts | `200`; `400`; `401/403` | Scope, redaction, statuses, pagination |
| Planned | `POST /ai/ingestion/courses/:courseId` | Bearer; Admin/assigned Instructor | `{ courseVersionId, force?: false }`; published version, idempotency key/checksum | `202 { jobId, status }` | `202`; `400`; concealed `404`; `409` duplicate/version; `503` provider config | Scope, published-only, idempotency, checksum, job enqueue, audit |
| Planned | `POST /ai/ingestion/jobs/:jobId/retry` | Bearer; Admin/assigned Instructor | Optional approved retry reason | `202 { jobId, status }` | `202`; `400`; concealed `404`; `409` non-retryable/running | Scope, idempotency, max attempts, redaction |
| Planned | `POST /ai/ingestion/jobs/:jobId/cancel` | Bearer; Admin/assigned Instructor | None | Accepted/current job status | `202/200`; concealed `404`; `409` terminal | Scope, cancellation race, partial vector cleanup/forward-fix |

## API change control

Any implementation milestone must:

1. Mark implemented rows and update DTO/response details if the approved implementation differs.
2. Keep frontend types generated or hand-maintained from the same explicit contracts until an API schema strategy is approved.
3. Add unit and e2e tests listed in the row, including role/tenant denial and safe-response assertions.
4. Add migrations only in the milestone that owns the data capability.
5. Record breaking changes and compatibility decisions in `DECISIONS.md`.
