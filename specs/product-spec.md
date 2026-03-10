# FitAI — Product Specification

## Product Overview

**FitAI** is an AI-powered fitness assessment and planning web app that gives users an objective, scored picture of their current fitness level and a personalized plan to improve it — without needing a personal trainer.

---

## Job-to-Be-Done (JTBD)

> When I'm trying to get in better shape but feel lost about where to start or what to fix, I want to get an honest, data-backed picture of my current fitness and a concrete plan to follow, so I can stop wasting time on the wrong things and see real progress.

---

## Value Proposition

FitAI delivers a personalized physique assessment, workout plan, and progress tracking system in under 60 seconds — powered by AI trained on peer-reviewed exercise science. No guesswork. No generic programs. Just your actual starting point and the exact steps to improve it.

---

## Ideal Customer Profile (ICP)

**Primary:** Independent gym-goers, ages 18–35, who:
- Train 2–5x/week without a coach or trainer
- Have tried multiple programs but feel stuck or unsure if they're training "right"
- Are motivated by data and measurable progress
- Use at least one fitness app (MyFitnessPal, Strava, etc.)

**Secondary:** Beginners (18–28) who just started training and want to avoid bad habits from the start.

**Not our user (out of ICP):** Elite athletes with coaches, people with medical conditions requiring clinical guidance, people who don't exercise and have no intention to start.

---

## User Stories with Acceptance Criteria

### Authentication

**US-01: Sign up via magic link**
As a new user, I want to sign up with just my email so I can get started without creating a password.
- [ ] User enters email on `/login`
- [ ] Receives magic link email within 60 seconds
- [ ] Clicking the link logs them in and redirects to `/`
- [ ] User session persists across browser refresh

**US-02: Return user login**
As a returning user, I want to log back in and have my data already there.
- [ ] Login via magic link works
- [ ] Previous profile, assessment, and workout logs load automatically

**US-03: Sign out**
As a user, I want to sign out and know my data is safe.
- [ ] Sign out button visible in header
- [ ] After sign out, redirected to `/landing`
- [ ] Session cookie cleared

---

### Assessment

**US-04: Complete fitness profile**
As a user, I want to enter my stats and goals so the AI can analyze me accurately.
- [ ] User can input: age, gender, height, weight, activity level, sleep, training history, goal, workout split preference, muscle priorities
- [ ] User can indicate pain/discomfort areas
- [ ] Profile auto-saves to Supabase on change (debounced)
- [ ] Imperial/metric toggle works correctly

**US-05: Upload assessment photos**
As a user, I want to optionally upload front/side/back photos to improve my analysis.
- [ ] User can upload photos from device
- [ ] Photos stored in Supabase Storage
- [ ] Photos load back on next session

**US-06: Generate AI assessment**
As a user, I want to tap one button and get my full fitness analysis.
- [ ] "Generate Full Assessment" button triggers `/api/analyze`
- [ ] Loading state shown while waiting
- [ ] Results appear in under 30 seconds
- [ ] Assessment saved to Supabase
- [ ] Tabs unlock after analysis is generated

---

### Analysis & Plans

**US-07: View physique analysis**
As a user, I want to see my fitness score and understand my weak points.
- [ ] Overall fitness score (1–100) displayed with visual meter
- [ ] Muscle groups each rated and described
- [ ] Posture indicators listed
- [ ] Movement quality flags shown
- [ ] Body fat estimate shown
- [ ] Top 2–3 weaknesses and next steps listed

**US-08: View personalized workout plan**
As a user, I want to see a workout plan built around my actual weak points.
- [ ] Workout split shown (days, focus, exercises)
- [ ] Each exercise has sets, reps, rest, and notes
- [ ] Plan reflects user's goal and training level
- [ ] Download as PDF works

**US-09: View nutrition plan**
As a user, I want to know my daily calorie and macro targets.
- [ ] Daily targets shown (calories, protein, carbs, fats)
- [ ] Meal structure and timing suggestions shown
- [ ] Hydration target shown
- [ ] Accounts for user goal (lean/bulk/recomp)

---

### Tracking

**US-10: Log a workout**
As a user, I want to log my sets and reps during a live workout.
- [ ] Can start a workout from any day in the plan
- [ ] Can log weight and reps per set per exercise
- [ ] Can skip or complete individual exercises
- [ ] Can complete the workout
- [ ] Workout saved to Supabase with duration
- [ ] Streak updates after completion

**US-11: See strength rankings**
As a user, I want to know how my lifts compare to standards.
- [ ] Estimated 1RM calculated from logged sets
- [ ] Each major lift ranked: Beginner / Novice / Intermediate / Advanced / Elite
- [ ] Bodyweight ratio shown

**US-12: Weekly check-in**
As a user, I want to log my weekly stats to track trends over time.
- [ ] Can enter weight, body measurements, and subjective ratings (energy, soreness, sleep, motivation)
- [ ] Check-in saves to Supabase
- [ ] Prompt banner appears when overdue for check-in
- [ ] History of past check-ins visible

**US-13: Upload progress photos**
As a user, I want to upload progress photos and compare them over time.
- [ ] Can upload front/side/back photos with a date
- [ ] Photos stored securely in Supabase Storage
- [ ] Side-by-side comparison view works

---

## Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | All user data must be scoped by `user_id` with Supabase RLS |
| FR-02 | App must redirect unauthenticated users to `/landing` |
| FR-03 | Assessment must fall back to demo data if Anthropic API is unavailable |
| FR-04 | Profile must auto-save on change (1s debounce) |
| FR-05 | Photos must be stored in Supabase Storage, not as base64 in the database |
| FR-06 | App must be fully functional on mobile (responsive) |
| FR-07 | PDF export must include workout, nutrition, and recovery plan |
| FR-08 | Strength rankings must use logged workout data, not self-reported maxes |
| FR-09 | Check-in prompt must only appear after 7+ days since last check-in |
| FR-10 | Workout streak must reset if no workout logged within 7 days |

---

## Out of Scope (MVP)

- Social features (sharing results, leaderboards, following friends)
- Actual photo analysis (sending images to Claude — privacy and cost concern)
- Custom exercise creation / exercise library editing
- Integration with wearables (Apple Watch, Garmin, Whoop)
- Push notifications / workout reminders
- Stripe payments / paid tier
- Coach/trainer accounts
- Real-time collaboration or multi-user households
- Video exercise demonstrations
- Barcode scanning for food logging

---

## Success Metrics

| Metric | Target | How Measured |
|---|---|---|
| Core task completion | TA can sign up, generate assessment, view workout plan | Manual QA |
| Data persistence | Profile + assessment reload on return visit | Manual test |
| Assessment generation | Completes in < 30 seconds | Observed timing |
| User test task completion | 2/3 users complete core flow without assistance | User testing sessions |
| Mobile usability | All tabs usable on iPhone SE screen | Manual test |

---

## Database Schema

See [CLAUDE.md](../CLAUDE.md#supabase-database-schema) for the full schema.

**Tables:**
- `profiles` — user stats and preferences
- `assessments` — AI analysis results + plans
- `workout_logs` — individual logged workout sessions
- `weekly_checkins` — weekly tracking data
- `progress_entries` — fitness score snapshots
- `progress_photos` — progress photo metadata
- `assessment_photos` — assessment photo metadata

**Storage buckets:**
- `progress-photos` — all user photo files (assessment + progress)
