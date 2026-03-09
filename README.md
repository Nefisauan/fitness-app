# FitAI

AI-powered fitness assessment and tracking. Stop guessing your fitness — measure it.

**Live app:** https://fitness-app-seven-taupe.vercel.app

---

## What it does

FitAI takes your fitness stats and (optionally) physique photos and gives you:

- **Scored physique analysis** — muscle development, posture, movement quality, and body fat estimate, powered by Claude AI
- **Personalized workout plan** — split type and exercises chosen based on your actual weak points
- **Workout tracker** — log sets and reps, track your streak, see strength rankings
- **Nutrition plan** — TDEE-based macro targets and meal structure
- **Progress tracking** — weekly check-ins, progress photos, and trend charts

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Supabase** — auth, PostgreSQL database, file storage
- **Anthropic Claude API** — AI analysis engine
- **Tailwind CSS** — styling
- **Vercel** — hosting

## Local Development

```bash
# 1. Clone and install
git clone https://github.com/Nefisauan/fitness-app.git
cd fitness-app
npm install

# 2. Create .env.local
cp .env.example .env.local
# Fill in your Supabase and Anthropic keys

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=       # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Your Supabase anon key
ANTHROPIC_API_KEY=              # Your Anthropic API key
```

Without `ANTHROPIC_API_KEY`, the app falls back to demo analysis data — everything else still works.

## Project Structure

See [CLAUDE.md](./CLAUDE.md) for full architecture documentation, database schema, and API reference.

## Course Context

Built for STRAT 490R: Creating Digital Products with AI at BYU.
