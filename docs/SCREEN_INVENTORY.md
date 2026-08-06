# LearnXai Screen Inventory

Status labels: **Implemented UI** means a route currently renders; it does not imply backend integration. **Planned** means the route and contract are approved but not built. API names refer to `API_CONTRACTS.md`.

## Global screen requirements

Every screen must use accessible labels and focus order, expose a retry path for recoverable failures, prevent unauthorized content flashes, preserve useful navigation state, and avoid fabricated social proof. Web layouts must support keyboard use and 200% zoom. Native layouts must support safe areas, text scaling, orientation where appropriate, and touch targets. Loading, empty, and error states below are part of each screen's acceptance criteria.

## Public screens

### PUB-01 Landing

- **Route/status:** `/`; Implemented UI with platform-specific web/native screens.
- **Permitted roles:** Public; authenticated users may also view it.
- **Purpose:** Explain the product factually and route visitors to courses or access flows.
- **Major components:** Public header, hero, curriculum preview, mentor/project/mobile previews, access section, FAQ, footer.
- **Required APIs:** None for static content initially; optional future public catalogue summary.
- **Loading state:** Font/asset loading uses a non-jarring branded fallback; dynamic catalogue blocks use skeletons.
- **Empty state:** Omit unavailable dynamic sections with an honest “content coming soon” message.
- **Error state:** Static page remains usable; failed dynamic blocks show a local retry without blocking navigation.
- **Responsive/mobile behavior:** Web may use richer composition; native uses React Native layout; primary actions remain visible at compact widths.
- **Acceptance criteria:** Correct platform file resolves extensionlessly; navigation works; claims are factual; keyboard, screen reader, reduced-motion, and responsive checks pass.

### PUB-02 Course catalogue

- **Route/status:** `/courses`; Implemented preview UI, real catalogue planned.
- **Permitted roles:** Public.
- **Purpose:** Discover published, publicly visible courses.
- **Major components:** Search, filters, sort, course cards, pagination/infinite loading, enrollment/access indicators.
- **Required APIs:** `GET /courses`.
- **Loading state:** Stable course-card skeletons and disabled filter submission while the request is pending.
- **Empty state:** Distinguish no published courses from no search/filter matches; provide clear reset action.
- **Error state:** Inline catalogue error with retry; preserve search/filter inputs.
- **Responsive/mobile behavior:** Single-column compact list; filter drawer/sheet on mobile; grid on wider web screens.
- **Acceptance criteria:** Only published courses appear; filters are URL/deep-link compatible on web; pagination is deterministic; no private authoring data leaks.

### PUB-03 Course details

- **Route/status:** `/courses/[courseSlug]`; Planned.
- **Permitted roles:** Public for published courses.
- **Purpose:** Explain curriculum, prerequisites, outcomes, instructor attribution, and access/enrollment status.
- **Major components:** Course hero, curriculum outline, prerequisites, outcomes, instructor block, enrollment CTA, policy notices.
- **Required APIs:** `GET /courses/:slug`; authenticated CTA may use `POST /courses/:courseId/enrollments`.
- **Loading state:** Skeleton for hero and curriculum with CTA disabled.
- **Empty state:** Published course with no optional FAQ/resources omits those blocks; a missing curriculum is a publication defect, not an empty success.
- **Error state:** 404 for missing/unpublished course; retry for transient failures; authorization-safe messaging.
- **Responsive/mobile behavior:** Curriculum becomes accordion sections; CTA remains reachable without covering content.
- **Acceptance criteria:** Published version only; enrollment state is correct; inaccessible content is not returned; metadata and deep links are valid.

### PUB-04 Registration

- **Route/status:** `/register`; Implemented demo UI, backend registration implemented, integration planned.
- **Permitted roles:** Public/unauthenticated; authenticated users redirect to their home unless explicitly switching account.
- **Purpose:** Create a learner account safely.
- **Major components:** Name, email, password, validation summary, submit action, login link, policy consent when approved.
- **Required APIs:** `POST /auth/register`.
- **Loading state:** Submit is single-flight, inputs remain readable, and progress is announced.
- **Empty state:** Initial blank form with password requirements; no fabricated endorsements.
- **Error state:** Field errors for 400, email conflict for 409, generic retry for server/network errors; never echo password.
- **Responsive/mobile behavior:** Keyboard-safe scrolling, correct input modes, password-manager support, compact single column.
- **Acceptance criteria:** Frontend rules match API; email is normalized; password never logged/persisted; successful safe user contract is handled without assuming verification.

### PUB-05 Login

- **Route/status:** `/login`; Implemented demo UI, backend login implemented, integration planned.
- **Permitted roles:** Public/unauthenticated.
- **Purpose:** Authenticate an existing user and establish a client session.
- **Major components:** Email, password, remember-session choice when refresh tokens exist, submit, forgot-password link.
- **Required APIs:** `POST /auth/login`; future `POST /auth/refresh`, `GET /auth/me`.
- **Loading state:** Single-flight submit with announced progress and no password exposure.
- **Empty state:** Initial form with no prefilled sensitive data.
- **Error state:** Generic invalid-credential message for 401; field errors for 400; retry for network/server errors.
- **Responsive/mobile behavior:** Password-manager/autofill compatible; keyboard-safe; mentor preview may hide on compact screens without losing function.
- **Acceptance criteria:** Normalization matches API; access token stays out of logs; invalid credentials do not reveal account existence; post-login role routing is deterministic.

### PUB-06 Email verification

- **Route/status:** `/verify-email`; Planned.
- **Permitted roles:** Public token holder; optional authenticated context.
- **Purpose:** Consume a single-use verification token and show verified/already-used/expired outcomes.
- **Major components:** Verification progress, success, expired/invalid state, resend action, sign-in/continue action.
- **Required APIs:** `POST /auth/verify-email`, `POST /auth/resend-verification`.
- **Loading state:** Token consumption runs once; duplicate submissions are prevented.
- **Empty state:** Missing token shows a safe invalid-link state and resend path.
- **Error state:** Invalid/expired/used token messages reveal no unnecessary account data; resend remains enumeration-safe.
- **Responsive/mobile behavior:** Deep-link compatible on web/native; clear handoff if opened on an uninstalled device.
- **Acceptance criteria:** Token is removed from visible URL/history where practical; replay fails; success updates current-user state; accessibility announcements pass.

### PUB-07 Forgot password

- **Route/status:** `/forgot-password`; Implemented UI, backend capability planned.
- **Permitted roles:** Public/unauthenticated.
- **Purpose:** Request password-reset instructions without account enumeration.
- **Major components:** Email input, submit action, generic confirmation, return-to-login link.
- **Required APIs:** `POST /auth/forgot-password`.
- **Loading state:** Single-flight request and announced progress.
- **Empty state:** Initial email form with concise privacy guidance.
- **Error state:** Valid requests always receive the same safe result; local validation and generic transient retry only.
- **Responsive/mobile behavior:** Keyboard-safe single column and email autofill.
- **Acceptance criteria:** Normalized email; identical account-exists/nonexistent response; no email or token in logs; rate-limit behavior is usable.

### PUB-08 Reset password

- **Route/status:** `/reset-password`; Planned.
- **Permitted roles:** Public valid-token holder.
- **Purpose:** Set a new password using an expiring single-use token.
- **Major components:** New password, confirmation, requirements, submit, expired-link recovery.
- **Required APIs:** `POST /auth/reset-password`.
- **Loading state:** Single-flight update; password fields never leave the form except in the request body.
- **Empty state:** Missing token produces invalid-link guidance.
- **Error state:** Field validation for 400; invalid/expired/used token handled safely; no internal details.
- **Responsive/mobile behavior:** Password-manager support, show/hide controls with accessible labels, keyboard-safe layout.
- **Acceptance criteria:** New passwords meet backend policy; token cannot replay; applicable sessions are revoked per decision; success returns to login.

## Learner screens

### LRN-01 Dashboard

- **Route/status:** `/dashboard`; Planned.
- **Permitted roles:** Learner.
- **Purpose:** Summarize active learning, next actions, recent feedback, and certificate/notification signals.
- **Major components:** Continue-learning card, course progress, due tasks, recent quiz/project results, notifications.
- **Required APIs:** `GET /users/me/dashboard`, `GET /notifications`.
- **Loading state:** Independent section skeletons; critical session check precedes private content.
- **Empty state:** New learner onboarding with catalogue CTA and no fake progress.
- **Error state:** Section-level retries; authorization failure clears session and routes safely.
- **Responsive/mobile behavior:** Priority cards stack; dense analytics reduce to summaries.
- **Acceptance criteria:** Data belongs only to current user; next action is deterministic; stale requests cannot overwrite newer state.

### LRN-02 My Learning

- **Route/status:** `/my-learning`; Planned.
- **Permitted roles:** Learner.
- **Purpose:** List enrolled, completed, and archived learning with resume actions.
- **Major components:** Status tabs/filters, enrollment cards, progress bars, resume links.
- **Required APIs:** `GET /users/me/enrollments`.
- **Loading state:** Enrollment-card skeletons.
- **Empty state:** Separate no-enrollments, no-completed-courses, and no-filter-match messages.
- **Error state:** Retry while preserving filter; invalid enrollment links fail safely.
- **Responsive/mobile behavior:** Cards stack and maintain large resume targets.
- **Acceptance criteria:** Progress values match server state; inaccessible/withdrawn content is labeled; pagination and filters are stable.

### LRN-03 Course player

- **Route/status:** `/learn/[courseSlug]`; Planned.
- **Permitted roles:** Enrolled Learner with course access.
- **Purpose:** Provide resumable navigation through the authorized published course version.
- **Major components:** Module navigation, current lesson, completion state, next/previous, mentor launcher, progress summary.
- **Required APIs:** `GET /users/me/enrollments/:enrollmentId/course`, `GET /users/me/enrollments/:enrollmentId/progress`.
- **Loading state:** Navigation and lesson-shell skeleton; no private content flash.
- **Empty state:** Course with no accessible lesson shows support guidance; this is normally a publication defect.
- **Error state:** 401/403/404 paths are distinct but do not leak unpublished content; retry transient requests.
- **Responsive/mobile behavior:** Sidebar becomes drawer; next/previous controls remain reachable; media adapts.
- **Acceptance criteria:** Access and course version are enforced; resume position is stable; keyboard and screen-reader navigation works.

### LRN-04 Lesson content

- **Route/status:** `/learn/[courseSlug]/lessons/[lessonId]`; Planned.
- **Permitted roles:** Enrolled Learner with lesson access.
- **Purpose:** Render approved lesson blocks and record progress safely.
- **Major components:** Title, content blocks, media/transcript, resources, completion action, next lesson, mentor context.
- **Required APIs:** `GET /lessons/:lessonId`, `PUT /users/me/lesson-progress/:lessonId`.
- **Loading state:** Content block skeleton; media initializes separately.
- **Empty state:** Optional resources may be empty; missing core lesson content blocks publication.
- **Error state:** Unsupported/corrupt block has a contained fallback; access and network errors are safe.
- **Responsive/mobile behavior:** Fluid media, readable measure, downloadable resources where supported, orientation-safe controls.
- **Acceptance criteria:** Sanitized content; completion is idempotent; transcripts/alt text exist where required; progress cannot skip policy-gated prerequisites.

### LRN-05 Quiz attempt

- **Route/status:** `/learn/[courseSlug]/quizzes/[quizId]`; Planned.
- **Permitted roles:** Eligible enrolled Learner.
- **Purpose:** Start/resume a permitted quiz attempt and submit answers.
- **Major components:** Instructions, attempt status, questions, navigation, save state, submit confirmation, timer when configured.
- **Required APIs:** `GET /quizzes/:quizId`, `POST /quizzes/:quizId/attempts`, `PUT /quiz-attempts/:attemptId/answers`, `POST /quiz-attempts/:attemptId/submit`.
- **Loading state:** Attempt initialization and saved answers load before editing.
- **Empty state:** Quiz with zero publishable questions is unavailable, not a valid empty attempt.
- **Error state:** Save retry is explicit; expired/used attempt locks editing; submission conflicts reconcile server state.
- **Responsive/mobile behavior:** One-question focus on compact screens; timer never obstructs; keyboard navigation supported.
- **Acceptance criteria:** Attempt limits/timing enforced server-side; answers survive safe retry; scoring keys are never exposed before policy permits.

### LRN-06 Quiz results

- **Route/status:** `/learn/[courseSlug]/quizzes/[quizId]/results/[attemptId]`; Planned.
- **Permitted roles:** Attempt owner; authorized Instructor/Admin for review through management routes.
- **Purpose:** Present score, pass state, permitted feedback, and next action.
- **Major components:** Score summary, question review, feedback, retake/continue action.
- **Required APIs:** `GET /quiz-attempts/:attemptId/results`.
- **Loading state:** Score-summary skeleton.
- **Empty state:** Pending manual grading state where applicable.
- **Error state:** Owner mismatch returns authorization-safe failure; transient retry preserves navigation.
- **Responsive/mobile behavior:** Question review stacks; charts have text equivalents.
- **Acceptance criteria:** Results obey reveal policy; score is server-derived; no other learner attempt is accessible.

### LRN-07 Projects

- **Route/status:** `/projects`; Planned.
- **Permitted roles:** Learner.
- **Purpose:** List assigned projects and submission/review status.
- **Major components:** Status filters, project cards, due/requirement summary, feedback indicators.
- **Required APIs:** `GET /users/me/projects`.
- **Loading state:** Project-card skeletons.
- **Empty state:** No assigned projects with contextual learning CTA.
- **Error state:** Retry without losing filters.
- **Responsive/mobile behavior:** Cards stack; status and due information remain text-readable.
- **Acceptance criteria:** Only authorized assignments appear; status history is accurate; pagination/filtering is deterministic.

### LRN-08 Project submission

- **Route/status:** `/projects/[projectId]/submit`; Planned.
- **Permitted roles:** Assigned Learner.
- **Purpose:** Review requirements and create/update an allowed project submission.
- **Major components:** Brief, rubric, text/link/file inputs, draft state, submit confirmation, prior feedback.
- **Required APIs:** `GET /projects/:projectId`, `GET /projects/:projectId/submission`, `PUT /projects/:projectId/submission`, `POST /projects/:projectId/submission/submit`.
- **Loading state:** Existing draft and upload capability load before editing.
- **Empty state:** New draft with requirements; no fake prior work.
- **Error state:** Upload/save retry, file rejection detail, deadline/status lock, conflict reconciliation.
- **Responsive/mobile behavior:** Native file picker and web upload are equivalent; long rubrics collapse accessibly.
- **Acceptance criteria:** File type/size scanning policy enforced; draft saves are idempotent; ownership and submission window are enforced.

### LRN-09 Certificates

- **Route/status:** `/certificates`; Planned.
- **Permitted roles:** Learner.
- **Purpose:** View earned, pending, revoked, and eligibility states.
- **Major components:** Certificate cards, eligibility checklist, download/share/verify links, revoked notice.
- **Required APIs:** `GET /users/me/certificates`, `GET /certificates/:certificateId`.
- **Loading state:** Certificate-card skeletons.
- **Empty state:** Explain eligibility and link to active learning without promising outcomes.
- **Error state:** Retry; revoked/missing certificate gets explicit safe status.
- **Responsive/mobile behavior:** Download/share uses platform capabilities; verification link remains copyable.
- **Acceptance criteria:** Eligibility is server-derived and versioned; private learner data is minimized; public verification is tamper-resistant.

### LRN-10 AI mentor

- **Route/status:** `/mentor`; Planned.
- **Permitted roles:** Learner with course/content access.
- **Purpose:** Ask grounded questions within selected authorized course/lesson context.
- **Major components:** Context selector, conversation, cited sources, suggested actions, feedback, usage/error notices.
- **Required APIs:** `POST /ai/mentor/messages`, `GET /ai/mentor/conversations/:conversationId`.
- **Loading state:** Stream/progress indicator with cancel; source retrieval state is distinguishable.
- **Empty state:** Explain supported course-grounded questions and privacy boundaries.
- **Error state:** Safe rate-limit, provider unavailable, no-grounding, moderation, and retry states; no fabricated answer.
- **Responsive/mobile behavior:** Composer remains keyboard-safe; citations open in lesson context; streaming is screen-reader considerate.
- **Acceptance criteria:** Retrieval is authorization-scoped; answers cite sources; unsupported claims disclose uncertainty; secrets/system prompts are not exposed.

### LRN-11 Profile

- **Route/status:** `/profile`; Planned.
- **Permitted roles:** Any authenticated user for self.
- **Purpose:** View/update permitted personal profile fields.
- **Major components:** Identity summary, editable profile fields, role/membership read-only summary, account actions.
- **Required APIs:** `GET /users/me/profile`, `PATCH /users/me/profile`.
- **Loading state:** Profile skeleton; editing disabled until loaded.
- **Empty state:** Optional fields show prompts, not invented values.
- **Error state:** Field validation, conflict, and retry; preserve unsaved input locally without sensitive persistence.
- **Responsive/mobile behavior:** Single-column form on compact screens; appropriate input types.
- **Acceptance criteria:** Only allowed fields update; email changes follow a separate verified flow; audit/privacy rules apply.

### LRN-12 Settings

- **Route/status:** `/settings`; Planned.
- **Permitted roles:** Any authenticated user for self.
- **Purpose:** Manage preferences, notifications, accessibility choices, sessions, and approved account controls.
- **Major components:** Preference sections, notification controls, session list after refresh-token milestone, sign-out, destructive-account gate when approved.
- **Required APIs:** `GET/PATCH /users/me/preferences`, `GET/DELETE /auth/sessions`, `POST /auth/logout`.
- **Loading state:** Section skeletons with controls disabled.
- **Empty state:** Defaults shown explicitly; no session list before capability exists.
- **Error state:** Section-level retry and confirmation for security-sensitive failures.
- **Responsive/mobile behavior:** Native switches and web controls expose equivalent accessible semantics.
- **Acceptance criteria:** Updates persist and are scoped to self; security actions require confirmation; destructive controls remain gated by policy.

## Instructor and administrator screens

### MGT-01 Management dashboard

- **Route/status:** `/manage/dashboard`; Planned.
- **Permitted roles:** Instructor (assigned scope), Admin (platform scope).
- **Purpose:** Summarize authoring/review workload and permitted operational indicators.
- **Major components:** Draft courses, pending reviews, enrollment summaries, alerts, quick actions.
- **Required APIs:** `GET /management/dashboard`.
- **Loading state:** Independent metric/list skeletons.
- **Empty state:** Onboarding/assignment guidance appropriate to role.
- **Error state:** Section retry; scope failure never broadens data.
- **Responsive/mobile behavior:** Summary-first mobile layout; complex work links to dedicated screens.
- **Acceptance criteria:** Role and assignment scoping verified; metrics have definitions and no invented production numbers.

### MGT-02 Course management

- **Route/status:** `/manage/courses`; Planned.
- **Permitted roles:** Instructor for assigned courses; Admin for all.
- **Purpose:** Search/filter courses and manage lifecycle actions.
- **Major components:** Course table/cards, status filters, owner, validation indicators, create/edit/archive actions.
- **Required APIs:** `GET /management/courses`, `POST /management/courses`, lifecycle endpoints.
- **Loading state:** Table/card skeleton.
- **Empty state:** No assigned courses or no filter matches with role-appropriate create/reset action.
- **Error state:** Retry; forbidden actions hidden and server-denied.
- **Responsive/mobile behavior:** Table becomes cards with essential actions; bulk operations may be desktop-only with documented alternative.
- **Acceptance criteria:** Pagination and status are stable; publication/archive confirmation and audit behavior work; no unauthorized courses appear.

### MGT-03 Course editor

- **Route/status:** `/manage/courses/[courseId]/edit`; Planned.
- **Permitted roles:** Assigned Instructor; Admin.
- **Purpose:** Edit course metadata, outcomes, prerequisites, visibility, and publication readiness.
- **Major components:** Metadata form, media, outcomes, prerequisites, version/status panel, validation summary, preview/publish actions.
- **Required APIs:** `GET/PATCH /management/courses/:courseId`, `POST /management/courses/:courseId/publish`.
- **Loading state:** Editor skeleton and version lock.
- **Empty state:** New course defaults with explicit required fields.
- **Error state:** Field validation, stale-version conflict, media error, publish-readiness errors.
- **Responsive/mobile behavior:** Usable for small edits on mobile; complex authoring optimized for wider screens without blocking access.
- **Acceptance criteria:** Optimistic concurrency/versioning prevents overwrite; publish validates curriculum; actions are audited.

### MGT-04 Module and lesson editor

- **Route/status:** `/manage/courses/[courseId]/curriculum`; Planned, with nested selection in route/query state.
- **Permitted roles:** Assigned Instructor; Admin.
- **Purpose:** Create, order, edit, preview, and validate modules and lessons.
- **Major components:** Curriculum tree, drag/reorder controls with keyboard alternative, block editor, media/resources, preview, save state.
- **Required APIs:** Module/lesson management CRUD and reorder endpoints.
- **Loading state:** Tree/editor skeleton; selected item remains stable.
- **Empty state:** First-module/lesson creation guidance.
- **Error state:** Validation and version conflicts; failed reorders restore canonical order; media retry.
- **Responsive/mobile behavior:** Tree becomes drawer; reorder has non-drag controls; block editing stacks.
- **Acceptance criteria:** Ordering is transactional; sanitized blocks; unpublished drafts remain private; preview matches learner renderer.

### MGT-05 Quiz management

- **Route/status:** `/manage/quizzes`; Planned.
- **Permitted roles:** Assigned Instructor; Admin.
- **Purpose:** Author quiz settings, questions, answer keys, feedback, and attempt policy.
- **Major components:** Quiz list/editor, question builder, answer options, scoring/settings, preview, publish validation.
- **Required APIs:** Management quiz CRUD/question/reorder endpoints.
- **Loading state:** List/editor skeleton.
- **Empty state:** No quizzes with create action.
- **Error state:** Invalid scoring, missing key, conflict, and save retry.
- **Responsive/mobile behavior:** Question cards stack; keyboard-accessible reorder; complex matrix questions need responsive alternative.
- **Acceptance criteria:** Scores total correctly; answer keys never leak to learner API; versioned published quizzes remain stable for attempts.

### MGT-06 Project management

- **Route/status:** `/manage/projects`; Planned.
- **Permitted roles:** Assigned Instructor; Admin.
- **Purpose:** Author project briefs, requirements, rubrics, submission types, and availability.
- **Major components:** Project list/editor, rubric builder, file/link rules, preview, publish controls.
- **Required APIs:** Management project/rubric CRUD endpoints.
- **Loading state:** List/editor skeleton.
- **Empty state:** No projects with create action.
- **Error state:** Rubric/requirement validation, conflict, and media retry.
- **Responsive/mobile behavior:** Rubric rows become stacked criteria; reorder has accessible controls.
- **Acceptance criteria:** Published requirements are versioned for existing submissions; validation and authorization pass.

### MGT-07 Submission review

- **Route/status:** `/manage/submissions`; Planned.
- **Permitted roles:** Assigned Instructor; Admin.
- **Purpose:** Review authorized submissions, apply rubric scores, give feedback, and update status.
- **Major components:** Review queue, filters, submission viewer, safe file access, rubric, feedback, decision history.
- **Required APIs:** `GET /management/submissions`, `GET/PATCH /management/submissions/:submissionId/review`.
- **Loading state:** Queue and selected review skeletons.
- **Empty state:** No pending submissions or no filter matches.
- **Error state:** File scanning/unavailable state, stale review conflict, authorization denial.
- **Responsive/mobile behavior:** Queue and review become sequential panels; desktop supports split view.
- **Acceptance criteria:** Reviewer assignment/scope enforced; decisions and feedback are audited; files use expiring authorized access.

### ADM-01 User management

- **Route/status:** `/admin/users`; Planned.
- **Permitted roles:** Admin only.
- **Purpose:** Search users and perform approved account/role/security actions.
- **Major components:** Paginated user table, filters, profile drawer, status/role actions, audit context.
- **Required APIs:** `GET /admin/users`, approved `PATCH /admin/users/:userId` actions.
- **Loading state:** Table skeleton.
- **Empty state:** No matches with filter reset; never “no users” if access itself failed.
- **Error state:** Authorization, conflict, protected-account, and retry states.
- **Responsive/mobile behavior:** Cards/details on compact screens; high-risk bulk actions restricted to suitable layouts.
- **Acceptance criteria:** Admin cannot bypass protected invariants; role changes follow approved model; all sensitive actions audited.

### ADM-02 Enrollment management

- **Route/status:** `/admin/enrollments`; Planned.
- **Permitted roles:** Admin; scoped Instructor read access where approved.
- **Purpose:** Create, inspect, update, or revoke enrollments with history.
- **Major components:** Filters, enrollment table, assignment action, status/history panel.
- **Required APIs:** `GET/POST /admin/enrollments`, `PATCH /admin/enrollments/:enrollmentId`.
- **Loading state:** Table skeleton.
- **Empty state:** No matches with reset/assign action.
- **Error state:** Duplicate/conflicting enrollment, protected progress, authorization, retry.
- **Responsive/mobile behavior:** Card list and explicit detail screen/sheet.
- **Acceptance criteria:** Idempotent assignment; status transitions validated; destructive revocation confirmed and audited.

### ADM-03 Certificate management

- **Route/status:** `/admin/certificates`; Planned.
- **Permitted roles:** Admin; Instructor recommendation only if approved.
- **Purpose:** Inspect eligibility and issue, reissue, or revoke certificates under policy.
- **Major components:** Eligibility queue, certificate records, evidence, issue/revoke actions, verification preview.
- **Required APIs:** Certificate administration endpoints.
- **Loading state:** Queue/table skeleton.
- **Empty state:** No eligible/pending certificates.
- **Error state:** Eligibility conflict, duplicate issue, revocation confirmation, retry.
- **Responsive/mobile behavior:** Evidence stacks; sensitive actions remain explicit.
- **Acceptance criteria:** Server recalculates eligibility; identifiers are unique; revocation updates public verification and audit log.

### MGT-08 Analytics

- **Route/status:** `/manage/analytics`; Planned.
- **Permitted roles:** Instructor for assigned course data; Admin for platform data.
- **Purpose:** Show defined learning/operational aggregates without exposing unauthorized personal data.
- **Major components:** Date/course filters, metric definitions, trend tables/charts, export when approved.
- **Required APIs:** `GET /management/analytics`.
- **Loading state:** Metric/chart skeletons.
- **Empty state:** No data for selected range with explanation.
- **Error state:** Partial metric errors and retry; no misleading zero substitution.
- **Responsive/mobile behavior:** Charts have table/text equivalents and horizontal-safe layouts.
- **Acceptance criteria:** Metric definitions documented; role scope enforced; small-cohort privacy policy applied; exports audited.

### ADM-04 AI ingestion status

- **Route/status:** `/admin/ai-ingestion`; Planned.
- **Permitted roles:** Admin; assigned Instructor for their content.
- **Purpose:** Observe and control approved course-content ingestion jobs.
- **Major components:** Course/version filters, job status, chunk counts, failures, retry/cancel actions, provider/cost metadata allowed by policy.
- **Required APIs:** `GET /ai/ingestion/jobs`, `POST /ai/ingestion/courses/:courseId`, retry/cancel endpoints.
- **Loading state:** Job table skeleton and live status refresh indicator.
- **Empty state:** No ingestion jobs with prerequisite guidance.
- **Error state:** Provider/configuration/job failure details redacted; safe retry where idempotent.
- **Responsive/mobile behavior:** Job cards on compact screens; logs remain readable and redacted.
- **Acceptance criteria:** Only authorized published versions ingest; duplicate requests are idempotent; failures do not expose content/secrets.

### ADM-05 Application settings

- **Route/status:** `/admin/settings`; Planned.
- **Permitted roles:** Admin only, with finer permissions if introduced.
- **Purpose:** Manage approved non-secret runtime product settings and feature controls.
- **Major components:** Categorized settings, validation, change preview, confirmation, audit history.
- **Required APIs:** `GET/PATCH /admin/settings`.
- **Loading state:** Settings skeleton with controls disabled.
- **Empty state:** Defaults shown from server; secrets are never represented as normal settings.
- **Error state:** Validation, conflict, protected setting, and retry states.
- **Responsive/mobile behavior:** Stacked forms; high-impact actions require clear confirmation.
- **Acceptance criteria:** Allowlist-based settings only; environment secrets remain outside API; changes are versioned/audited and reversible.

## Organization screens

### ORG-01 Organization dashboard

- **Route/status:** `/organization/dashboard`; Planned.
- **Permitted roles:** Organization Admin for current organization; Admin support scope when authorized.
- **Purpose:** Summarize members, cohorts, assignments, and progress for one organization.
- **Major components:** Organization switcher when multi-membership exists, counts, assignment progress, alerts, quick actions.
- **Required APIs:** `GET /organizations/:organizationId/dashboard`.
- **Loading state:** Organization context resolves before private data; section skeletons.
- **Empty state:** New-organization onboarding with member/cohort/assignment steps.
- **Error state:** Membership/organization denial, partial metric retry, archived organization state.
- **Responsive/mobile behavior:** Summary cards stack; detailed reporting links out.
- **Acceptance criteria:** Tenant isolation tests pass; context cannot be changed by identifier tampering; metrics are defined.

### ORG-02 Members

- **Route/status:** `/organization/members`; Planned.
- **Permitted roles:** Organization Admin for current organization.
- **Purpose:** Invite, view, update, or remove organization memberships under policy.
- **Major components:** Member list, filters, invitations, role/status actions, confirmation/history.
- **Required APIs:** Organization member and invitation endpoints.
- **Loading state:** Member-list skeleton.
- **Empty state:** No members beyond current admin with invite guidance.
- **Error state:** Duplicate invitation, protected last-admin, membership conflict, retry.
- **Responsive/mobile behavior:** Cards and detail sheet; invitations optimized for mobile entry.
- **Acceptance criteria:** Membership is organization-scoped; last-admin and self-removal rules enforced; actions audited; invite tokens remain secret.

### ORG-03 Cohorts

- **Route/status:** `/organization/cohorts`; Planned.
- **Permitted roles:** Organization Admin for current organization.
- **Purpose:** Group members for assignments and reporting.
- **Major components:** Cohort list, cohort editor, member selection, status/history.
- **Required APIs:** Organization cohort CRUD and membership endpoints.
- **Loading state:** List/editor skeleton.
- **Empty state:** No cohorts with create guidance.
- **Error state:** Duplicate name, stale membership, archived cohort, retry.
- **Responsive/mobile behavior:** Member selection uses searchable sheet/list; large sets paginate.
- **Acceptance criteria:** All members belong to same organization; updates are transactional; historical reports retain meaning.

### ORG-04 Course assignments

- **Route/status:** `/organization/assignments`; Planned.
- **Permitted roles:** Organization Admin for current organization.
- **Purpose:** Assign eligible courses to members or cohorts and manage assignment lifecycle.
- **Major components:** Assignment list, target selector, course selector, dates/policy, status and conflicts.
- **Required APIs:** Organization assignment endpoints.
- **Loading state:** Assignment skeleton; selectors load independently.
- **Empty state:** No assignments with guided create action.
- **Error state:** Duplicate/conflicting assignment, ineligible course, stale cohort, retry.
- **Responsive/mobile behavior:** Multi-step flow on compact screens; summary before submit.
- **Acceptance criteria:** Idempotent assignment; organization/course eligibility enforced; enrollment effects and rollback policy are explicit.

### ORG-05 Progress reporting

- **Route/status:** `/organization/reports/progress`; Planned.
- **Permitted roles:** Organization Admin for current organization; Admin support only when authorized.
- **Purpose:** Report member/cohort/course progress within privacy and tenant boundaries.
- **Major components:** Filters, metric definitions, table/charts, drill-down, approved export.
- **Required APIs:** `GET /organizations/:organizationId/reports/progress` and approved export endpoint.
- **Loading state:** Report skeleton and query progress.
- **Empty state:** No assignments/progress for range with explanatory next action.
- **Error state:** Partial query error, export failure, scope denial; never substitute missing data with zero.
- **Responsive/mobile behavior:** Summary-first mobile view; tables scroll accessibly; charts have text alternatives.
- **Acceptance criteria:** Tenant isolation and small-group privacy policy pass; export is authorized, time-limited, and audited; metrics match definitions.
