'use client';

import { useState } from 'react';
import { MuscleGroup } from '@/lib/types';
import { getMuscleScoreLevel } from '@/lib/strength-standards';

// ── Score-to-color mapping ──────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score <= 3) return '#ef4444'; // red
  if (score <= 5) return '#f59e0b'; // amber
  if (score <= 7) return '#22c55e'; // green
  if (score <= 9) return '#10b981'; // emerald
  return '#06b6d4';                  // cyan
}

function getScoreOpacity(score: number): number {
  return 0.55 + (score / 10) * 0.35;
}

// ── Development badge config ────────────────────────────────────────────

const developmentBadges: Record<string, { label: string; tw: string }> = {
  underdeveloped: { label: 'Needs Work', tw: 'bg-amber-500/15 text-amber-300 ring-amber-500/25' },
  balanced:       { label: 'Balanced', tw: 'bg-green-500/15 text-green-300 ring-green-500/25' },
  well_developed: { label: 'Well Developed', tw: 'bg-blue-500/15 text-blue-300 ring-blue-500/25' },
  overdominant:   { label: 'Overdominant', tw: 'bg-purple-500/15 text-purple-300 ring-purple-500/25' },
};

// ── Muscle region type with fibers ──────────────────────────────────────

interface MuscleRegion {
  name: string;
  paths: string[];     // main fill shapes
  fibers: string[];    // striation/fiber lines (stroke-only)
}

// ══════════════════════════════════════════════════════════════════════════
//  FRONT VIEW — Anatomical Muscle Regions
//  viewBox: 0 0 200 440
//  Center axis: x = 100
//  Proportions: ~7.5 heads tall, athletic V-taper build
// ══════════════════════════════════════════════════════════════════════════

const frontRegions: MuscleRegion[] = [
  // ── SHOULDERS (Anterior Deltoid) ──────────────────────────────────────
  {
    name: 'Shoulders',
    paths: [
      // Left anterior deltoid — rounded cap over humeral head
      'M72,76 C66,73 58,72 51,74 C44,76 38,82 35,89 C33,96 33,103 36,108 C39,112 44,114 50,113 C56,112 62,107 66,101 C70,95 73,88 74,82 Z',
      // Right anterior deltoid
      'M128,76 C134,73 142,72 149,74 C156,76 162,82 165,89 C167,96 167,103 164,108 C161,112 156,114 150,113 C144,112 138,107 134,101 C130,95 127,88 126,82 Z',
    ],
    fibers: [
      // Left — fibers arc from clavicle over deltoid tuberosity
      'M70,74 C62,78 52,84 42,96',
      'M68,77 C60,82 50,90 40,102',
      'M72,80 C64,86 56,94 48,108',
      'M66,74 C56,78 46,86 38,96',
      // Right
      'M130,74 C138,78 148,84 158,96',
      'M132,77 C140,82 150,90 160,102',
      'M128,80 C136,86 144,94 152,108',
      'M134,74 C144,78 154,86 162,96',
    ],
  },
  // ── CHEST (Pectoralis Major) ──────────────────────────────────────────
  {
    name: 'Chest',
    paths: [
      // Left pec — fan-shaped, sternal + clavicular heads, inserts lateral
      'M97,84 C93,82 87,81 80,83 C73,85 66,90 60,97 C55,104 52,112 53,119 C54,126 58,131 64,134 C70,137 78,136 86,132 C92,128 96,122 97,116 C98,108 98,96 97,84 Z',
      // Right pec
      'M103,84 C107,82 113,81 120,83 C127,85 134,90 140,97 C145,104 148,112 147,119 C146,126 142,131 136,134 C130,137 122,136 114,132 C108,128 104,122 103,116 C102,108 102,96 103,84 Z',
    ],
    fibers: [
      // Left pec — fan radiating from sternum outward/upward
      'M96,88 C88,90 76,94 64,102',
      'M96,94 C88,97 76,104 62,112',
      'M96,100 C88,104 78,111 64,120',
      'M96,108 C88,112 78,118 66,128',
      'M96,116 C90,120 80,126 68,134',
      // Right pec
      'M104,88 C112,90 124,94 136,102',
      'M104,94 C112,97 124,104 138,112',
      'M104,100 C112,104 122,111 136,120',
      'M104,108 C112,112 122,118 134,128',
      'M104,116 C110,120 120,126 132,134',
    ],
  },
  // ── ARMS (Biceps + Forearms) ──────────────────────────────────────────
  {
    name: 'Arms',
    paths: [
      // Left biceps — peaked, two-headed appearance
      'M36,112 C32,116 28,126 26,138 C24,150 24,162 26,172 C28,180 32,186 37,184 C42,182 45,174 46,164 C47,154 47,140 45,128 C43,120 40,112 36,112 Z',
      // Left forearm — brachioradialis visible, tapers to wrist
      'M37,188 C34,192 31,202 29,214 C27,226 27,236 29,244 C31,250 34,254 37,252 C40,250 42,242 43,232 C44,222 43,208 42,198 C41,192 39,188 37,188 Z',
      // Right biceps
      'M164,112 C168,116 172,126 174,138 C176,150 176,162 174,172 C172,180 168,186 163,184 C158,182 155,174 154,164 C153,154 153,140 155,128 C157,120 160,112 164,112 Z',
      // Right forearm
      'M163,188 C166,192 169,202 171,214 C173,226 173,236 171,244 C169,250 166,254 163,252 C160,250 158,242 157,232 C156,222 157,208 158,198 C159,192 161,188 163,188 Z',
    ],
    fibers: [
      // Left bicep fibers — vertical, following the long head
      'M32,118 C30,132 28,150 30,170',
      'M37,114 C35,130 34,150 36,172',
      'M42,118 C40,134 40,154 42,174',
      // Left forearm fibers
      'M34,194 C32,210 30,230 32,248',
      'M39,190 C38,206 37,226 38,246',
      // Right bicep fibers
      'M168,118 C170,132 172,150 170,170',
      'M163,114 C165,130 166,150 164,172',
      'M158,118 C160,134 160,154 158,174',
      // Right forearm fibers
      'M166,194 C168,210 170,230 168,248',
      'M161,190 C162,206 163,226 162,246',
    ],
  },
  // ── CORE (Rectus Abdominis + Obliques) ────────────────────────────────
  {
    name: 'Core',
    paths: [
      // Left upper ab segment (top of six-pack)
      'M87,136 C89,135 93,135 97,136 L97,150 C93,151 89,151 87,150 Z',
      // Right upper ab
      'M103,136 C107,135 111,135 113,136 L113,150 C111,151 107,151 103,150 Z',
      // Left mid-upper ab
      'M86,154 C88,153 93,153 97,154 L97,170 C93,171 88,171 86,170 Z',
      // Right mid-upper ab
      'M103,154 C107,153 112,153 114,154 L114,170 C112,171 107,171 103,170 Z',
      // Left mid-lower ab
      'M85,174 C87,173 93,173 97,174 L97,192 C93,193 87,193 85,192 Z',
      // Right mid-lower ab
      'M103,174 C107,173 113,173 115,174 L115,192 C113,193 107,193 103,192 Z',
      // Left oblique — diagonal slab along the waistline
      'M68,138 C66,144 64,156 63,168 C62,180 62,192 64,202 L82,202 C83,192 83,178 84,164 C84,152 83,140 82,136 Z',
      // Right oblique
      'M132,138 C134,144 136,156 137,168 C138,180 138,192 136,202 L118,202 C117,192 117,178 116,164 C116,152 117,140 118,136 Z',
    ],
    fibers: [
      // Linea alba — midline vertical
      'M100,136 L100,202',
      // Tendinous inscriptions — horizontal separations
      'M86,150 L114,150',
      'M85,170 L115,170',
      'M84,192 L116,192',
      // Left oblique fibers — diagonal downward-inward
      'M78,140 C76,156 72,176 68,198',
      'M74,138 C72,154 68,174 64,196',
      // Right oblique fibers
      'M122,140 C124,156 128,176 132,198',
      'M126,138 C128,154 132,174 136,196',
    ],
  },
  // ── QUADS (Vastus Lateralis, Rectus Femoris, Vastus Medialis) ─────────
  {
    name: 'Quads',
    paths: [
      // Left vastus lateralis — outer sweep, long and wide
      'M66,210 C60,214 54,226 50,242 C46,260 44,280 46,298 C48,312 52,322 58,326 C64,330 68,324 70,316 C72,306 73,290 73,272 C73,254 72,234 70,220 C68,214 67,210 66,210 Z',
      // Left rectus femoris — center of thigh, teardrop at knee
      'M78,212 C74,216 70,228 68,244 C66,262 67,282 70,298 C73,310 78,318 84,316 C90,314 92,306 92,296 C92,280 90,258 88,240 C86,224 82,214 78,212 Z',
      // Left vastus medialis — teardrop above inner knee
      'M86,292 C82,296 80,304 80,312 C80,320 83,326 88,328 C93,330 96,324 96,316 C96,308 94,298 90,292 C88,290 87,290 86,292 Z',
      // Right vastus lateralis
      'M134,210 C140,214 146,226 150,242 C154,260 156,280 154,298 C152,312 148,322 142,326 C136,330 132,324 130,316 C128,306 127,290 127,272 C127,254 128,234 130,220 C132,214 133,210 134,210 Z',
      // Right rectus femoris
      'M122,212 C126,216 130,228 132,244 C134,262 133,282 130,298 C127,310 122,318 116,316 C110,314 108,306 108,296 C108,280 110,258 112,240 C114,224 118,214 122,212 Z',
      // Right vastus medialis
      'M114,292 C118,296 120,304 120,312 C120,320 117,326 112,328 C107,330 104,324 104,316 C104,308 106,298 110,292 C112,290 113,290 114,292 Z',
    ],
    fibers: [
      // Left VL fibers — diagonal lateral sweep
      'M62,218 C58,236 52,262 50,294',
      'M66,214 C62,234 56,262 54,296',
      'M70,216 C66,238 62,268 60,300',
      // Left RF fibers — vertical
      'M76,218 C74,240 72,268 74,304',
      'M82,214 C80,236 78,264 80,300',
      // Left VMO fibers — short diagonal at inner knee
      'M84,296 C82,306 82,318 86,326',
      // Right VL fibers
      'M138,218 C142,236 148,262 150,294',
      'M134,214 C138,234 144,262 146,296',
      'M130,216 C134,238 138,268 140,300',
      // Right RF fibers
      'M124,218 C126,240 128,268 126,304',
      'M118,214 C120,236 122,264 120,300',
      // Right VMO fibers
      'M116,296 C118,306 118,318 114,326',
    ],
  },
  // ── CALVES (Tibialis Anterior — front view) ───────────────────────────
  {
    name: 'Calves',
    paths: [
      // Left tibialis anterior — lateral calf front face
      'M58,336 C54,340 50,352 50,366 C50,380 53,392 58,396 C63,400 67,396 68,388 C69,380 69,366 67,352 C65,342 62,336 58,336 Z',
      // Left medial calf front
      'M72,338 C68,342 66,354 66,368 C66,380 68,390 72,394 C76,398 80,394 80,386 C80,378 80,364 78,350 C76,342 74,338 72,338 Z',
      // Right tibialis anterior
      'M142,336 C146,340 150,352 150,366 C150,380 147,392 142,396 C137,400 133,396 132,388 C131,380 131,366 133,352 C135,342 138,336 142,336 Z',
      // Right medial calf front
      'M128,338 C132,342 134,354 134,368 C134,380 132,390 128,394 C124,398 120,394 120,386 C120,378 120,364 122,350 C124,342 126,338 128,338 Z',
    ],
    fibers: [
      // Left tib ant fibers — vertical
      'M56,342 C54,358 52,376 56,392',
      'M62,338 C60,356 60,374 62,392',
      'M70,340 C68,358 68,376 70,390',
      'M76,340 C74,356 74,374 76,390',
      // Right
      'M144,342 C146,358 148,376 144,392',
      'M138,338 C140,356 140,374 138,392',
      'M130,340 C132,358 132,376 130,390',
      'M124,340 C126,356 126,374 124,390',
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════
//  BACK VIEW — Anatomical Muscle Regions
//  viewBox: 0 0 200 440  |  Center axis: x = 100
// ══════════════════════════════════════════════════════════════════════════

const backRegions: MuscleRegion[] = [
  // ── SHOULDERS (Posterior Deltoid) ─────────────────────────────────────
  {
    name: 'Shoulders',
    paths: [
      // Left posterior deltoid
      'M72,76 C66,73 58,72 51,74 C44,76 38,82 35,89 C33,96 33,103 36,108 C39,112 44,114 50,113 C56,112 62,107 66,101 C70,95 73,88 74,82 Z',
      // Right posterior deltoid
      'M128,76 C134,73 142,72 149,74 C156,76 162,82 165,89 C167,96 167,103 164,108 C161,112 156,114 150,113 C144,112 138,107 134,101 C130,95 127,88 126,82 Z',
    ],
    fibers: [
      // Left rear delt — fibers arcing from spine of scapula to insertion
      'M70,74 C62,78 52,84 42,96',
      'M68,77 C60,82 50,90 40,102',
      'M72,80 C64,86 56,94 48,108',
      'M66,74 C56,78 46,86 38,96',
      // Right rear delt
      'M130,74 C138,78 148,84 158,96',
      'M132,77 C140,82 150,90 160,102',
      'M128,80 C136,86 144,94 152,108',
      'M134,74 C144,78 154,86 162,96',
    ],
  },
  // ── BACK (Trapezius + Latissimus Dorsi + Erectors) ────────────────────
  {
    name: 'Back',
    paths: [
      // Left trapezius — diamond from mid-cervical to mid-thoracic
      'M98,62 C92,64 84,68 78,74 C72,80 66,90 64,100 C62,108 66,116 72,118 L98,118 Z',
      // Right trapezius
      'M102,62 C108,64 116,68 122,74 C128,80 134,90 136,100 C138,108 134,116 128,118 L102,118 Z',
      // Left latissimus dorsi — wide wing from axilla to iliac crest
      'M72,120 C64,126 54,138 50,154 C46,170 48,188 56,200 C62,208 72,212 84,214 L98,214 L98,120 Z',
      // Right latissimus dorsi
      'M128,120 C136,126 146,138 150,154 C154,170 152,188 144,200 C138,208 128,212 116,214 L102,214 L102,120 Z',
      // Left spinal erector — narrow column along spine
      'M93,120 L97,120 L97,210 L93,210 C92,190 91,170 91,150 C91,134 92,124 93,120 Z',
      // Right spinal erector
      'M107,120 L103,120 L103,210 L107,210 C108,190 109,170 109,150 C109,134 108,124 107,120 Z',
    ],
    fibers: [
      // Left trap fibers — radiate from spine out and up
      'M97,66 C90,70 80,76 70,86',
      'M97,74 C88,80 78,88 66,98',
      'M97,82 C88,88 78,96 68,108',
      'M97,92 C90,96 80,104 72,114',
      // Right trap fibers
      'M103,66 C110,70 120,76 130,86',
      'M103,74 C112,80 122,88 134,98',
      'M103,82 C112,88 122,96 132,108',
      'M103,92 C110,96 120,104 128,114',
      // Left lat fibers — diagonal sweep from spine down and out
      'M97,128 C86,136 70,150 56,172',
      'M97,140 C86,148 72,164 58,184',
      'M97,152 C88,160 76,176 62,196',
      'M97,166 C90,174 80,188 68,206',
      'M97,178 C92,186 84,198 72,212',
      // Right lat fibers
      'M103,128 C114,136 130,150 144,172',
      'M103,140 C114,148 128,164 142,184',
      'M103,152 C112,160 124,176 138,196',
      'M103,166 C110,174 120,188 132,206',
      'M103,178 C108,186 116,198 128,212',
      // Left erector fibers — vertical
      'M95,124 L95,206',
      // Right erector fibers
      'M105,124 L105,206',
    ],
  },
  // ── ARMS (Triceps — back view) ────────────────────────────────────────
  {
    name: 'Arms',
    paths: [
      // Left tricep — horseshoe shape, three visible heads
      'M36,112 C32,116 28,126 26,138 C24,150 24,162 26,172 C28,180 32,186 37,184 C42,182 45,174 46,164 C47,154 47,140 45,128 C43,120 40,112 36,112 Z',
      // Left tricep lateral head ridge
      'M38,118 C36,124 34,134 33,146 C32,156 33,164 36,168 C38,170 40,166 40,158 C40,150 40,138 39,126 Z',
      // Right tricep
      'M164,112 C168,116 172,126 174,138 C176,150 176,162 174,172 C172,180 168,186 163,184 C158,182 155,174 154,164 C153,154 153,140 155,128 C157,120 160,112 164,112 Z',
      // Right tricep lateral head ridge
      'M162,118 C164,124 166,134 167,146 C168,156 167,164 164,168 C162,170 160,166 160,158 C160,150 160,138 161,126 Z',
    ],
    fibers: [
      // Left tricep fibers — vertical with horseshoe at bottom
      'M32,118 C30,132 28,150 30,170',
      'M37,114 C35,130 34,150 36,172',
      'M42,118 C40,134 40,154 42,174',
      'M30,168 C34,178 38,182 42,174',
      // Right tricep fibers
      'M168,118 C170,132 172,150 170,170',
      'M163,114 C165,130 166,150 164,172',
      'M158,118 C160,134 160,154 158,174',
      'M170,168 C166,178 162,182 158,174',
    ],
  },
  // ── GLUTES (Gluteus Maximus + Medius) ─────────────────────────────────
  {
    name: 'Glutes',
    paths: [
      // Left glute — round, full shape
      'M68,216 C60,220 52,230 48,244 C44,258 48,272 58,280 C68,288 80,286 90,278 C96,272 98,262 98,252 C98,240 92,228 84,220 C78,216 72,214 68,216 Z',
      // Right glute
      'M132,216 C140,220 148,230 152,244 C156,258 152,272 142,280 C132,288 120,286 110,278 C104,272 102,262 102,252 C102,240 108,228 116,220 C122,216 128,214 132,216 Z',
    ],
    fibers: [
      // Left glute fibers — curved following the rounded mass
      'M64,224 C58,238 52,258 56,276',
      'M72,218 C66,234 60,256 64,278',
      'M80,218 C76,234 72,256 76,278',
      'M88,222 C86,238 84,260 86,280',
      // Right glute fibers
      'M136,224 C142,238 148,258 144,276',
      'M128,218 C134,234 140,256 136,278',
      'M120,218 C124,234 128,256 124,278',
      'M112,222 C114,238 116,260 114,280',
    ],
  },
  // ── HAMSTRINGS (Biceps Femoris + Semitendinosus + Semimembranosus) ────
  {
    name: 'Hamstrings',
    paths: [
      // Left biceps femoris — lateral hamstring
      'M62,286 C56,290 50,304 48,320 C46,338 48,356 52,370 C56,382 62,388 68,384 C72,380 74,370 74,358 C74,342 72,322 70,306 C68,294 66,286 62,286 Z',
      // Left semitendinosus — medial hamstring
      'M76,288 C72,292 68,306 68,322 C68,340 70,358 74,372 C78,384 84,390 90,386 C94,382 96,372 96,360 C96,344 94,324 92,308 C90,296 84,288 78,286 Z',
      // Right biceps femoris
      'M138,286 C144,290 150,304 152,320 C154,338 152,356 148,370 C144,382 138,388 132,384 C128,380 126,370 126,358 C126,342 128,322 130,306 C132,294 134,286 138,286 Z',
      // Right semitendinosus
      'M124,288 C128,292 132,306 132,322 C132,340 130,358 126,372 C122,384 116,390 110,386 C106,382 104,372 104,360 C104,344 106,324 108,308 C110,296 116,288 122,286 Z',
    ],
    fibers: [
      // Left BF fibers — vertical
      'M58,292 C56,310 52,336 54,368',
      'M64,288 C62,308 60,338 62,372',
      'M70,290 C68,310 68,340 70,374',
      // Left semi fibers
      'M76,292 C74,312 72,344 76,378',
      'M82,290 C80,310 78,342 82,380',
      'M88,292 C86,314 86,346 88,382',
      // Right BF fibers
      'M142,292 C144,310 148,336 146,368',
      'M136,288 C138,308 140,338 138,372',
      'M130,290 C132,310 132,340 130,374',
      // Right semi fibers
      'M124,292 C126,312 128,344 124,378',
      'M118,290 C120,310 122,342 118,380',
      'M112,292 C114,314 114,346 112,382',
    ],
  },
  // ── CALVES (Gastrocnemius — back view, diamond shape) ─────────────────
  {
    name: 'Calves',
    paths: [
      // Left gastrocnemius — wide diamond, medial head larger
      'M56,392 C50,396 46,408 48,422 C50,436 56,446 64,450 C70,454 78,450 80,442 C82,434 82,420 80,408 C78,398 72,390 66,388 C60,386 56,390 56,392 Z',
      // Right gastrocnemius
      'M144,392 C150,396 154,408 152,422 C150,436 144,446 136,450 C130,454 122,450 120,442 C118,434 118,420 120,408 C122,398 128,390 134,388 C140,386 144,390 144,392 Z',
    ],
    fibers: [
      // Left calf fibers — vertical, converging toward Achilles
      'M54,398 C52,414 50,432 58,448',
      'M62,394 C60,412 58,432 62,448',
      'M70,392 C68,410 68,430 70,448',
      'M78,396 C76,414 76,434 78,448',
      // Right calf fibers
      'M146,398 C148,414 150,432 142,448',
      'M138,394 C140,412 142,432 138,448',
      'M130,392 C132,410 132,430 130,448',
      'M122,396 C124,414 124,434 122,448',
    ],
  },
];

// ══════════════════════════════════════════════════════════════════════════
//  BODY SILHOUETTES — Athletic V-taper, lean musculature outline
//  Head ratio ~1/7.5 body height. Wide shoulders, narrow waist.
// ══════════════════════════════════════════════════════════════════════════

const frontSilhouette =
  // Head — oval, slightly angular jaw
  'M100,8 C91,8 84,16 83,26 C82,36 84,44 88,48 C90,50 93,52 96,53 L96,58 L104,58 L104,53 C107,52 110,50 112,48 C116,44 118,36 117,26 C116,16 109,8 100,8 Z' +
  // Neck — thick, traps visible
  ' M93,58 C90,60 88,62 88,66 L88,72 L112,72 L112,66 C112,62 110,60 107,58' +
  // Left shoulder — wide, capped deltoid
  ' M88,72 C80,73 70,74 60,78 C50,82 42,88 36,96 C30,104 28,112 28,118' +
  // Left upper arm
  ' C26,128 24,140 23,152 C22,164 22,172 24,180 C26,186 28,190 30,192' +
  // Left forearm
  ' C28,198 26,210 25,222 C24,234 24,244 26,252 C28,258 30,262 32,260' +
  // Left hand
  ' C34,264 36,268 34,272 C32,276 28,278 26,276 C24,274 23,270 24,266 L26,258' +
  // Left torso — V-taper: wide lats narrowing at waist
  ' M36,108 C40,114 46,116 52,116 C58,118 64,122 68,130 C72,138 74,150 74,164 C74,178 72,190 70,200 L68,210' +
  // Left hip
  ' C66,216 64,220 62,224 C58,230 56,236 54,242' +
  // Left quad outer
  ' C50,254 46,270 44,288 C42,306 42,318 46,330' +
  // Left knee
  ' C48,338 50,342 52,340 C54,338 54,336 54,334' +
  // Left shin
  ' C52,342 50,354 48,368 C46,382 46,394 48,404' +
  // Left ankle + foot
  ' C50,412 50,418 48,422 L44,428 C42,430 42,432 44,432 L58,432 C60,432 60,430 58,428 L56,424 C54,420 54,416 56,410' +
  // Right shoulder
  ' M112,72 C120,73 130,74 140,78 C150,82 158,88 164,96 C170,104 172,112 172,118' +
  // Right upper arm
  ' C174,128 176,140 177,152 C178,164 178,172 176,180 C174,186 172,190 170,192' +
  // Right forearm
  ' C172,198 174,210 175,222 C176,234 176,244 174,252 C172,258 170,262 168,260' +
  // Right hand
  ' C166,264 164,268 166,272 C168,276 172,278 174,276 C176,274 177,270 176,266 L174,258' +
  // Right torso
  ' M164,108 C160,114 154,116 148,116 C142,118 136,122 132,130 C128,138 126,150 126,164 C126,178 128,190 130,200 L132,210' +
  // Right hip
  ' C134,216 136,220 138,224 C142,230 144,236 146,242' +
  // Right quad outer
  ' C150,254 154,270 156,288 C158,306 158,318 154,330' +
  // Right knee
  ' C152,338 150,342 148,340 C146,338 146,336 146,334' +
  // Right shin
  ' C148,342 150,354 152,368 C154,382 154,394 152,404' +
  // Right ankle + foot
  ' C150,412 150,418 152,422 L156,428 C158,430 158,432 156,432 L142,432 C140,432 140,430 142,428 L144,424 C146,420 146,416 144,410';

const backSilhouette =
  // Head
  'M100,8 C91,8 84,16 83,26 C82,36 84,44 88,48 C90,50 93,52 96,53 L96,58 L104,58 L104,53 C107,52 110,50 112,48 C116,44 118,36 117,26 C116,16 109,8 100,8 Z' +
  // Neck
  ' M93,58 C90,60 88,62 88,66 L88,72 L112,72 L112,66 C112,62 110,60 107,58' +
  // Left shoulder
  ' M88,72 C80,73 70,74 60,78 C50,82 42,88 36,96 C30,104 28,112 28,118' +
  // Left upper arm
  ' C26,128 24,140 23,152 C22,164 22,172 24,180 C26,186 28,190 30,192' +
  // Left forearm
  ' C28,198 26,210 25,222 C24,234 24,244 26,252 C28,258 30,262 32,260' +
  // Left hand
  ' C34,264 36,268 34,272 C32,276 28,278 26,276 C24,274 23,270 24,266 L26,258' +
  // Left back / torso
  ' M36,108 C40,114 46,116 52,116 C58,118 64,122 68,130 C72,138 74,150 74,164 C74,178 72,190 70,200 L68,210' +
  // Left hip
  ' C66,216 64,220 62,224 C58,230 56,236 54,242' +
  // Left hamstring outer
  ' C50,254 46,270 44,288 C42,306 42,318 46,330' +
  // Left knee
  ' C48,338 50,342 52,340 C54,338 54,336 54,334' +
  // Left calf
  ' C52,342 50,354 48,368 C46,382 46,394 48,404' +
  // Left ankle + foot
  ' C50,412 50,418 48,422 L44,428 C42,430 42,432 44,432 L58,432 C60,432 60,430 58,428 L56,424 C54,420 54,416 56,410' +
  // Right shoulder
  ' M112,72 C120,73 130,74 140,78 C150,82 158,88 164,96 C170,104 172,112 172,118' +
  // Right upper arm
  ' C174,128 176,140 177,152 C178,164 178,172 176,180 C174,186 172,190 170,192' +
  // Right forearm
  ' C172,198 174,210 175,222 C176,234 176,244 174,252 C172,258 170,262 168,260' +
  // Right hand
  ' C166,264 164,268 166,272 C168,276 172,278 174,276 C176,274 177,270 176,266 L174,258' +
  // Right back / torso
  ' M164,108 C160,114 154,116 148,116 C142,118 136,122 132,130 C128,138 126,150 126,164 C126,178 128,190 130,200 L132,210' +
  // Right hip
  ' C134,216 136,220 138,224 C142,230 144,236 146,242' +
  // Right hamstring outer
  ' C150,254 154,270 156,288 C158,306 158,318 154,330' +
  // Right knee
  ' C152,338 150,342 148,340 C146,338 146,336 146,334' +
  // Right calf
  ' C148,342 150,354 152,368 C154,382 154,394 152,404' +
  // Right ankle + foot
  ' C150,412 150,418 152,422 L156,428 C158,430 158,432 156,432 L142,432 C140,432 140,430 142,428 L144,424 C146,420 146,416 144,410';

// ── Muscle region SVG sub-component ─────────────────────────────────────

function MuscleRegionPaths({
  region,
  score,
  isHovered,
  onHover,
  onLeave,
  onClick,
  regionIndex,
  viewId,
}: {
  region: MuscleRegion;
  score: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  regionIndex: number;
  viewId: string;
}) {
  const color = getScoreColor(score);
  const opacity = getScoreOpacity(score);
  const clipId = `clip-${viewId}-${region.name.replace(/\s+/g, '')}-${regionIndex}`;

  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      onTouchStart={onClick}
      className="cursor-pointer"
      style={{ transition: 'filter 0.2s ease' }}
      filter={isHovered ? `url(#muscleGlow-${viewId})` : undefined}
    >
      {/* Clip path for fibers — union of all fill shapes */}
      <defs>
        <clipPath id={clipId}>
          {region.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>

      {/* Main muscle fill shapes */}
      {region.paths.map((d, i) => (
        <path
          key={`fill-${i}`}
          d={d}
          fill={color}
          fillOpacity={isHovered ? Math.min(opacity + 0.15, 1) : opacity}
          stroke={isHovered ? '#e2e8f0' : color}
          strokeWidth={isHovered ? 1.2 : 0.5}
          strokeOpacity={isHovered ? 0.9 : 0.25}
          strokeLinejoin="round"
          filter={`url(#innerDepth-${viewId})`}
          style={{ transition: 'all 0.2s ease' }}
        />
      ))}

      {/* Fiber striation lines — clipped to muscle boundary */}
      {region.fibers.map((d, i) => (
        <path
          key={`fiber-${i}`}
          d={d}
          fill="none"
          stroke={isHovered ? '#ffffff' : color}
          strokeOpacity={isHovered ? 0.3 : 0.18}
          strokeWidth={isHovered ? 0.6 : 0.45}
          strokeLinecap="round"
          clipPath={`url(#${clipId})`}
          style={{ transition: 'all 0.2s ease' }}
        />
      ))}
    </g>
  );
}

// ── Main exported component ─────────────────────────────────────────────

export default function BodyMap({ groups }: { groups: MuscleGroup[] }) {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const getGroup = (name: string): MuscleGroup | undefined =>
    groups.find((g) => g.name.toLowerCase() === name.toLowerCase());

  const hoveredGroup = hoveredMuscle ? getGroup(hoveredMuscle) : null;

  const renderView = (
    regions: MuscleRegion[],
    silhouette: string,
    label: string,
    viewId: string,
  ) => (
    <div className="flex-1 flex flex-col items-center min-w-0">
      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-[0.15em] mb-3">
        {label}
      </p>
      <svg
        viewBox="0 0 200 440"
        className="w-full max-w-[180px] md:max-w-[210px]"
        aria-label={`${label} body view`}
      >
        <defs>
          {/* Glow filter for hovered muscles */}
          <filter id={`muscleGlow-${viewId}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feColorMatrix in="blur" type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          {/* Inner depth shadow for each muscle piece */}
          <filter id={`innerDepth-${viewId}`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
            <feOffset dx="0" dy="0.8" result="offset" />
            <feComposite in="offset" in2="SourceAlpha" operator="arithmetic"
              k1="0" k2="1" k3="-1" k4="0" result="comp" />
            <feFlood floodColor="#000" floodOpacity="0.2" result="color" />
            <feComposite in="color" in2="comp" operator="in" result="shadow" />
            <feComposite in="SourceGraphic" in2="shadow" operator="over" />
          </filter>

          {/* Subtle gradient for the body outline */}
          <linearGradient id={`silhouetteGrad-${viewId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(148 163 184)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(71 85 105)" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Faint background body fill for context */}
        <path
          d={silhouette}
          fill="rgb(30 41 59 / 0.15)"
          stroke="none"
        />

        {/* Body silhouette outline */}
        <path
          d={silhouette}
          fill="none"
          stroke={`url(#silhouetteGrad-${viewId})`}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center line reference — spine / linea alba */}
        <line
          x1="100" y1="62" x2="100" y2="214"
          stroke="rgb(51 65 85 / 0.1)"
          strokeWidth="0.4"
          strokeDasharray="1.5,3"
        />

        {/* Muscle region paths with fibers */}
        {regions.map((region, idx) => {
          const group = getGroup(region.name);
          if (!group) return null;
          return (
            <MuscleRegionPaths
              key={region.name}
              region={region}
              score={group.score}
              isHovered={hoveredMuscle === region.name}
              onHover={() => setHoveredMuscle(region.name)}
              onLeave={() => setHoveredMuscle(null)}
              onClick={() =>
                setHoveredMuscle(
                  hoveredMuscle === region.name ? null : region.name,
                )
              }
              regionIndex={idx}
              viewId={viewId}
            />
          );
        })}
      </svg>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Muscle Map</h3>
          <p className="text-sm text-slate-400">
            Color-coded by development score
          </p>
        </div>
      </div>

      {/* Front and Back Views */}
      <div className="flex gap-4 md:gap-8 justify-center items-start">
        {renderView(frontRegions, frontSilhouette, 'Front', 'front')}
        {renderView(backRegions, backSilhouette, 'Back', 'back')}
      </div>

      {/* Tooltip / Info Panel */}
      <div
        className={`mt-5 min-h-[56px] p-3 rounded-xl border transition-all duration-200 ${
          hoveredGroup
            ? 'bg-white/5 border-slate-700/50'
            : 'bg-transparent border-slate-800/30'
        }`}
      >
        {hoveredGroup ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Color dot */}
              <div
                className="w-3.5 h-3.5 rounded-full ring-2 ring-white/10"
                style={{ backgroundColor: getScoreColor(hoveredGroup.score) }}
              />
              {/* Muscle name */}
              <span className="font-semibold text-slate-100">
                {hoveredGroup.name}
              </span>
              {/* Strength level badge */}
              {(() => {
                const levelInfo = getMuscleScoreLevel(hoveredGroup.score);
                return (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${levelInfo.bgColor} ${levelInfo.color}`}
                  >
                    {levelInfo.label}
                  </span>
                );
              })()}
              {/* Development badge */}
              {(() => {
                const badge =
                  developmentBadges[hoveredGroup.development] ??
                  developmentBadges.balanced;
                return (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${badge.tw}`}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            </div>
            {/* Score */}
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: getScoreColor(hoveredGroup.score) }}
            >
              {hoveredGroup.score}/10
            </span>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center leading-[32px]">
            Tap a muscle group to see details
          </p>
        )}
      </div>

      {/* Color Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5">
        <span className="text-[11px] text-slate-500 font-medium mr-1">
          Score:
        </span>
        {[
          { label: '1-3', color: '#ef4444', name: 'Weak' },
          { label: '4-5', color: '#f59e0b', name: 'Fair' },
          { label: '6-7', color: '#22c55e', name: 'Good' },
          { label: '8-9', color: '#10b981', name: 'Strong' },
          { label: '10', color: '#06b6d4', name: 'Elite' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-[3px]"
              style={{ backgroundColor: color, opacity: 0.85 }}
            />
            <span className="text-[11px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
