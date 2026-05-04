# LearnXai Development History

## Project Identity

LearnXai is the real production codebase for an AI-first LMS platform.

The application will be built step by step using:
- Expo
- React Native
- React Native Web
- TypeScript
- Expo Router

The goal is to support both mobile and web from one codebase.

## Current Strategy

This is not a throwaway demo.

The product will begin with public access screens and slowly unlock full LMS modules.

Initial public scope:
- Landing page
- Course catalog preview
- Login
- Register / early access
- Forgot password

Future modules:
- Learner dashboard
- Admin dashboard
- Course player
- Quizzes
- Certificates
- Analytics
- Reports
- API integration

## Quality Target

The frontend should be built as a top 1% product compared to regular AI-generated apps.

Focus areas:
- Clean architecture
- Reusable components
- Strong design system
- Responsive web and mobile layout
- Premium UI
- Controlled animations
- API-ready service structure
- Loading, empty, error, and success states

## Development Rules

- Use Git checkpoints before major changes.
- Keep changes small and safe.
- Explain every new concept before implementation.
- Avoid random redesigns.
- Do not add paid tools unless explicitly approved.
- Prefer free and production-friendly resources.
- Keep app routes clean.
- Move reusable logic into src folder gradually.
## 2026-05-03 - Architecture Step: Move Landing Screen Into Feature Folder

### What changed
- Created `src/theme/colors.ts`
- Created `src/theme/spacing.ts`
- Created `src/theme/radius.ts`
- Created `src/features/marketing/screens/LandingScreen.tsx`
- Updated `app/index.tsx` to only export the landing screen route

### Why
The `app/` folder should stay focused on routing.
The actual screen UI should live inside `src/features`.
This keeps the project scalable as LearnXai grows into public, learner, and admin modules.

### Alternatives considered
1. Keep all UI in `app/index.tsx`
   - Faster but messy later.
2. Create full enterprise architecture immediately
   - Too heavy too early.
3. Move only the current landing screen into a feature folder
   - Chosen because it is safe, small, and production-minded.

### Result
LearnXai now has the beginning of a professional frontend architecture:
- routes in `app/`
- feature screens in `src/features/`
- shared design values in `src/theme/`
## 2026-05-03 - UI System Step: Add AppButton

### What changed
- Created `src/components/ui/AppButton.tsx`
- Replaced landing page hero CTA buttons with `AppButton`
- Replaced landing page course CTA button with `AppButton`

### Why
Buttons were manually styled inside screens.
A reusable button improves consistency, reduces duplicate code, and prepares the app for future states like loading, disabled, and animated press feedback.

### Alternatives considered
1. Keep using raw `Pressable`
   - Faster but causes duplicated button styles.
2. Use a third-party UI library
   - Avoided for now to keep full design control and avoid unnecessary dependency complexity.
3. Create a small custom `AppButton`
   - Chosen because it is simple, free, reusable, and production-minded.

### Result
LearnXai now has the first reusable UI component in its design system.
## 2026-05-03 - UI System Step: Add AppCard

### What changed
- Created src/components/ui/AppCard.tsx
- Replaced landing page feature card wrappers with AppCard
- Replaced landing page coming soon panel wrapper with AppCard

### Why
Cards were manually styled inside the landing screen.
A reusable card component keeps surfaces consistent across marketing pages, course catalog, dashboards, analytics, certificates, and future LMS modules.

### Alternatives considered
1. Keep raw View card wrappers
   - Faster but duplicates styling across screens.
2. Use a third-party UI card component
   - Avoided for now to keep full design control and avoid dependency overhead.
3. Create a small custom AppCard
   - Chosen because it is reusable, free, controlled, and production-minded.

### Result
LearnXai now has reusable button and card components as the beginning of its UI system.

## 2026-05-03 - UI System Step: Add AppInput

### What changed
- Created src/components/ui/AppInput.tsx
- Replaced login screen email and password TextInput fields with AppInput

### Why
Input styling was manually repeated inside screens.
A reusable input component improves consistency and prepares the app for validation, error messages, disabled states, and controlled form values.

### Alternatives considered
1. Keep raw TextInput
   - Faster but duplicates input styles across screens.
2. Add a form library immediately
   - Avoided for now because the UI system foundation should come first.
3. Create a small custom AppInput
   - Chosen because it is simple, free, reusable, and production-minded.

### Result
LearnXai now has reusable button, card, and input components as the beginning of its design system.

## 2026-05-03 - Refactor: Use AppInput In Register Screen

### What changed
- Replaced raw TextInput fields in RegisterScreen with AppInput
- Removed duplicate label, input, and textarea styles from RegisterScreen

### Why
The register screen had repeated form field styling.
Using AppInput keeps auth forms visually consistent and makes future validation/error handling easier.

### Alternatives considered
1. Keep raw TextInput in register
   - Faster but duplicates form styling.
2. Refactor all forms at once
   - Avoided to keep the change safe and easy to verify.
3. Apply AppInput only to register after testing it on login
   - Chosen because it is controlled and low-risk.

### Result
Login and register now share the same reusable input component.

## 2026-05-03 - Layout Step: Add PublicHeader

### What changed
- Created src/components/layout/PublicHeader.tsx
- Moved landing page navigation/header UI into PublicHeader
- Replaced landing page inline navbar with <PublicHeader />

### Why
The public navigation will be reused across landing, courses, login, register, pricing, FAQ, and certificate verification pages.
Keeping it as a shared layout component improves consistency and makes future responsive/mobile header improvements easier.

### Alternatives considered
1. Keep navbar inside LandingScreen
   - Faster but duplicates header code later.
2. Put header directly inside PageShell
   - Avoided because not every screen may need the same header.
3. Create a separate PublicHeader
   - Chosen because it is reusable, controlled, and production-minded.

### Result
LearnXai now has a reusable public navigation component.

## 2026-05-03 - Layout Step: Use PublicHeader In Courses Page

### What changed
- Added PublicHeader to CoursesPreviewScreen
- Removed the standalone Back to Home link from the courses page
- Reduced top padding because PageShell and PublicHeader now manage layout spacing

### Why
The courses page is part of the public LearnXai experience.
Using the shared public header creates consistent navigation across public pages and makes the product feel more professional.

### Alternatives considered
1. Keep the Back to Home link
   - Simple but less polished for a public website page.
2. Add a separate courses-only header
   - Avoided because it would duplicate navigation logic.
3. Reuse PublicHeader
   - Chosen because it keeps public page navigation consistent.

### Result
Landing and Courses now share the same public navigation component.
