# Platform Strategy Decision

**Product:** FitAI
**Decision date:** March 2026
**Decision:** Responsive Web App
**Alternatives considered:** PWA (Progressive Web App), Capacitor (native iOS/Android)

---

## Decision: Web App

FitAI is built as a **responsive web application** deployed on Vercel.

---

## Options Considered

### Option 1: Responsive Web App ✅ Selected

**What it is:** A Next.js app that works on any browser — desktop, mobile, or tablet — without installation.

**Why we chose this:**

1. **Zero install friction.** The core user action (completing an AI assessment) happens once. Users won't install an app for a one-time task. A URL they can open immediately removes the biggest conversion barrier.

2. **Desktop is the right context.** Filling out a detailed fitness profile, reading a multi-section analysis, and reviewing a workout plan is a deliberate, focused activity — better suited to desktop than a native phone app.

3. **Fastest path to user feedback.** For a product in early validation, web allows sharing a link and getting feedback the same day. No App Store review, no TestFlight invite needed.

4. **Vercel deployment is instant.** Every push to `main` ships automatically. This is critical during a sprint cycle where we're iterating on features weekly.

5. **Tech stack alignment.** Next.js + Supabase is the right stack for this product's combination of server-side auth, AI API calls, and real-time data. Adding Capacitor would require significant native build tooling without meaningful payoff.

**Tradeoffs accepted:**
- No push notifications (relevant for workout reminders — could add PWA later)
- No offline access (acceptable; analysis requires an internet connection anyway)
- Mobile experience is good but not app-store-native-polished

---

### Option 2: PWA (Progressive Web App)

**What it is:** A web app enhanced with a service worker to enable installability, offline caching, and push notifications.

**Why we didn't choose it now:**

- The app's core value (AI analysis) requires a live API call — offline mode doesn't meaningfully improve the experience
- Push notifications for workout reminders are a future-state feature, not MVP
- PWA adds complexity (service worker, manifest, cache strategy) without current user need
- "Add to Home Screen" adoption rates are typically low unless the app is used daily — FitAI's current usage pattern is weekly check-ins, not daily opens

**When we'd revisit:** If retention data shows that users return frequently enough that home screen access matters, or if we implement workout reminders.

---

### Option 3: Capacitor (Native iOS + Android)

**What it is:** Wraps the web app in a native shell, allowing App Store / Play Store distribution and access to native device APIs (camera, accelerometer, etc.).

**Why we didn't choose it:**

- App Store review adds 1–7 days to any feature release — incompatible with weekly sprint cycles
- Requires Apple Developer account ($99/yr) and Android distribution setup
- Camera access for photo upload works fine in mobile browsers via `<input type="file" accept="image/*" capture>`
- No current feature requires native APIs that aren't available in the browser
- The target user base is spread across desktop and mobile — a native app would only serve mobile users

**When we'd revisit:** If we build features requiring background location (outdoor training tracking), real-time camera analysis, or if the product achieves the scale where App Store discoverability is a meaningful acquisition channel.

---

## Summary

| Criterion | Web | PWA | Capacitor |
|---|---|---|---|
| Time to ship | Instant | +1 day setup | +1–2 weeks |
| User install required | No | Optional | Yes |
| Desktop support | Yes | Yes | No |
| Offline support | No | Yes | Yes |
| Push notifications | No | Yes | Yes |
| Native camera | Browser API | Browser API | Native |
| App Store presence | No | No | Yes |
| Right for current stage | **Yes** | Marginal | No |

The web app is the right platform for FitAI at this stage. We will revisit PWA features (specifically push notifications for workout reminders and check-in nudges) in Sprint 5 if retention data supports it.
