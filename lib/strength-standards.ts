import { StrengthLevel, StrengthLevelInfo, StrengthRanking, WorkoutLog } from './types';

// ── Display metadata per strength tier ──────────────────────────────

export const STRENGTH_LEVELS: Record<StrengthLevel, StrengthLevelInfo> = {
  beginner: {
    level: 'beginner',
    label: 'Beginner',
    color: 'text-slate-300',
    bgColor: 'bg-slate-500/15',
    description: 'Just starting out',
  },
  novice: {
    level: 'novice',
    label: 'Novice',
    color: 'text-amber-300',
    bgColor: 'bg-amber-500/15',
    description: 'Some training experience',
  },
  intermediate: {
    level: 'intermediate',
    label: 'Intermediate',
    color: 'text-blue-300',
    bgColor: 'bg-blue-500/15',
    description: 'Consistent training',
  },
  advanced: {
    level: 'advanced',
    label: 'Advanced',
    color: 'text-violet-300',
    bgColor: 'bg-violet-500/15',
    description: 'Serious training',
  },
  elite: {
    level: 'elite',
    label: 'Elite',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/15',
    description: 'Exceptional development',
  },
};

// ── Exercise strength standards (bodyweight multipliers for 1RM) ────

export interface ExerciseStandard {
  exercise: string;
  male: { beginner: number; novice: number; intermediate: number; advanced: number; elite: number };
  female: { beginner: number; novice: number; intermediate: number; advanced: number; elite: number };
}

export const EXERCISE_STANDARDS: ExerciseStandard[] = [
  {
    exercise: 'Bench Press',
    male:   { beginner: 0.50, novice: 0.75, intermediate: 1.00, advanced: 1.25, elite: 1.50 },
    female: { beginner: 0.25, novice: 0.40, intermediate: 0.60, advanced: 0.80, elite: 1.00 },
  },
  {
    exercise: 'Squat',
    male:   { beginner: 0.75, novice: 1.00, intermediate: 1.25, advanced: 1.75, elite: 2.25 },
    female: { beginner: 0.50, novice: 0.65, intermediate: 0.85, advanced: 1.15, elite: 1.50 },
  },
  {
    exercise: 'Deadlift',
    male:   { beginner: 1.00, novice: 1.25, intermediate: 1.50, advanced: 2.00, elite: 2.50 },
    female: { beginner: 0.60, novice: 0.80, intermediate: 1.00, advanced: 1.35, elite: 1.75 },
  },
  {
    exercise: 'Overhead Press',
    male:   { beginner: 0.35, novice: 0.50, intermediate: 0.65, advanced: 0.85, elite: 1.05 },
    female: { beginner: 0.20, novice: 0.30, intermediate: 0.45, advanced: 0.60, elite: 0.75 },
  },
  {
    exercise: 'Barbell Row',
    male:   { beginner: 0.45, novice: 0.65, intermediate: 0.85, advanced: 1.10, elite: 1.35 },
    female: { beginner: 0.25, novice: 0.40, intermediate: 0.55, advanced: 0.75, elite: 0.95 },
  },
  {
    exercise: 'Pull-ups',
    male:   { beginner: 0.80, novice: 1.00, intermediate: 1.15, advanced: 1.35, elite: 1.60 },
    female: { beginner: 0.50, novice: 0.70, intermediate: 0.85, advanced: 1.05, elite: 1.25 },
  },
];

// ── Exercise name aliases for fuzzy matching ────────────────────────

const EXERCISE_ALIASES: Record<string, string[]> = {
  'Bench Press': ['bench press', 'barbell bench', 'flat bench', 'chest press barbell', 'bb bench'],
  'Squat': ['squat', 'back squat', 'barbell squat', 'front squat', 'bb squat'],
  'Deadlift': ['deadlift', 'conventional deadlift', 'sumo deadlift', 'barbell deadlift', 'bb deadlift'],
  'Overhead Press': ['overhead press', 'ohp', 'military press', 'barbell press', 'shoulder press barbell', 'standing press'],
  'Barbell Row': ['barbell row', 'bent over row', 'pendlay row', 'bb row', 'bent-over row'],
  'Pull-ups': ['pull-up', 'pullup', 'chin-up', 'chinup', 'pull up', 'chin up', 'weighted pull'],
};

// ── Core functions ──────────────────────────────────────────────────

/** Epley formula for estimated 1RM */
export function calculate1RM(weight: number, reps: number): number {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

/** Map a muscle development score (1-10) to a strength level */
export function getMuscleScoreLevel(score: number): StrengthLevelInfo {
  if (score <= 2) return STRENGTH_LEVELS.beginner;
  if (score <= 4) return STRENGTH_LEVELS.novice;
  if (score <= 6) return STRENGTH_LEVELS.intermediate;
  if (score <= 8) return STRENGTH_LEVELS.advanced;
  return STRENGTH_LEVELS.elite;
}

/** Get strength level for a specific exercise based on 1RM and bodyweight */
export function getExerciseStrengthLevel(
  exercise: string,
  estimated1RM: number,
  bodyweightKg: number,
  gender: 'male' | 'female' | 'other'
): StrengthLevelInfo {
  const standard = EXERCISE_STANDARDS.find((s) => s.exercise === exercise);
  if (!standard || bodyweightKg <= 0) return STRENGTH_LEVELS.beginner;

  const ratio = estimated1RM / bodyweightKg;
  // Default to male standards for 'other'
  const thresholds = gender === 'female' ? standard.female : standard.male;

  if (ratio >= thresholds.elite) return STRENGTH_LEVELS.elite;
  if (ratio >= thresholds.advanced) return STRENGTH_LEVELS.advanced;
  if (ratio >= thresholds.intermediate) return STRENGTH_LEVELS.intermediate;
  if (ratio >= thresholds.novice) return STRENGTH_LEVELS.novice;
  return STRENGTH_LEVELS.beginner;
}

/** Fuzzy-match an exercise name from workout logs to a standard exercise */
export function matchExerciseToStandard(exerciseName: string): ExerciseStandard | null {
  const lower = exerciseName.toLowerCase();

  for (const [standardName, aliases] of Object.entries(EXERCISE_ALIASES)) {
    for (const alias of aliases) {
      if (lower.includes(alias)) {
        return EXERCISE_STANDARDS.find((s) => s.exercise === standardName) || null;
      }
    }
  }

  return null;
}

/** Check if an exercise is a pull-up variant (needs bodyweight added) */
function isPullUpVariant(exerciseName: string): boolean {
  const lower = exerciseName.toLowerCase();
  return (EXERCISE_ALIASES['Pull-ups'] || []).some((alias) => lower.includes(alias));
}

/** Extract personal records from workout logs */
export function extractPersonalRecords(
  workoutLogs: WorkoutLog[],
  bodyweightKg: number,
  gender: 'male' | 'female' | 'other'
): StrengthRanking[] {
  if (!bodyweightKg || bodyweightKg <= 0) return [];

  // Track best 1RM per standard exercise
  const bestLifts: Record<string, { weight: number; reps: number; estimated1RM: number }> = {};

  for (const log of workoutLogs) {
    if (!log.completedAt) continue;

    for (const exercise of log.exercises) {
      if (!exercise.completed) continue;

      const standard = matchExerciseToStandard(exercise.exerciseName);
      if (!standard) continue;

      const isPullUp = isPullUpVariant(exercise.exerciseName);

      for (const set of exercise.actual) {
        if (!set.completed || !set.weight || !set.reps) continue;

        const effectiveWeight = isPullUp ? bodyweightKg + (set.weight || 0) : set.weight;
        const est1RM = calculate1RM(effectiveWeight, set.reps);

        const key = standard.exercise;
        if (!bestLifts[key] || est1RM > bestLifts[key].estimated1RM) {
          bestLifts[key] = {
            weight: set.weight,
            reps: set.reps,
            estimated1RM: est1RM,
          };
        }
      }
    }
  }

  return Object.entries(bestLifts).map(([exercise, data]) => {
    const ratio = data.estimated1RM / bodyweightKg;
    const levelInfo = getExerciseStrengthLevel(exercise, data.estimated1RM, bodyweightKg, gender);
    return {
      exercise,
      bestWeight: data.weight,
      bestReps: data.reps,
      estimated1RM: data.estimated1RM,
      bodyweightRatio: Math.round(ratio * 100) / 100,
      level: levelInfo.level,
    };
  });
}
