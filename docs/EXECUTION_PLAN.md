# LearnXai Sequential Execution Plan

This plan begins after the completed registration, build-baseline, login/JWT, and documentation-framework milestones. Future milestones are numbered `F01`–`F20` and must run in order unless `DECISIONS.md` records an approved replan.

## Completed foundation

- Registration: `871830e73788e68f92c4b4a2a5c58a4837e7b4fb`.
- Reproducible build baseline: `990c8053078824245ed5bc677cce15df5fc7bfaf`.
- Login and JWT access authentication: `6884c1d823565f8345a340870b8b9316ab0ec9a8`.
- Permanent product/execution framework: Milestone 4A, represented by this documentation commit.

## Standard milestone rules

All milestones must read `AGENTS.md`, update `BUILD_PROGRESS.md`, keep contracts synchronized, run non-mutating quality checks, use isolated test data, and commit separately. “Browser tests: not applicable” is valid only when no user-visible browser flow changes; the milestone must still state the reason and run relevant HTTP/e2e checks. Production deploy, paid services, credentials, destructive data changes, major upgrades, DNS, and legal/privacy choices require approval.

## F01 — Refresh-token rotation, logout, and current-user hardening

- **Objective:** Establish durable revocable sessions while preserving short-lived access JWT behavior.
- **Dependencies:** Completed login/JWT milestone and decisions on refresh-token transport, session limits, reuse response, and session metadata privacy.
- **Scope:** Opaque refresh credentials, hashed rotating sessions/token families, reuse detection, `/auth/refresh`, `/auth/logout`, session listing/revocation, `/auth/me` authorization hardening, audit hooks/tests. No frontend integration.
- **Files/modules involved:** Backend `auth`, `users`, `common`, `config`, Prisma schema/migration, `.env.example`, auth tests/e2e; API/database/security/progress docs.
- **Acceptance criteria:** Plaintext refresh tokens never persist/log; rotation invalidates predecessor; replay revokes configured family; logout is idempotent; deleted/disabled user and changed authorization state fail safely; existing registration/login/health remain compatible.
- **Verification commands:** Backend `npm run prisma:generate`, `npm run prisma:validate`, `npm run lint`, `npm run build`, `npm test -- --runInBand --no-cache`, `npm run test:e2e -- --runInBand --no-cache`, production-start/HTTP auth smoke, repository `git diff --check`.
- **Tests:** Unit—rotation, hash, expiry, reuse, revoke, safe mapper; e2e—login→refresh→old replay, logout, session isolation, `/auth/me`; browser—not applicable because no frontend changes, verified by HTTP e2e.
- **Migration strategy:** Add refresh-session/family table and indexes additively; test clean and upgrade migration on disposable PostgreSQL; no user-table destructive change.
- **Rollback/forward-fix:** Disable refresh issuance through safe config only if designed; retain access-token login; forward-fix session records/migration rather than editing applied SQL; revoke test sessions.
- **Approval gates:** Refresh transport (web cookie vs client-managed credential), session/device privacy, all-session revocation policy; pause for material new auth dependency.
- **Required commit message:** `feat: add refresh token rotation and session revocation`.

## F02 — Email verification and password reset

- **Objective:** Verify email ownership and provide secure account recovery.
- **Dependencies:** F01 session revocation policy; approved token expiry/rate limits; email-provider/local-test strategy.
- **Scope:** Verification/resend, forgot/reset endpoints, hashed single-use tokens, email templates/provider abstraction, enumeration-safe behavior, reset-session revocation, tests. No frontend connection beyond existing contracts.
- **Files/modules involved:** Backend `auth`, new email/notifications boundary as minimal, `users`, `config`, Prisma migration, `.env.example`, tests and auth/security/deployment docs.
- **Acceptance criteria:** Tokens random/hashed/expiring/single-use; resend and forgot responses do not enumerate; reset enforces password policy and revokes sessions per decision; email jobs/templates contain safe links; provider failures do not expose internals.
- **Verification commands:** Prisma generate/validate and migration test; backend lint/build/unit/e2e; local email adapter tests; HTTP verification/recovery smoke; `git diff --check`.
- **Tests:** Unit—token hashing/expiry/replay/rate decisions/templates; e2e—verify success/replay, resend equality, forgot equality, reset/replay/session revocation; browser—not applicable yet, endpoint flows tested by HTTP e2e.
- **Migration strategy:** Add verification/reset-token tables and optional account timestamps/status additively; cleanup indexes; inspect migration and test concurrent token consume.
- **Rollback/forward-fix:** Stop enqueueing email through config, expire/revoke outstanding test tokens, forward-fix token state; do not roll back consumed password changes.
- **Approval gates:** Credentials, paid email service, sender identity/domain/DNS, template/legal copy, email retention/rate policy.
- **Required commit message:** `feat: add email verification and password recovery`.

## F03 — Frontend authentication integration

- **Objective:** Replace demo/mock auth with backend registration, login, refresh/session restore, verification, recovery, and logout.
- **Dependencies:** F01–F02 stable contracts; approved secure credential transport/storage for web and native.
- **Scope:** One API client/auth service, typed contracts, session provider/state, secure storage, auth forms/error mapping, verify/reset routes, restore/logout behavior. No dashboard product data.
- **Files/modules involved:** `app/` auth routes, `src/features/auth`, `src/services/api`, `src/config`, platform storage adapter, frontend tests; backend only if a genuine contract defect is found and explained.
- **Acceptance criteria:** Demo flags removed; duplicate auth clients consolidated; passwords/tokens never logged; refresh race is single-flight; session restore and logout work on web/native; all public auth states accessible/responsive; backend contracts unchanged or explicitly documented.
- **Verification commands:** Root `npm run typecheck`, `npm run lint`, new frontend test/browser commands; backend auth regression lint/build/unit/e2e; platform web export/start smoke as approved; `git diff --check`.
- **Tests:** Unit/component—client errors, state reducer/provider, storage adapter, forms; e2e—backend regressions; browser—register/login/restore/logout, wrong credentials, verify/forgot/reset, protected redirect on responsive widths.
- **Migration strategy:** None.
- **Rollback/forward-fix:** Feature flag only if designed without insecure bypass; forward-fix client session bugs; clear only disposable test credentials.
- **Approval gates:** Secure-storage/cookie decision, minimal frontend test/browser dependencies, cross-origin/CORS configuration.
- **Required commit message:** `feat: integrate frontend authentication flows`.

## F04 — Authenticated application shell and dashboards

- **Objective:** Establish role-aware authenticated navigation and truthful empty dashboards.
- **Dependencies:** F03 session integration and role routing.
- **Scope:** Authenticated route groups/layouts, protected route bootstrap, learner/management/organization dashboard shells, navigation, profile menu, loading/empty/error patterns; only minimal dashboard API needed for safe current state.
- **Files/modules involved:** Expo routes/layouts, shared navigation/layout/state, backend dashboard projection if approved, tests and screen/API docs.
- **Acceptance criteria:** Unauthenticated users cannot see private content; role routes deny/redirect correctly; shell works web/native; empty dashboards contain no invented metrics; keyboard/screen-reader/responsive behavior passes.
- **Verification commands:** Frontend typecheck/lint/unit/browser; backend lint/build/unit/e2e if API changes; web/native smoke; `git diff --check`.
- **Tests:** Unit/component—route guards/navigation/empty states; e2e—dashboard projection scope; browser—login→role landing, direct protected URL, logout, compact navigation.
- **Migration strategy:** None unless approved preferences fields are included; any such migration is additive and separately reviewed.
- **Rollback/forward-fix:** Route-shell changes are forward-fixed; keep public auth routes usable; no data rollback.
- **Approval gates:** Final route map/navigation labels and multi-role landing behavior.
- **Required commit message:** `feat: add authenticated application shell and dashboards`.

## F05 — Course database and APIs

- **Objective:** Create stable course/curriculum persistence and public/management API foundations.
- **Dependencies:** F04 authorization shell; approved publication/version model, lesson block types, ownership permissions.
- **Scope:** Course/version/module/lesson/resource schema, draft/publish/archive lifecycle, public catalogue/detail APIs, management CRUD/reorder, sanitization and tests. No complete catalogue/authoring UI.
- **Files/modules involved:** New backend `courses`/`curriculum` modules, Prisma migration, authorization policies, response mappers, tests, API/database docs.
- **Acceptance criteria:** Drafts never leak publicly; published versions are stable; reorder is atomic; management scope enforced; all responses safe/paginated; migration works clean and from current schema.
- **Verification commands:** Prisma format only if approved, generate/validate, migration create/inspect/test on disposable DB, backend lint/build/unit/e2e, query/index checks, HTTP catalogue smoke, `git diff --check`.
- **Tests:** Unit—state transitions, versioning, validation, reorder; e2e—public vs draft, instructor scope, pagination, conflicts; browser—not applicable because no course UI changes, API smoke used.
- **Migration strategy:** Add course/version/curriculum/resource tables, constraints and essential indexes; no destructive user change; snapshot/seed content is test-only unless separately approved.
- **Rollback/forward-fix:** Keep new tables unused behind routes if needed; forward-fix migration/constraints; never drop populated course history automatically.
- **Approval gates:** Publication versioning, content block schema, media/object-storage provider/credentials if files are included.
- **Required commit message:** `feat: add course and curriculum APIs`.

## F06 — Course catalogue and details

- **Objective:** Replace preview catalogue with real published-course discovery and detail screens.
- **Dependencies:** F05 public APIs.
- **Scope:** `/courses` consolidation, search/filter/pagination, course details route, metadata, enrollment CTA state, loading/empty/error/responsive/accessibility.
- **Files/modules involved:** Expo routes, marketing/course feature modules, API types/client, UI tests; backend only for verified contract defects.
- **Acceptance criteria:** Only published data; URL/deep-link filters; no duplicate catalogue implementation; factual copy; detail 404/unpublished behavior; responsive/browser/native checks.
- **Verification commands:** Frontend typecheck/lint/unit/browser, backend regression suite, web export/smoke, `git diff --check`.
- **Tests:** Unit/component—filters/cards/states; e2e—catalogue/detail API; browser—search/filter/pagination/detail/404 at desktop/mobile widths.
- **Migration strategy:** None; test fixtures are isolated and not production seeds.
- **Rollback/forward-fix:** Preserve API; forward-fix UI; optionally route to honest unavailable state, not stale mock claims.
- **Approval gates:** Course taxonomy/filter choices and public metadata/SEO policy.
- **Required commit message:** `feat: connect course catalogue and details`.

## F07 — Course authoring

- **Objective:** Deliver secure instructor/admin course, module, and lesson authoring.
- **Dependencies:** F05 management APIs and F06 learner renderer expectations.
- **Scope:** Course management/editor, curriculum tree, lesson block editor, preview, reorder, publish validation, optimistic concurrency.
- **Files/modules involved:** Management Expo routes/features, backend management API refinements, shared lesson renderer, tests/docs.
- **Acceptance criteria:** Assigned instructors cannot access others' drafts; keyboard-accessible reorder; unsaved/stale changes handled; preview matches learner renderer; publication validation and audit events pass.
- **Verification commands:** Frontend typecheck/lint/unit/browser; backend lint/build/unit/e2e; authorization matrix; web/native authoring smoke; `git diff --check`.
- **Tests:** Unit/component—editors/reorder/conflict; e2e—scope, CRUD, publish; browser—create course→module→lesson→preview→publish validation, compact fallback.
- **Migration strategy:** Additive refinements only; content-format changes require version/backfill strategy and fixture migration tests.
- **Rollback/forward-fix:** Do not delete drafts; forward-fix editor/API; temporarily disable publish while preserving edit/read.
- **Approval gates:** Rich-text/block editor dependency, media/storage service, instructor publish permission.
- **Required commit message:** `feat: add course authoring workflows`.

## F08 — Enrollment and progress

- **Objective:** Add learner enrollment, organization-ready assignment linkage, and durable lesson/course progress.
- **Dependencies:** F05 course versions; F03 identity; enrollment eligibility/source decisions.
- **Scope:** Enrollment/progress schema and APIs, self-enroll/admin assignment basics, lifecycle, idempotent lesson progress, dashboard/My Learning data.
- **Files/modules involved:** Backend `enrollments`/`progress`, Prisma migration, learner dashboard/My Learning frontend, tests/docs.
- **Acceptance criteria:** Duplicate enrollment is idempotent; enrollment pins correct course version; progress is owner-scoped/idempotent and aggregate-correct; revoked/archived policies enforced; truthful empty states.
- **Verification commands:** Prisma generate/validate/migration tests; backend lint/build/unit/e2e; frontend typecheck/lint/unit/browser; HTTP progress concurrency smoke; `git diff --check`.
- **Tests:** Unit—state transitions/calculation; e2e—ownership, duplicate/concurrent enroll, version pin, progress; browser—enroll→My Learning→resume and empty states.
- **Migration strategy:** Add enrollments and lesson-progress tables/indexes; optional backfill none unless approved data exists; test unique/idempotency constraints.
- **Rollback/forward-fix:** Preserve enrollment/history; disable writes if needed; forward-fix calculations and rebuild derived aggregates.
- **Approval gates:** Enrollment eligibility, archive/revoke effects, organization-assignment compatibility.
- **Required commit message:** `feat: add enrollment and learning progress`.

## F09 — Course player

- **Objective:** Deliver authorized resumable course and lesson consumption on web/native.
- **Dependencies:** F05 content and F08 enrollment/progress.
- **Scope:** Course-player route/layout, module drawer, lesson renderer, completion/resume, resources/media accessibility, next/previous; no quizzes/projects beyond links.
- **Files/modules involved:** Learner Expo routes/features, shared content renderer, progress API integration, tests/docs.
- **Acceptance criteria:** Enrollment/draft/prerequisite access enforced; resume deterministic; completion idempotent; supported blocks sanitized; media transcript/alt behavior; responsive drawer and keyboard navigation.
- **Verification commands:** Frontend typecheck/lint/unit/browser, backend regressions/e2e, web/native player smoke, accessibility checks, `git diff --check`.
- **Tests:** Unit/component—block rendering/navigation/progress states; e2e—lesson access/progress; browser—resume, next/previous, unauthorized URL, mobile drawer, keyboard flow.
- **Migration strategy:** None unless measured resume metadata is added; then additive with default/backfill tests.
- **Rollback/forward-fix:** Forward-fix renderer; unsupported blocks display safe fallback; never mutate historical content to roll back UI.
- **Approval gates:** Supported media/content formats and offline/download policy.
- **Required commit message:** `feat: add learner course player`.

## F10 — Quizzes

- **Objective:** Implement quiz authoring, attempts, grading, results, and learner/management screens.
- **Dependencies:** F05/F07 course versions/authoring, F08 access/progress, F09 player integration.
- **Scope:** Quiz/question/option/attempt/answer schema; management UI/API; learner attempt/results; timing/attempt/reveal/pass rules.
- **Files/modules involved:** Backend `quizzes`, Prisma migration, management and learner Expo features, certificate/progress event hooks, tests/docs.
- **Acceptance criteria:** Keys never leak; attempts/timers/limits server-enforced; answer saves retry safely; submit atomic/idempotent; results obey reveal policy; authored versions remain stable.
- **Verification commands:** Prisma/migration checks; backend lint/build/unit/e2e; frontend typecheck/lint/unit/browser; timing/concurrency smoke; `git diff --check`.
- **Tests:** Unit—scoring/state/reveal; e2e—attempt limits, ownership, key redaction, submit/replay; browser—author quiz, take/save/submit/view results at responsive widths.
- **Migration strategy:** Add quiz/version/question/option/attempt/answer tables and indexes; avoid enum lock-in without stable states; test published-version history.
- **Rollback/forward-fix:** Disable new attempts while retaining result access; forward-fix grading and provide auditable recalculation strategy.
- **Approval gates:** Question types, grading/reveal/retake policy, accommodations/timing policy.
- **Required commit message:** `feat: add quizzes and attempt grading`.

## F11 — Projects and submissions

- **Objective:** Add project/rubric authoring, learner drafts/submission, and review data foundation.
- **Dependencies:** F07 authoring, F08 enrollment, approved file storage/security policy.
- **Scope:** Project/version/rubric/submission/file/review schema and APIs; learner projects/submission UI; minimal management authoring and review-ready state.
- **Files/modules involved:** Backend `projects`, Prisma migration, storage adapter, learner/management features, tests/docs.
- **Acceptance criteria:** Ownership/version/deadline enforced; drafts idempotent; files authorized/scanned by policy; submission atomic; rubric version preserved; safe statuses/feedback.
- **Verification commands:** Prisma/migration checks; backend/frontend quality suites; storage-adapter tests; e2e/browser submission flow; upload security checks; `git diff --check`.
- **Tests:** Unit—state/rubric/file rules; e2e—ownership, draft/submit/replay, unauthorized file, deadline; browser—project list→draft→upload/link→submit and error recovery.
- **Migration strategy:** Add project/version/rubric/submission/review/file metadata tables; object bytes remain outside DB; no production storage operation without approval.
- **Rollback/forward-fix:** Preserve drafts/submissions; disable uploads/submission writes if provider fails; forward-fix metadata and reprocess scans.
- **Approval gates:** Object-storage credentials/cost, file types/sizes, malware scanning, retention and intellectual-property/privacy policy.
- **Required commit message:** `feat: add projects and learner submissions`.

## F12 — Certificates

- **Objective:** Compute eligibility and issue/view/verify/revoke course certificates.
- **Dependencies:** F08 progress, F10 quizzes, F11 projects, approved certificate policy/design.
- **Scope:** Rules/certificate schema, eligibility service, learner/admin/public APIs and screens, rendering/storage abstraction if approved.
- **Files/modules involved:** Backend `certificates`, Prisma migration, learner/admin/public Expo routes, job/storage hooks, tests/docs.
- **Acceptance criteria:** Eligibility server-derived/versioned; duplicate issue prevented; public ID unguessable; verification minimizes PII; revocation immediate/audited; no placement claims.
- **Verification commands:** Prisma/migration checks; backend/frontend suites; eligibility/e2e/browser verification; artifact security checks if rendering; `git diff --check`.
- **Tests:** Unit—eligibility/rules; e2e—issue/concurrency/revoke/privacy; browser—learner list, public verify valid/revoked, admin action.
- **Migration strategy:** Add rules/certificates with unique active issuance/public ID constraints; snapshot evidence; no backfill without policy.
- **Rollback/forward-fix:** Stop issuance while preserving verification; forward-fix/reissue through audited process; never silently delete issued records.
- **Approval gates:** Certificate wording/branding/signature, learner display-name privacy, artifact provider, legal meaning.
- **Required commit message:** `feat: add certificate eligibility and verification`.

## F13 — Instructor and admin workflows

- **Objective:** Complete submission review, user/enrollment/certificate management, analytics, AI-status placeholder, and settings workflows.
- **Dependencies:** F07, F08, F11, F12; authorization/permission decisions.
- **Scope:** Management dashboard refinements, review queue, admin user/enrollment/certificate screens, analytics definitions, audit-visible settings; AI status shows unavailable until F15.
- **Files/modules involved:** Management/admin frontend, backend management/analytics/settings/audit policies, tests/docs.
- **Acceptance criteria:** Instructor assignment and admin permissions enforced; high-risk actions confirmed/audited; analytics definitions truthful; mass assignment denied; mobile alternatives usable.
- **Verification commands:** Full backend/frontend suites, authorization matrix, browser role workflows, accessibility and export/privacy checks where applicable, `git diff --check`.
- **Tests:** Unit—permissions/transitions/metric definitions; e2e—cross-role denial and actions; browser—Instructor review and Admin user/enrollment/certificate/settings flows.
- **Migration strategy:** Additive account-status/settings/audit support only if required; each change reviewed with backfill/default strategy.
- **Rollback/forward-fix:** Disable individual high-risk actions, preserve read/history, forward-fix; never erase audit evidence.
- **Approval gates:** Admin permission model, suspension/deletion policy, analytics/privacy thresholds, mutable application settings allowlist.
- **Required commit message:** `feat: complete instructor and admin workflows`.

## F14 — Organizations and reporting

- **Objective:** Add tenant-scoped organizations, memberships, cohorts, assignments, and progress reporting.
- **Dependencies:** F08 enrollments, F13 authorization/audit; approved multi-role/membership and tenant-isolation strategy.
- **Scope:** Organization schema/APIs, Organization Admin authorization, all required organization screens, course assignment effects, privacy-aware reports.
- **Files/modules involved:** Backend `organizations`/reporting, Prisma migration, organization Expo routes/features, authorization/audit tests/docs.
- **Acceptance criteria:** Cross-tenant access denied for every resource; last-admin/member transitions safe; assignment idempotent; cohort integrity; report metrics/privacy defined; global role escalation impossible.
- **Verification commands:** Prisma/migration checks; backend/frontend suites; exhaustive tenant authorization e2e; browser org workflows; query/performance checks; `git diff --check`.
- **Tests:** Unit—membership/assignment states; e2e—cross-tenant matrix, last admin, cohorts, assignments/reports; browser—dashboard→members→cohorts→assignments→report.
- **Migration strategy:** Add organizations/memberships/invitations/cohorts/assignments joins; migrate `ORG_ADMIN` semantics only through approved backfill; consider RLS separately.
- **Rollback/forward-fix:** Disable organization writes/report export, preserve tenant records/enrollments, forward-fix; no automatic tenant data deletion.
- **Approval gates:** Multi-role model, tenant/RLS decision, invitation email/domain rules, reporting privacy/export retention.
- **Required commit message:** `feat: add organizations cohorts and reporting`.

## F15 — AI mentor and grounded RAG

- **Objective:** Deliver provider-neutral, course-authorized, cited mentor answers using pgvector retrieval.
- **Dependencies:** F05/F09 content, F14 tenant scope, approved AI/privacy/cost/provider decisions, jobs capability may be minimally introduced or coordinated with F16.
- **Scope:** AI provider interface, OpenAI adapter when approved, pgvector schema, deterministic ingestion/chunking/embedding, mentor API/UI, citations, ingestion status, quotas/safety/evals.
- **Files/modules involved:** Backend `ai`, Prisma vector migration, jobs boundary, mentor/admin frontend, config, eval fixtures, tests/docs.
- **Acceptance criteria:** Retrieval filters authorized course/version/org; answers cite sources or refuse/no-grounding; prompt injection/data leakage tests pass; provider failure safe; ingestion idempotent/observable; cost/retention controls enforced.
- **Verification commands:** Prisma/vector migration tests; backend/frontend suites; AI contract tests with fake provider; approved provider staging smoke; RAG eval/security suite; browser mentor/ingestion flows; `git diff --check`.
- **Tests:** Unit—chunking/filter/provider adapter; e2e—authorization/citations/jobs/failures; browser—mentor context, citations, no-grounding, rate error; eval—groundedness/retrieval/leakage datasets.
- **Migration strategy:** Enable `vector`, add source/chunk/embedding/job/conversation/message/source tables and measured vector index; dimension/model changes use parallel columns/table versioning, not destructive overwrite.
- **Rollback/forward-fix:** Disable mentor/ingestion via approved feature control; retain core LMS; deactivate bad embedding set and reingest; do not delete source content automatically.
- **Approval gates:** Paid API, OpenAI credentials/model, data processing/legal/privacy, retention, budget/quota, vector extension availability, provider terms.
- **Required commit message:** `feat: add grounded course AI mentor`.

## F16 — Notifications and background jobs

- **Objective:** Establish reliable asynchronous work and in-app/email notification delivery.
- **Dependencies:** F02 email abstraction and domain events from F08–F15; approved queue/worker topology.
- **Scope:** Durable outbox/jobs, worker, retry/dead-letter visibility, notification inbox/preferences, email event delivery, webhook safety, job health.
- **Files/modules involved:** Backend `jobs`/`notifications`, Prisma migration, worker entrypoint, frontend inbox/settings, Docker/config, tests/docs.
- **Acceptance criteria:** Idempotent jobs; bounded retry; failures visible; duplicate events do not duplicate effects; notification ownership; preferences honored; secrets/redacted logs; readiness reflects required worker dependencies.
- **Verification commands:** Prisma/migration checks; backend/frontend suites; worker/job integration and restart tests; browser inbox/preferences; webhook/retry tests; `git diff --check`.
- **Tests:** Unit—retry/idempotency/templates/preferences; e2e—outbox→worker→notification, duplicate/restart/failure; browser—inbox/read-all/preferences; no external delivery in unapproved environments.
- **Migration strategy:** Add jobs/outbox/notifications/preferences indexes; backfill defaults additively; queue-specific persistence remains replaceable.
- **Rollback/forward-fix:** Pause workers, retain queued intent, fix/replay idempotently; keep synchronous core transactions intact.
- **Approval gates:** Queue/provider choice and costs, worker hosting, email credentials, webhook endpoints, retention.
- **Required commit message:** `feat: add notifications and background jobs`.

## F17 — Docker and CI/CD

- **Objective:** Make development and verification reproducible with containers and GitHub Actions.
- **Dependencies:** Stable service/worker topology through F16.
- **Scope:** Dockerfiles, Compose services, healthchecks, non-root runtime, ignore files, CI workflows for install/generate/validate/lint/test/build/browser/security/migration/container checks; no deployment.
- **Files/modules involved:** Root/backend Docker/Compose/config, `.github/workflows`, scripts/docs; application source only for genuine health/config defects.
- **Acceptance criteria:** Clean clone boots documented local stack; images contain no secrets/dev-only artifacts; CI is deterministic/cache-safe; generated/build files untracked; PostgreSQL/pgvector and worker health verified.
- **Verification commands:** Existing frontend/backend gates; `docker compose config`, build/up/health/down on disposable volumes; CI workflow validation; image/user/secret checks; `git diff --check`.
- **Tests:** Unit/e2e—all existing suites in CI; browser—critical auth/catalogue/learning smoke in CI; container—fresh DB migration and restart persistence.
- **Migration strategy:** CI applies migrations to disposable PostgreSQL only; production migration remains runbook-gated.
- **Rollback/forward-fix:** Revert image/workflow configuration or publish corrected immutable artifact; preserve volumes unless explicitly disposable.
- **Approval gates:** Docker availability, GitHub Actions minutes/secrets, container registry choice/credentials.
- **Required commit message:** `chore: add Docker and continuous integration`.

## F18 — Staging configuration

- **Objective:** Define and verify a production-like, isolated staging environment and promotion procedure.
- **Dependencies:** F17 artifacts/CI; provider/hosting selections and credentials.
- **Scope:** Staging environment matrix, secret references, database/storage/email/AI/job configuration, migration/promotion workflow, seeded synthetic smoke data, monitoring/backups, runbook evidence. No production deploy.
- **Files/modules involved:** Environment templates, deployment manifests/IaC if approved, CI staging workflow, runbook/progress docs; minimal source config fixes only.
- **Acceptance criteria:** Staging isolated from production; secrets not in repo; migrations/backups/restore smoke; health/auth/critical LMS/browser flows pass; external email/AI constrained; rollback/forward-fix rehearsed.
- **Verification commands:** Full CI; deployment manifest validation; staging migration, health/readiness, HTTP/browser smoke, backup/restore and observability checks; `git diff --check`.
- **Tests:** Unit/e2e—artifact already passed; browser—critical role flows in staging; operational—restart, dependency failure, restore and rollback rehearsal.
- **Migration strategy:** Apply reviewed migrations to staging after backup; record duration/locks; no production apply.
- **Rollback/forward-fix:** Roll back application artifact if schema-compatible; otherwise forward-fix; restore only rehearsed isolated scenario.
- **Approval gates:** Cloud spend, credentials, hosting/database/storage/email/AI/monitoring providers, domain/subdomain/DNS, data policy.
- **Required commit message:** `chore: configure LearnXai staging environment`.

## F19 — Security, accessibility, and production hardening

- **Objective:** Close verified security, privacy, accessibility, reliability, and performance gaps before readiness review.
- **Dependencies:** F18 staging and complete feature surface.
- **Scope:** Threat model, RBAC/tenant matrix, headers/CORS/rate limiting, dependency/secret/container scans, logging/redaction, file/AI abuse, accessibility audit, performance/load/resilience, retention controls, remediation.
- **Files/modules involved:** Entire application/config/test/runbook surface, but changes remain evidence-driven and individually documented.
- **Acceptance criteria:** No unresolved critical/high security findings without accepted risk; WCAG target checks pass; role/tenant denial complete; rate/abuse controls; restore/incident/runbook validated; defined performance/SLO evidence approved.
- **Verification commands:** Full CI/staging suites; SAST/dependency/secret/container scans; DAST/API authorization tests; accessibility browser/native audit; load/resilience/backup restore; `git diff --check`.
- **Tests:** Unit/e2e—new regression tests per finding; browser—complete critical journeys/accessibility; security—OWASP/auth/tenant/file/RAG abuse; operational—failure injection and recovery.
- **Migration strategy:** Security data changes use additive/expand-contract and staging rehearsal; destructive retention cleanup requires legal approval and backup.
- **Rollback/forward-fix:** Each remediation has change-specific rollback; security fixes are normally forward-fixed; accepted risks recorded with owner/expiry.
- **Approval gates:** Major dependency upgrades, penetration-test spend, legal/privacy/retention, production SLOs, residual risk acceptance.
- **Required commit message:** `chore: harden LearnXai for production readiness`.

## F20 — Final production-readiness verification

- **Objective:** Produce evidence that the approved LearnXai release is ready for an explicit production go/no-go decision.
- **Dependencies:** F19 complete; all decisions/providers/runbooks resolved for release scope.
- **Scope:** Freeze candidate, full clean build/test, migration rehearsal, staging smoke, backups/restore, monitoring/alerts, incident contacts, legal/accessibility/security evidence, release/rollback checklist. Production deployment is excluded.
- **Files/modules involved:** Documentation, release metadata/checklists, CI/staging configuration; application changes only for blockers and must be separately explained/tested.
- **Acceptance criteria:** All release gates documented with evidence; zero unknown schema drift; immutable artifact identified; rollback/forward-fix and restore verified; unresolved risks explicitly accepted; production approval still pending.
- **Verification commands:** Clean installs; all frontend/backend/Prisma/unit/e2e/browser/security/accessibility/container checks; staging migration/health/critical flows; backup/restore; `git diff --check`; clean Git status.
- **Tests:** Unit/e2e—complete suites; browser—all critical role journeys; operational/security—release checklist, dependency failure, rollback rehearsal, monitoring alert verification.
- **Migration strategy:** Rehearse exact production migration against representative staging copy; record duration/locks/compatibility; do not apply production without approval.
- **Rollback/forward-fix:** Document artifact rollback boundary, schema compatibility, forward-fix owner, data restore conditions, communications.
- **Approval gates:** Formal production go/no-go, production credentials/cost, DNS/domain, legal/privacy, security risk acceptance, deployment window and responsible operators.
- **Required commit message:** `chore: verify LearnXai production readiness`.

## Sequence summary

1. Refresh tokens, logout, and `/auth/me` hardening.
2. Email verification and password reset.
3. Frontend authentication integration.
4. Authenticated application shell and dashboards.
5. Course database and APIs.
6. Course catalogue and details.
7. Course authoring.
8. Enrollment and progress.
9. Course player.
10. Quizzes.
11. Projects and submissions.
12. Certificates.
13. Instructor/admin workflows.
14. Organizations and reporting.
15. AI mentor and RAG.
16. Notifications and background jobs.
17. Docker and CI/CD.
18. Staging configuration.
19. Security, accessibility, and production hardening.
20. Final production-readiness verification.
