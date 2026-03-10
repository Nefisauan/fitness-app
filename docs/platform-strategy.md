# Platform Strategy Decision

**Product:** FitAI
**Decision:** Web App (responsive, no PWA or Capacitor)
**Date:** March 2026

---

## 1. Where do your users need this product?

FitAI's target users are independent gym-goers ages 18–35 who train 2–5x per week. They interact with the product in two contexts:

- **Before/after the gym (mobile):** Checking their workout plan, logging sets during a session, or doing a weekly check-in from their phone
- **Initial setup (desktop or mobile):** Completing their fitness profile and generating their AI assessment — this is a deliberate, focused task that works on either device

The product needs to work on **mobile and desktop browsers**. It does not need to be pinned to a home screen or available offline.

---

## 2. Does it need device hardware?

Minimally. The only hardware-adjacent feature is photo upload (front/side/back physique photos for the assessment). This works fine via browser `<input type="file" accept="image/*" capture>` on mobile — no native camera API is required.

There are no features that need GPS, accelerometer, background location, Bluetooth, or sensors. A native shell adds no functional value at this stage.

---

## 3. Platform Decision

**Web-only (responsive Next.js app deployed on Vercel)**

No PWA features, no Capacitor wrapper.

---

## 4. Justification

Using the platform decision framework:

| Factor | Assessment |
|---|---|
| Install friction | Core action (AI assessment) happens once — users won't install an app for a one-time task |
| Offline need | Analysis requires a live API call to Claude — offline mode doesn't improve the experience |
| Native hardware | Not needed — browser file picker covers photo upload |
| Distribution | Sharing a URL is zero-friction; App Store review adds 1–7 days per release |
| Release cadence | Weekly sprint cycle — Vercel ships on every push, App Store doesn't |
| Desktop need | Profile setup and plan review are better on desktop — native apps don't cover this |
| Daily vs. weekly use | Users check in weekly, not daily — home screen presence matters less |

A web app reaches 100% of the target audience (desktop + mobile) with no friction, ships instantly, and matches the usage pattern. PWA would add service worker complexity without a meaningful user benefit today. Capacitor would break the sprint cycle and add no features the browser can't handle.

---

## 5. What signal would change your mind?

I would add **PWA features** (specifically: install prompt + push notifications) if:
- Retention data shows users returning 3+ times per week (daily-ish usage pattern where home screen matters)
- Users explicitly ask for workout reminder notifications
- Weekly check-in completion rate is low and push nudges could fix it

I would consider **Capacitor** if:
- A core feature required native sensor access (e.g., real-time rep counting via accelerometer, Apple Health sync, Bluetooth heart rate monitor integration)
- The product grew to a scale where App Store discoverability was a meaningful acquisition channel
- A significant portion of users requested an app and the browser experience on mobile felt meaningfully inferior

---

## Summary

Web-only is the right decision for FitAI at this stage. The target user accesses this on whatever device is in front of them, the core value is delivered via API call not device hardware, and the weekly sprint cycle requires frictionless deployment. PWA and Capacitor solve problems FitAI doesn't have yet.
