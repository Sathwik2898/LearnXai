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
