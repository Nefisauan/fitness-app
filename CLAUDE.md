# FitAI — Product Specification

## Product Overview

**FitAI** is an AI-powered fitness assessment and tracking web app that gives users an objective, data-driven picture of their fitness level and a personalized plan to improve it.

**Problem:** Most people exercise without knowing their actual starting point. Generic programs ignore individual weaknesses — poor posture, muscle imbalances, mobility deficits — that limit progress and increase injury risk.

**Solution:** FitAI analyzes a user's profile (and optional physique photos) using Claude AI to generate a scored fitness assessment, personalized workout split, nutrition targets, and weekly progress tracking — all in one place.

**Target user:** Fitness-conscious adults (18–40) who train independently and want data-driven guidance rather than generic advice.

---

## Core Features

| Feature | Description |
|---|---|
| AI Physique Assessment | Claude analyzes user stats + photos, scores muscle development (1–10 per group), posture, movement quality, and body composition |
| Personalized Workout Plan | Auto-generates a workout split (full body / upper-lower / PPL / etc.) calibrated to the user's level, goal, and weak points |
| Workout Tracker | Log sets/reps during a live workout session with streak tracking |
| Strength Rankings | Estimates 1RM from logged sets and ranks the user (Beginner → Elite) on key lifts |
| Nutrition Plan | Calculates TDEE-based macro targets with meal structure and timing |
| Weekly Check-ins | Tracks weight, body measurements, and subjective ratings (energy, sleep, soreness, motivation) |
| Progress Photos | Upload and compare front/side/back progress photos over time |
| PDF Export | Download full workout + nutrition + recovery plan as a PDF |
| Auth | Email magic link auth via Supabase. All data is persisted per user. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Auth + Database | Supabase (PostgreSQL + Storage) |
| AI | Anthropic Claude API (`claude-opus-4-6`) |
| PDF Generation | jsPDF |
| Charts | Recharts |
| Hosting | Vercel |

---

## Architecture

```
app/
  page.tsx              — Protected home route (redirects to /landing if not authed)
  landing/page.tsx      — Public marketing page
  login/page.tsx        — Magic link login
  auth/confirm/         — Supabase email callback handler
  api/analyze/route.ts  — POST endpoint: calls Claude API, returns PhysiqueAnalysis JSON

components/
  HomeClient.tsx        — Main app shell (tabs, state orchestration)
  LandingClient.tsx     — Public landing page
  LoginClient.tsx       — Login form
  AnalysisResults.tsx   — Renders the AI assessment output
  WorkoutPlan.tsx       — Renders the generated workout split
  WorkoutTracker.tsx    — Live workout logging UI
  StrengthRankings.tsx  — 1RM estimates + strength level rankings
  NutritionPlan.tsx     — Macro targets + meal structure
  ProgressTracker.tsx   — Progress entries, charts, photo uploads
  CheckinHistory.tsx    — Weekly check-in log
  CheckinPromptBanner.tsx — Nudge banner when overdue for check-in
  BodyMap.tsx           — Interactive SVG body diagram
  PhotoUpload.tsx       — Assessment photo capture
  PhotoComparison.tsx   — Side-by-side progress photo view
  UserProfileForm.tsx   — Profile input form (stats, goals, preferences)
  AuthButton.tsx        — Sign out button
  DownloadPDF.tsx       — PDF export button

hooks/
  useWorkoutTracker.ts  — Workout session state + Supabase persistence
  useWeeklyCheckins.ts  — Check-in state + prompt logic
  useProgressPhotos.ts  — Progress photo CRUD
  useAssessmentPhotos.ts — Assessment photo CRUD

lib/
  types.ts              — All TypeScript interfaces
  workout.ts            — Workout plan generation logic
  nutrition.ts          — Nutrition plan / TDEE calculation
  recovery.ts           — Recovery plan generation
  strength-standards.ts — Strength level benchmark tables
  pdf-generator.ts      — jsPDF export logic
  units.ts              — Metric/imperial conversion utilities
  supabase/
    client.ts           — Browser Supabase client
    server.ts           — Server-side Supabase client (SSR)
    database.ts         — All DB read/write functions

middleware.ts           — Session refresh + auth-guard for protected routes
```

---

## Supabase Database Schema

### `profiles`
Stores user profile and preferences.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, matches `auth.users.id` |
| age | int | |
| gender | text | |
| height | float | always stored in cm |
| weight | float | always stored in kg |
| activity_level | text | sedentary / light / moderate / active / very_active |
| sleep_hours | float | |
| training_history | text | beginner / intermediate / advanced |
| goal | text | lean / bulk / aesthetic / recomp / posture |
| split_preference | text | full_body / upper_lower / ppl / etc. |
| muscle_priorities | jsonb | array of muscle group strings |
| unit_preference | text | metric / imperial |
| pain_areas | jsonb | { lowerBack, shoulders, knees, ... } |
| updated_at | timestamptz | |

### `assessments`
Stores each AI assessment result.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles |
| analysis | jsonb | `PhysiqueAnalysis` object |
| workout_plan | jsonb | `WorkoutPlan` object |
| nutrition_plan | jsonb | `NutritionPlan` object |
| recovery_plan | jsonb | `RecoveryPlan` object |
| profile_snapshot | jsonb | profile at time of assessment |
| pain_snapshot | jsonb | pain areas at time of assessment |
| created_at | timestamptz | |

### `workout_logs`
Stores individual workout session logs.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK |
| assessment_id | uuid | FK (nullable) |
| workout_day_index | int | which day of the plan |
| workout_day_label | text | e.g. "Day A" |
| workout_focus | text | e.g. "Push" |
| exercises | jsonb | array of `ExerciseLog` |
| started_at | timestamptz | |
| completed_at | timestamptz | nullable |
| duration_minutes | int | nullable |
| notes | text | nullable |

### `weekly_checkins`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK |
| checkin_date | date | unique per user |
| weight | numeric | nullable |
| measurements | jsonb | chest/waist/hips/arms/thighs |
| energy_rating | int | 1–5 |
| soreness_rating | int | 1–5 |
| sleep_rating | int | 1–5 |
| motivation_rating | int | 1–5 |
| notes | text | nullable |

### `progress_entries`
Snapshot of fitness scores over time.
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK |
| assessment_id | uuid | FK (nullable) |
| muscle_score | float | |
| posture_status | text | |
| movement_quality | text | |
| mobility_score | float | |
| stability_score | float | |
| weight | float | nullable |

### `progress_photos` + `assessment_photos`
Stored in Supabase Storage bucket `progress-photos`.
- Path format: `{userId}/{date}/{angle}-{timestamp}.{ext}` (progress)
- Path format: `{userId}/assessment/{angle}.{ext}` (assessment)

---

## API Routes

### `POST /api/analyze`
Calls Claude API to generate a full physique analysis.

**Request body:**
```json
{
  "profile": { "age": 25, "gender": "male", ... },
  "painAreas": { "lowerBack": false, ... },
  "hasPhotos": true,
  "photoAngles": ["front", "side"]
}
```

**Response:** `PhysiqueAnalysis` JSON object (see `lib/types.ts`)

**Fallback:** If `ANTHROPIC_API_KEY` is missing or the API call fails, returns a demo analysis so the app still works.

### `GET /auth/confirm`
Handles Supabase magic link callback. Exchanges code or OTP for a session, then redirects to `/`.

---

## Environment Variables

Create a `.env.local` file at the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

All three are required for full functionality. Without `ANTHROPIC_API_KEY`, the app falls back to demo analysis data.

---

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Open http://localhost:3000
```

---

## Platform Strategy

**Decision: Web App (not PWA or Capacitor)**

See `docs/platform-strategy.md` for full rationale.

Short version: The target user accesses fitness content on desktop and mobile browsers. A responsive web app reaches them without app store friction. The core value (AI assessment + plan generation) is inherently a one-time-per-session experience, not a native-only use case. PWA/Capacitor would add deployment complexity with minimal user-facing benefit at this stage.

---

## Known Limitations

- Photo analysis is metadata-only (photo angles inform the prompt; actual image pixels are not sent to Claude due to privacy and cost constraints)
- Nutrition plan uses TDEE estimation without body composition data from DEXA/hydrostatic — estimates should be treated as starting targets
- Strength rankings require logged workouts; new users see empty state until they log their first session
- No offline support (requires internet connection for analysis and data sync)
