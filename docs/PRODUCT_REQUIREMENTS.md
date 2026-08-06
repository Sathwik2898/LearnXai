# LearnXai Product Requirements

Status: approved product direction. This document defines intended product behavior; `BUILD_PROGRESS.md` identifies what is currently implemented.

## Product definition

LearnXai is a production-oriented learning management system for structured, practical learning across web, iOS, and Android. It connects curriculum, lessons, practice, quizzes, projects, progress, certificates, organization reporting, and a grounded course-aware AI mentor in one system.

LearnXai must not claim customers, testimonials, logos, user counts, placements, completion outcomes, or commercial traction unless verifiable evidence and publication approval exist.

## Approved technology constraints

- Frontend: Expo Router, React Native, React Native Web, TypeScript.
- Backend: NestJS, TypeScript.
- Database: PostgreSQL.
- ORM: Prisma 7.
- AI: provider abstraction; OpenAI implementation later and only with approved credentials/cost; PostgreSQL `pgvector`; grounded course-aware RAG.
- Infrastructure: Docker Compose, GitHub Actions, staging-first deployment, environment-based configuration.

## Product principles

1. Structured learning before feature breadth: content hierarchy and progress integrity are foundational.
2. Practical proof: quizzes, projects, submissions, and certificates must derive from explicit course requirements.
3. Safe personalization: permissions, organization boundaries, and learner privacy are enforced server-side.
4. Grounded AI: mentor answers must use authorized course content, disclose uncertainty, and provide source references.
5. Cross-platform parity: core learner flows work on web and native; platform differences are intentional and documented.
6. Accessible by default: keyboard, screen-reader, contrast, focus, reduced-motion, touch-target, and text-scaling behavior are acceptance criteria.
7. Honest product communication: examples are labeled and no social proof is fabricated.
8. Operational readiness: observable, testable, reversible, staging-verified changes precede production.

## Roles and authorization intent

### Learner

Can manage their profile, browse published courses, enroll when eligible, consume lessons, track progress, take quizzes, submit projects, view feedback, earn/view certificates, receive notifications, and use the AI mentor within authorized course context.

### Instructor

Can author and manage assigned courses, modules, lessons, quizzes, and projects; review assigned submissions; view permitted course analytics; and initiate/observe AI ingestion for content they control. Instructor access does not imply platform-wide user administration.

### Admin

Can manage platform users, enrollments, courses, certificates, analytics, AI ingestion, audit review, and application settings within explicit policy. Sensitive actions require audit records and, where defined, confirmation or step-up controls.

### Organization Admin

Can manage members, cohorts, course assignments, and reporting only inside organizations they administer. Organization Admin does not gain global platform administration or unrestricted course authoring unless separately granted.

Users may eventually need multiple role or organization memberships. The current single `User.role` column is implemented; the durable role/membership model is an approval decision recorded in `DECISIONS.md` and scheduled before organization implementation.

## Functional requirements

### Identity and access

- Learner registration with normalized unique email and bcrypt password hashing.
- Login with generic invalid-credential errors and short-lived JWT access tokens.
- Protected current-user resolution.
- Refresh-token rotation, reuse detection, logout, and token revocation.
- Email verification with single-use, expiring tokens.
- Forgot/reset password with enumeration-safe responses and session revocation policy.
- Server-side role-based authorization and organization-scoped authorization.
- User profile and preferences management.

Implemented now: registration, login, JWT access-token verification, `/auth/me`, and `/auth/health`. All other identity requirements are planned.

### Public discovery

- Landing page with factual product positioning and clear access paths.
- Searchable/filterable published course catalogue.
- Course detail pages with curriculum, prerequisites, outcomes, instructor attribution, and enrollment state.
- Registration, login, email verification, forgot-password, and reset-password flows.
- Public certificate verification without exposing unnecessary learner data.

### Learning experience

- Learner dashboard and resumable My Learning view.
- Course player with module/lesson navigation and durable progress.
- Lesson content supporting approved content types and accessible media metadata.
- Quizzes with configured attempt rules, grading, results, and review policy.
- Projects with requirements, submissions, review, feedback, and status history.
- Certificate eligibility based on versioned completion rules.
- Profile, settings, notifications, and learner-visible activity state.

### Authoring and administration

- Draft/published/archive course lifecycle.
- Ordered modules and lessons with validation and preview.
- Quiz/question/answer authoring and project/rubric authoring.
- Submission review and feedback workflows.
- User, enrollment, certificate, analytics, AI-ingestion, and application-settings administration.
- Audit logging through immutable or append-oriented events for security- and business-significant actions.

### Organizations

- Organizations with scoped memberships and Organization Admin assignment.
- Cohorts and member lifecycle.
- Course assignments to members/cohorts.
- Progress reporting constrained to authorized organization data.
- Explicit handling for membership removal, assignment changes, and historical reporting.

### AI mentor and RAG

- Provider-neutral chat/use-case interface; provider credentials never enter client code.
- Course content ingestion with version, source, status, checksum, and failure visibility.
- Deterministic lesson chunking policy, embeddings, and `pgvector` similarity retrieval.
- Retrieval constrained by published content, learner authorization, course/version, and organization rules.
- Answers grounded in retrieved content with source identifiers; uncertainty and unavailable-context behavior are explicit.
- Prompt-injection resistance, content isolation, moderation policy, rate/cost limits, retention controls, and audit metadata.
- No training or secondary use of learner content without a legal/privacy decision and explicit policy.

### Notifications and jobs

- In-app notification inbox and preference controls.
- Email delivery for verification, reset, enrollment, submission, and certificate events as approved.
- Retryable background jobs with idempotency, attempt history, dead-letter/failure handling, and observability.
- Provider callbacks/webhooks must be authenticated and idempotent.

### Health and operations

- Liveness endpoint for process health.
- Readiness endpoint covering required dependencies without exposing secrets.
- Structured logs, request correlation, error reporting, metrics, audit access, and operational alerts.
- Backups, restore tests, migration procedures, staging promotion, and rollback/forward-fix runbooks.

## Required screen families

The complete route-level specification is in `SCREEN_INVENTORY.md`.

- Public: landing, course catalogue, course details, registration, login, email verification, forgot password, reset password.
- Learner: dashboard, My Learning, course player, lesson content, quiz/results, projects, project submission, certificates, AI mentor, profile, settings.
- Instructor/Admin: dashboard, course management/editor, module/lesson editor, quiz/project management, submission review, user/enrollment/certificate management, analytics, AI ingestion status, application settings.
- Organization: dashboard, members, cohorts, course assignments, progress reporting.

## Non-functional requirements

### Security and privacy

- Follow `SECURITY_CHECKLIST.md`; deny by default and minimize returned/stored data.
- Secrets remain server-side and environment-specific.
- Sensitive tokens are random, expiring, single-use where applicable, and stored only as hashes.
- Authorization tests cover cross-user, cross-role, and cross-organization denial.
- Privacy policy, terms, retention, deletion, consent, minors/age scope, AI data use, and incident obligations require approval before production.

### Performance and reliability

- Define measurable service-level objectives before staging sign-off; no SLO values are invented here.
- Paginate unbounded collections; index verified query patterns; prevent N+1 access.
- Resume and submission operations are idempotent where retries are expected.
- AI and notification failures must not corrupt core learning state.

### Accessibility and responsive behavior

- Target WCAG 2.2 AA for web where applicable.
- Support keyboard-only use, visible focus, screen readers, semantic headings/labels, reduced motion, 200% web zoom, dynamic text, orientation changes, and accessible errors.
- Learner core flows support compact mobile widths; dense authoring/admin screens provide responsive alternatives rather than unusable compression.

### Testing and observability

- Follow `TEST_STRATEGY.md` for unit, integration, e2e, browser, accessibility, security, migration, and AI evaluation gates.
- Production-impacting actions emit appropriate audit/operational signals without recording secrets or passwords.

## Explicit exclusions until approved

- Refresh tokens and subsequent roadmap items are not implemented merely because they are specified.
- Payments, subscriptions, pricing, marketplace behavior, placement guarantees, live classrooms, social feeds, and native app-store release are not approved product scope unless added through a decision and milestone.
- No external provider, cloud platform, email sender, object store, analytics vendor, monitoring vendor, domain, or legal policy is selected by this document.

## Product-level definition of done

A capability is complete only when its UI/API/data contracts agree, authorization is enforced, loading/empty/error states exist, accessibility and responsive criteria pass, tests cover success and denial paths, operations and rollback are documented, permanent documents are updated, and staging evidence is recorded.
