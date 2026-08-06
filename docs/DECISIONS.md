# LearnXai Decision Log

## 1. Purpose

This file records durable product and technical decisions, assumptions, and unresolved choices. It prevents future milestones from silently changing the agreed architecture. A new decision may supersede an older one, but historical entries remain visible with links between them.

Statuses:

- **Accepted** — binding until explicitly superseded.
- **Provisional** — working direction that must be validated before irreversible work.
- **Open** — requires a product, technical, security, legal, cost, or operational decision.

## 2. Accepted decisions

### D-001 — Approved application stack

- **Status:** Accepted
- **Decision:** Use Expo Router, React Native, React Native Web, and TypeScript for the frontend; NestJS and TypeScript for the backend; PostgreSQL with Prisma 7 for persistence.
- **Reason:** This is the established repository architecture and the approved cross-platform product stack.
- **Consequences:** Future milestones preserve these foundations unless a separately approved architecture decision supersedes them.

### D-002 — Canonical repository roots

- **Status:** Accepted
- **Decision:** Frontend routes live under `app/`, frontend implementation under `src/`, the only backend root is `backend/learnxai-api/`, and the only Prisma root is `backend/learnxai-api/prisma/`.
- **Reason:** A single canonical location prevents duplicate applications, schema drift, and ambiguous tooling.
- **Consequences:** Do not create another backend, Prisma tree, or Git repository.

### D-003 — Generated artifacts are not source

- **Status:** Accepted
- **Decision:** Prisma generated client files, build output, coverage, caches, and local secrets remain ignored and uncommitted.
- **Reason:** Clean-checkout generation is reproducible and avoids machine-specific or stale output.
- **Consequences:** Builds generate required artifacts; generated code is never edited manually.

### D-004 — Safe API response mapping

- **Status:** Accepted
- **Decision:** Controllers and services expose explicit safe response contracts; they do not return raw Prisma records.
- **Reason:** Persistence models may contain secrets or fields that are not part of public contracts.
- **Consequences:** Password hashes, token hashes, internal metadata, and unapproved personal data are omitted by construction.

### D-005 — Access-token authentication baseline

- **Status:** Accepted
- **Decision:** Use short-lived Bearer JWT access tokens configured through environment variables, validate issuer and audience, and keep claims minimal (`sub`, `email`, `role`).
- **Reason:** This is the implemented Milestone 3 behavior.
- **Consequences:** No insecure production fallback secret; refresh rotation and revocation are a separate future milestone.

### D-006 — Staging-first delivery

- **Status:** Accepted
- **Decision:** Target Docker Compose for local orchestration, GitHub Actions for automated checks, immutable environment-based configuration, and staging validation before production.
- **Reason:** Reproducibility and evidence must precede production release.
- **Consequences:** Production, DNS, paid infrastructure, and credentials always require approval.

### D-007 — AI provider boundary and grounded retrieval

- **Status:** Accepted
- **Decision:** Define a provider-neutral AI interface, add an OpenAI implementation later, store embeddings with PostgreSQL `pgvector`, and ground learner answers in authorized course content.
- **Reason:** Domain code must not depend directly on a vendor, and the mentor must be course-aware and auditable.
- **Consequences:** Provider calls, prompts, citations, ingestion, retrieval filters, safety limits, and cost controls are tested behind application interfaces. No AI feature is implemented before Milestone F15.

### D-008 — Four product roles

- **Status:** Accepted
- **Decision:** Product authorization must support Learner, Instructor, Admin, and Organization Admin.
- **Reason:** The approved product scope includes individual learning, content operations, platform administration, and organization reporting.
- **Consequences:** Authorization is deny-by-default. Role storage and multi-role semantics remain an open design choice before role-based authorization expands.

### D-009 — Isolated automated tests

- **Status:** Accepted
- **Decision:** Unit and e2e tests use deterministic fixtures and disposable data; tests must not alter production data.
- **Reason:** Tests must be reproducible and safe.
- **Consequences:** Database-backed suites use dedicated test databases and cleanup strategies; current authentication e2e tests retain their isolated Prisma test double until integration coverage is introduced.

### D-010 — No fabricated social proof

- **Status:** Accepted
- **Decision:** Do not invent testimonials, customer logos, user counts, placement claims, ratings, outcomes, or endorsements.
- **Reason:** Public product claims require verifiable evidence and approval.
- **Consequences:** Placeholder/demo content must be clearly labeled and must not imply real adoption or outcomes.

### D-011 — Milestone governance

- **Status:** Accepted
- **Decision:** Execute the approved sequence in [EXECUTION_PLAN.md](./EXECUTION_PLAN.md), run milestone-specific checks, update [BUILD_PROGRESS.md](./BUILD_PROGRESS.md), and commit successful milestones independently.
- **Reason:** Small, verified increments preserve traceability and rollback options.
- **Consequences:** Never push, merge, or deploy production without approval. Pause only at the gates in `AGENTS.md` or for a genuine blocker.

## 3. Provisional decisions

### D-012 — Course versioning

- **Status:** Provisional
- **Direction:** Published course structures should be immutable snapshots; authoring occurs in a draft version that can be validated and published.
- **Must be resolved by:** F05–F07.
- **Questions:** How do active enrollments experience new versions? Which edits may be applied in place? What is the archival policy?

### D-013 — Multi-tenant data ownership

- **Status:** Provisional
- **Direction:** Organization membership and assignments are explicit relations; tenant scope is enforced server-side and included in audit events.
- **Must be resolved by:** F14, with groundwork in F05.
- **Questions:** Can a user belong to multiple organizations? Can one enrollment be both personal and organization-sponsored? Which platform admins may cross tenant boundaries?

### D-014 — Asynchronous jobs

- **Status:** Provisional
- **Direction:** Email, notifications, certificate rendering, and AI ingestion use idempotent background jobs with retries and a dead-letter/recovery path.
- **Must be resolved by:** F16, with earlier minimal requirements in F02 and F12.
- **Questions:** Queue technology, delivery guarantees, retry policy, scheduling, and operational ownership.

### D-015 — Private object storage

- **Status:** Provisional
- **Direction:** Course assets and submissions use private object storage with server-authorized, short-lived access rather than public permanent URLs.
- **Must be resolved by:** F07/F11.
- **Questions:** Provider, regional residency, upload size/type policy, malware scanning, retention, and deletion.

## 4. Open product decisions

| ID | Decision required | Needed by | Approval owner/type |
| --- | --- | --- | --- |
| O-001 | Whether users may hold multiple platform roles and how a current role/context is selected | F04/F13 | Product + architecture |
| O-002 | Course lifecycle, versioning, prerequisites, pricing boundary, and publication approval | F05–F07 | Product |
| O-003 | Enrollment rules: self-enrollment, invitations, capacity, expiry, reassignment, and unenrollment | F08 | Product |
| O-004 | Progress completion rules, resume behavior, and instructor overrides | F08/F09 | Product |
| O-005 | Quiz grading, retakes, timing, randomization, pass thresholds, and feedback release | F10 | Product |
| O-006 | Project rubric, resubmission, reviewer assignment, file policy, and plagiarism review | F11 | Product + legal/security |
| O-007 | Certificate naming, numbering, revocation, public verification, and branding | F12 | Product + legal |
| O-008 | Organization membership, cohorts, assignment rules, delegated permissions, and reporting privacy | F14 | Product + privacy |
| O-009 | Notification preferences, mandatory notices, delivery channels, and quiet hours | F16 | Product + legal/privacy |
| O-010 | Supported languages, time zones, locales, and accessibility conformance target | F19 | Product + accessibility |
| O-011 | Data retention, account deletion, export, parental/minor use, consent, and regional privacy obligations | Before staging | Legal/privacy |
| O-012 | Native application launch scope and app-store release order | Before native release | Product + operations |

## 5. Open technical and operational decisions

| ID | Decision required | Needed by | Gate |
| --- | --- | --- | --- |
| O-101 | Refresh-token delivery/storage model, lifetime, reuse detection window, and device/session model | F01 | Security architecture |
| O-102 | Transactional email provider, sending domain, templates, bounce handling, and webhook verification | F02 | Credentials, paid service, DNS |
| O-103 | Frontend session persistence on web/native and cross-tab/device behavior | F03 | Security architecture |
| O-104 | Formal permission matrix and policy implementation beyond role checks | F04/F13 | Product + security |
| O-105 | API versioning approach and standardized machine-readable error envelope | F05 | Architecture |
| O-106 | Rich-text/content format, sanitization, media pipeline, and editor library | F07 | Security + major dependency if applicable |
| O-107 | Object-storage and malware-scanning providers | F07/F11 | Credentials, paid service, privacy |
| O-108 | Queue/scheduler implementation and operational dashboard | F16 | Dependency, infrastructure, paid service if hosted |
| O-109 | Cloud runtime, managed PostgreSQL/`pgvector`, regions, network design, and budgets | F17/F18 | Cloud cost + credentials |
| O-110 | Web/API domains, DNS, TLS, CORS origins, and deep-link configuration | F18 | DNS/domain + production |
| O-111 | Logging, tracing, metrics, error reporting, on-call, SLOs, and alert thresholds | F17–F20 | Provider/cost + operations |
| O-112 | Backup retention, recovery point/time objectives, and disaster-recovery region | F18/F20 | Operations + privacy |
| O-113 | OpenAI models, embedding dimensions, rate/cost budgets, prompt retention, and provider data controls | F15 | Credentials, paid service, privacy |
| O-114 | Chunk size/overlap, vector distance/index, hybrid search, reranking, and citation quality thresholds | F15 | AI evaluation evidence |
| O-115 | Analytics platform, event taxonomy, consent, retention, and organization-report privacy | F13/F14/F19 | Privacy + paid service if any |
| O-116 | MFA, enterprise SSO, and SCIM scope | Post-F20 unless prioritized | Product + security |

## 6. Current assumptions

The execution plan currently assumes:

- email address remains the unique login identifier;
- the existing `User` model can be extended incrementally by reviewed migrations;
- course consumption is available on web and native, while complex authoring may optimize for larger screens;
- organization capabilities supplement rather than replace individual learner access;
- all authorization and organization scoping is enforced by the backend, regardless of frontend visibility;
- the AI mentor answers only from course content the requesting user may access and communicates insufficient evidence;
- initial infrastructure can be regionally centralized until legal, latency, and availability requirements are approved;
- current demo UI copy and data are illustrative, not product evidence.

If an assumption becomes false, record a superseding decision before code or migration work depends on it.

## 7. Decision record procedure

For each material decision:

1. add an entry with context, status, decision, alternatives considered, consequences, owner, and date;
2. link the relevant product, architecture, API, database, security, and execution sections;
3. obtain approval when the decision crosses a pause gate;
4. update affected documents in the same milestone;
5. retain superseded entries and point to the replacement.

Minor implementation details may remain in code and tests. Decisions involving user rights, data loss, external costs, credentials, production, domains, major dependencies, or security boundaries belong here.
