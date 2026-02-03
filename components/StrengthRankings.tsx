'use client';

import { useMemo } from 'react';
import { WorkoutLog, UserProfile, StrengthLevel, MuscleGroup } from '@/lib/types';
import {
  extractPersonalRecords,
  EXERCISE_STANDARDS,
  STRENGTH_LEVELS,
  getMuscleScoreLevel,
} from '@/lib/strength-standards';

// ── Types ────────────────────────────────────────────────────────────────────

interface StrengthRankingsProps {
  workoutLogs: WorkoutLog[];
  profile: UserProfile;
  muscleGroups?: MuscleGroup[];
}

// ── Constants ────────────────────────────────────────────────────────────────

const LEVEL_ORDER: StrengthLevel[] = ['beginner', 'novice', 'intermediate', 'advanced', 'elite'];

/** Gradient border / ring accents per level */
const LEVEL_ACCENTS: Record<StrengthLevel, { border: string; gradient: string; glow: string; ring: string; text: string; bg: string; bar: string }> = {
  beginner: {
    border: 'border-slate-500/40',
    gradient: 'from-slate-400 to-slate-500',
    glow: 'shadow-slate-500/20',
    ring: 'ring-slate-500/30',
    text: 'text-slate-300',
    bg: 'bg-slate-500',
    bar: 'bg-gradient-to-r from-slate-500/60 to-slate-400/60',
  },
  novice: {
    border: 'border-amber-500/40',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-500/20',
    ring: 'ring-amber-500/30',
    text: 'text-amber-300',
    bg: 'bg-amber-500',
    bar: 'bg-gradient-to-r from-amber-500/60 to-orange-400/60',
  },
  intermediate: {
    border: 'border-blue-500/40',
    gradient: 'from-blue-400 to-cyan-500',
    glow: 'shadow-blue-500/20',
    ring: 'ring-blue-500/30',
    text: 'text-blue-300',
    bg: 'bg-blue-500',
    bar: 'bg-gradient-to-r from-blue-500/60 to-cyan-400/60',
  },
  advanced: {
    border: 'border-violet-500/40',
    gradient: 'from-violet-400 to-purple-500',
    glow: 'shadow-violet-500/20',
    ring: 'ring-violet-500/30',
    text: 'text-violet-300',
    bg: 'bg-violet-500',
    bar: 'bg-gradient-to-r from-violet-500/60 to-purple-400/60',
  },
  elite: {
    border: 'border-cyan-400/40',
    gradient: 'from-cyan-400 to-teal-400',
    glow: 'shadow-cyan-400/25',
    ring: 'ring-cyan-400/30',
    text: 'text-cyan-300',
    bg: 'bg-cyan-400',
    bar: 'bg-gradient-to-r from-cyan-400/60 to-teal-400/60',
  },
};

/** Segment bar background per level */
const SEGMENT_BG: Record<StrengthLevel, string> = {
  beginner: 'bg-slate-500/25',
  novice: 'bg-amber-500/25',
  intermediate: 'bg-blue-500/25',
  advanced: 'bg-violet-500/25',
  elite: 'bg-cyan-400/25',
};

const SEGMENT_FILL: Record<StrengthLevel, string> = {
  beginner: 'bg-slate-400',
  novice: 'bg-amber-400',
  intermediate: 'bg-blue-400',
  advanced: 'bg-violet-400',
  elite: 'bg-cyan-400',
};

/** Muscle score color function matching BodyMap */
function getScoreColor(score: number): string {
  if (score <= 3) return '#ef4444';
  if (score <= 5) return '#f59e0b';
  if (score <= 7) return '#22c55e';
  if (score <= 9) return '#10b981';
  return '#06b6d4';
}

function getScoreTailwind(score: number): { text: string; bg: string; ring: string } {
  if (score <= 3) return { text: 'text-red-400', bg: 'bg-red-500/15', ring: 'ring-red-500/25' };
  if (score <= 5) return { text: 'text-amber-400', bg: 'bg-amber-500/15', ring: 'ring-amber-500/25' };
  if (score <= 7) return { text: 'text-green-400', bg: 'bg-green-500/15', ring: 'ring-green-500/25' };
  if (score <= 9) return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/25' };
  return { text: 'text-cyan-400', bg: 'bg-cyan-500/15', ring: 'ring-cyan-500/25' };
}

const DEV_BADGES: Record<string, { label: string; tw: string }> = {
  underdeveloped: { label: 'Needs Work', tw: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25' },
  balanced: { label: 'Balanced', tw: 'bg-green-500/15 text-green-300 ring-1 ring-green-500/25' },
  well_developed: { label: 'Strong', tw: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/25' },
  overdominant: { label: 'Dominant', tw: 'bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/25' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLevelIndex(level: StrengthLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

function getLevelNumericScore(level: StrengthLevel): number {
  // 0-100 mapping: beginner=10, novice=30, intermediate=50, advanced=75, elite=95
  const scores: Record<StrengthLevel, number> = {
    beginner: 10,
    novice: 30,
    intermediate: 50,
    advanced: 75,
    elite: 95,
  };
  return scores[level];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function StrengthRankings({ workoutLogs, profile, muscleGroups }: StrengthRankingsProps) {
  const gender = (!profile.gender || profile.gender === 'other') ? 'male' : profile.gender;

  const rankings = useMemo(() => {
    if (!profile.weight) return [];
    const raw = extractPersonalRecords(workoutLogs, profile.weight, gender);
    // Sort by level (strongest first), then by BW ratio descending
    return [...raw].sort((a, b) => {
      const diff = getLevelIndex(b.level) - getLevelIndex(a.level);
      if (diff !== 0) return diff;
      return b.bodyweightRatio - a.bodyweightRatio;
    });
  }, [workoutLogs, profile.weight, gender]);

  const strongestLift = useMemo(() => {
    if (rankings.length === 0) return null;
    return rankings[0]; // already sorted strongest first
  }, [rankings]);

  const averageLevel = useMemo((): StrengthLevel => {
    if (rankings.length === 0) return 'beginner';
    const avgIdx = rankings.reduce((sum, r) => sum + getLevelIndex(r.level), 0) / rankings.length;
    const roundedIdx = Math.round(avgIdx);
    return LEVEL_ORDER[Math.min(roundedIdx, LEVEL_ORDER.length - 1)];
  }, [rankings]);

  const overallScore = useMemo(() => {
    if (rankings.length === 0) return 0;
    return Math.round(rankings.reduce((sum, r) => sum + getLevelNumericScore(r.level), 0) / rankings.length);
  }, [rankings]);

  const sortedMuscles = useMemo(() => {
    if (!muscleGroups || muscleGroups.length === 0) return [];
    return [...muscleGroups].sort((a, b) => b.score - a.score);
  }, [muscleGroups]);

  // ── No bodyweight ──────────────────────────────────────────────────────

  if (!profile.weight) {
    return (
      <div className="space-y-6">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-1 ring-slate-600/50">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-200 mb-2">Bodyweight Required</p>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Add your bodyweight in the Assessment tab to see strength rankings based on science-backed standards.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── No matching exercises ──────────────────────────────────────────────

  if (rankings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-1 ring-slate-600/50">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-200 mb-2">No Rankings Yet</p>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Log workouts with compound lifts to see your strength rankings and how you compare to science-based standards.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXERCISE_STANDARDS.map((s) => (
                <span
                  key={s.exercise}
                  className="px-3 py-1.5 bg-white/5 border border-slate-700/60 rounded-full text-xs text-slate-400 font-medium"
                >
                  {s.exercise}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Still show muscle rankings if available */}
        {sortedMuscles.length > 0 && (
          <MuscleRankingsSection muscles={sortedMuscles} />
        )}
      </div>
    );
  }

  const totalStandards = EXERCISE_STANDARDS.length;
  const levelAccent = LEVEL_ACCENTS[averageLevel];

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════════════════════════════════════
          OVERALL STATS HEADER
          ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 overflow-hidden">
        {/* Top gradient accent line */}
        <div className={`h-1 bg-gradient-to-r ${levelAccent.gradient}`} />

        <div className="p-6 sm:p-8">
          {/* Centered overall badge */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br ${levelAccent.gradient} shadow-lg ${levelAccent.glow} mb-4`}>
              <span className="text-3xl font-black text-white">{overallScore}</span>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ring-1 ${STRENGTH_LEVELS[averageLevel].bgColor} ${STRENGTH_LEVELS[averageLevel].color} ${levelAccent.ring}`}>
                {STRENGTH_LEVELS[averageLevel].label} Level
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Overall Strength Score
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Exercises Ranked */}
            <div className="relative p-4 bg-white/[0.04] rounded-xl border border-slate-800/60 text-center group hover:border-slate-700/60 transition-colors">
              <div className="text-2xl font-bold text-slate-100">
                {rankings.length}<span className="text-base font-normal text-slate-500">/{totalStandards}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Exercises</p>
            </div>

            {/* Strongest Lift */}
            <div className="relative p-4 bg-white/[0.04] rounded-xl border border-slate-800/60 text-center group hover:border-slate-700/60 transition-colors">
              {strongestLift && (
                <>
                  <div className="text-sm font-bold text-slate-100 truncate">{strongestLift.exercise}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${STRENGTH_LEVELS[strongestLift.level].bgColor} ${STRENGTH_LEVELS[strongestLift.level].color} ${LEVEL_ACCENTS[strongestLift.level].ring}`}>
                    {STRENGTH_LEVELS[strongestLift.level].label}
                  </span>
                </>
              )}
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Strongest</p>
            </div>

            {/* Overall Level */}
            <div className="relative p-4 bg-white/[0.04] rounded-xl border border-slate-800/60 text-center group hover:border-slate-700/60 transition-colors">
              <div className={`text-lg font-bold ${levelAccent.text}`}>
                {STRENGTH_LEVELS[averageLevel].label}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Level</p>
            </div>

            {/* Total Workouts */}
            <div className="relative p-4 bg-white/[0.04] rounded-xl border border-slate-800/60 text-center group hover:border-slate-700/60 transition-colors">
              <div className="text-2xl font-bold text-slate-100">
                {workoutLogs.filter(l => l.completedAt).length}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wider">Workouts</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          EXERCISE STRENGTH RANKINGS
          ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 overflow-hidden">
        <div className="p-6 sm:p-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.27.308 6.023 6.023 0 0 1-2.27-.308" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Exercise Strength Rankings</h2>
              <p className="text-xs text-slate-500">
                Based on bodyweight ratios &amp; science-based standards
              </p>
            </div>
          </div>

          {/* Exercise cards */}
          <div className="space-y-4">
            {rankings.map((ranking) => {
              const levelInfo = STRENGTH_LEVELS[ranking.level];
              const accent = LEVEL_ACCENTS[ranking.level];
              const standard = EXERCISE_STANDARDS.find((s) => s.exercise === ranking.exercise);
              const thresholds = standard
                ? gender === 'female'
                  ? standard.female
                  : standard.male
                : null;
              const maxRatio = thresholds ? thresholds.elite * 1.25 : 1;
              const userPosition = Math.min((ranking.bodyweightRatio / maxRatio) * 100, 98);

              return (
                <div
                  key={ranking.exercise}
                  className={`relative bg-white/[0.03] rounded-xl border ${accent.border} p-5 transition-all hover:bg-white/[0.05]`}
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b ${accent.gradient}`} />

                  {/* Header row */}
                  <div className="flex items-center justify-between mb-4 pl-3">
                    <h3 className="text-base font-bold text-slate-100">{ranking.exercise}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ${levelInfo.bgColor} ${levelInfo.color} ${accent.ring}`}>
                      {levelInfo.label}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-5 pl-3">
                    <div className="p-2.5 bg-white/[0.04] rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-0.5">Best Lift</p>
                      <p className="text-sm font-semibold text-slate-200">
                        {ranking.bestWeight}<span className="text-xs text-slate-400">kg</span> x {ranking.bestReps}
                      </p>
                    </div>
                    <div className="p-2.5 bg-white/[0.04] rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-0.5">Est. 1RM</p>
                      <p className="text-sm font-semibold text-slate-200">
                        {ranking.estimated1RM.toFixed(1)}<span className="text-xs text-slate-400">kg</span>
                      </p>
                    </div>
                    <div className="p-2.5 bg-white/[0.04] rounded-lg text-center">
                      <p className="text-xs text-slate-500 mb-0.5">BW Ratio</p>
                      <p className={`text-sm font-bold ${accent.text}`}>
                        {ranking.bodyweightRatio.toFixed(2)}x
                      </p>
                    </div>
                  </div>

                  {/* Segmented level bar */}
                  <div className="pl-3">
                    <div className="relative mb-1.5">
                      <div className="flex h-3 rounded-full overflow-hidden gap-[3px]">
                        {LEVEL_ORDER.map((level, i) => {
                          const isAtOrPast = getLevelIndex(ranking.level) >= i;
                          return (
                            <div
                              key={level}
                              className={`flex-1 rounded-sm transition-all duration-700 ease-out ${
                                isAtOrPast ? SEGMENT_FILL[level] + '/40' : SEGMENT_BG[level]
                              }`}
                            />
                          );
                        })}
                      </div>
                      {/* User position marker */}
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full shadow-lg shadow-black/60 border-2 border-slate-900 transition-all duration-700 ease-out ${accent.bg}`}
                        style={{ left: `${userPosition}%`, marginLeft: '-7px' }}
                      />
                    </div>

                    {/* Threshold labels */}
                    {thresholds && (
                      <div className="flex text-[10px] text-slate-600 mt-1">
                        <div className="flex-1 text-center">{thresholds.beginner}x</div>
                        <div className="flex-1 text-center">{thresholds.novice}x</div>
                        <div className="flex-1 text-center">{thresholds.intermediate}x</div>
                        <div className="flex-1 text-center">{thresholds.advanced}x</div>
                        <div className="flex-1 text-center">{thresholds.elite}x</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MUSCLE DEVELOPMENT RANKINGS
          ══════════════════════════════════════════════════════════════════ */}
      {sortedMuscles.length > 0 && (
        <MuscleRankingsSection muscles={sortedMuscles} />
      )}
    </div>
  );
}

// ── Muscle Rankings Sub-Component ────────────────────────────────────────────

function MuscleRankingsSection({ muscles }: { muscles: MuscleGroup[] }) {
  const avgScore = muscles.length > 0
    ? Math.round((muscles.reduce((s, m) => s + m.score, 0) / muscles.length) * 10) / 10
    : 0;
  const avgLevel = getMuscleScoreLevel(avgScore);

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 overflow-hidden">
      {/* Top gradient accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />

      <div className="p-6 sm:p-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-100">Muscle Development Rankings</h2>
            <p className="text-xs text-slate-500">
              Based on AI physique analysis
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ring-1 ${avgLevel.bgColor} ${avgLevel.color}`}>
              Avg: {avgScore}/10
            </span>
          </div>
        </div>

        {/* Muscle cards */}
        <div className="space-y-3">
          {muscles.map((muscle) => {
            const scoreLevel = getMuscleScoreLevel(muscle.score);
            const scoreTw = getScoreTailwind(muscle.score);
            const devBadge = DEV_BADGES[muscle.development] || DEV_BADGES.balanced;
            const fillPct = (muscle.score / 10) * 100;
            const scoreHex = getScoreColor(muscle.score);

            return (
              <div
                key={muscle.name}
                className="relative bg-white/[0.03] rounded-xl border border-slate-800/50 p-4 transition-all hover:bg-white/[0.05] group"
              >
                {/* Top row: name, badges, score */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Score circle */}
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ring-1"
                      style={{
                        backgroundColor: scoreHex + '18',
                        borderColor: scoreHex + '40',
                        boxShadow: `0 0 12px ${scoreHex}15`,
                      }}
                    >
                      <span className={`text-sm font-bold ${scoreTw.text}`}>{muscle.score}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-200 truncate">{muscle.name}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${devBadge.tw}`}>
                        {devBadge.label}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ring-1 flex-shrink-0 ${scoreLevel.bgColor} ${scoreLevel.color}`}>
                    {scoreLevel.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${fillPct}%`,
                      background: `linear-gradient(90deg, ${scoreHex}90, ${scoreHex}cc)`,
                    }}
                  />
                  {/* Subtle shine effect */}
                  <div
                    className="absolute inset-y-0 left-0 rounded-full opacity-30"
                    style={{
                      width: `${fillPct}%`,
                      background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                    }}
                  />
                </div>

                {/* Notes (on hover / always visible on mobile) */}
                {muscle.notes && (
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed line-clamp-2">
                    {muscle.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
