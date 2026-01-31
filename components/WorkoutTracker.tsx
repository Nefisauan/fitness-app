'use client';

import { useState, useEffect } from 'react';
import { WorkoutPlan, WorkoutLog, WorkoutStreak, ExerciseLog, SetLog } from '@/lib/types';

interface ActiveWorkout {
  dayIndex: number;
  logId: string;
  exercises: ExerciseLog[];
  startedAt: string;
}

interface WorkoutTrackerProps {
  plan: WorkoutPlan;
  workoutLogs: WorkoutLog[];
  streak: WorkoutStreak;
  nextDayIndex: number;
  activeWorkout: ActiveWorkout | null;
  onStartWorkout: (dayIndex: number) => void;
  onLogSet: (exerciseIndex: number, set: SetLog) => void;
  onCompleteExercise: (exerciseIndex: number) => void;
  onSkipExercise: (exerciseIndex: number) => void;
  onCompleteWorkout: (notes?: string) => void;
  onCancelWorkout: () => void;
}

function StreakHeader({ streak, daysPerWeek }: { streak: WorkoutStreak; daysPerWeek: number }) {
  const dots = Array.from({ length: daysPerWeek }, (_, i) => i < streak.thisWeekCount);

  return (
    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white">
      <h2 className="text-xl font-bold mb-4">Workout Tracker</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-3xl font-bold">{streak.currentStreak}</p>
          <p className="text-sm text-orange-100">Day Streak</p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
          <p className="text-3xl font-bold">{streak.totalWorkouts}</p>
          <p className="text-sm text-orange-100">Total Logged</p>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
          <div className="flex justify-center gap-1.5 mb-1">
            {dots.map((filled, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${filled ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
          <p className="text-sm text-orange-100">This Week</p>
        </div>
      </div>
    </div>
  );
}

function TodaysWorkout({
  plan,
  nextDayIndex,
  onStart,
}: {
  plan: WorkoutPlan;
  nextDayIndex: number;
  onStart: (dayIndex: number) => void;
}) {
  const day = plan.schedule[nextDayIndex];
  if (!day) return null;

  const totalExercises = day.warmup.length + day.mainWorkout.length + day.cooldown.length;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Next Workout</h3>
          <p className="text-sm text-slate-400">{day.day} — {day.focus}</p>
        </div>
        <div className="text-right text-sm text-slate-400">
          <p>{totalExercises} exercises</p>
          <p>~{day.estimatedDuration} min</p>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        {day.mainWorkout.slice(0, 4).map((ex, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-medium">
              {i + 1}
            </span>
            <span className="text-slate-300">{ex.name}</span>
            <span className="text-slate-500 ml-auto">{ex.sets}×{ex.reps}</span>
          </div>
        ))}
        {day.mainWorkout.length > 4 && (
          <p className="text-xs text-slate-500 pl-8">+{day.mainWorkout.length - 4} more exercises</p>
        )}
      </div>

      <button
        onClick={() => onStart(nextDayIndex)}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/50"
      >
        Start Workout
      </button>
    </div>
  );
}

function ActiveWorkoutView({
  workout,
  plan,
  onLogSet,
  onCompleteExercise,
  onSkipExercise,
  onComplete,
  onCancel,
}: {
  workout: ActiveWorkout;
  plan: WorkoutPlan;
  onLogSet: (exerciseIndex: number, set: SetLog) => void;
  onCompleteExercise: (exerciseIndex: number) => void;
  onSkipExercise: (exerciseIndex: number) => void;
  onComplete: (notes?: string) => void;
  onCancel: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [workoutNotes, setWorkoutNotes] = useState('');
  const day = plan.schedule[workout.dayIndex];

  useEffect(() => {
    const startMs = new Date(workout.startedAt).getTime();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startMs) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [workout.startedAt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const completedCount = workout.exercises.filter((e) => e.completed || e.skipped).length;
  const totalCount = workout.exercises.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const sectionLabels: Record<string, string> = {
    warmup: 'Warm-up',
    main: 'Main Workout',
    cooldown: 'Cool-down',
  };

  const sections = ['warmup', 'main', 'cooldown'] as const;

  return (
    <div className="space-y-4">
      {/* Timer & Progress */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{day?.day} — {day?.focus}</p>
            <p className="text-3xl font-bold text-slate-100 font-mono">{formatTime(elapsed)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">{completedCount}/{totalCount} exercises</p>
            <div className="w-32 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercises by section */}
      {sections.map((section) => {
        const sectionExercises = workout.exercises
          .map((ex, idx) => ({ ex, idx }))
          .filter(({ ex }) => ex.section === section);

        if (sectionExercises.length === 0) return null;

        return (
          <div key={section}>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-2 px-1">
              {sectionLabels[section]}
            </h3>
            <div className="space-y-3">
              {sectionExercises.map(({ ex, idx }) => (
                <ExerciseCard
                  key={idx}
                  exercise={ex}
                  exerciseIndex={idx}
                  onLogSet={onLogSet}
                  onComplete={() => onCompleteExercise(idx)}
                  onSkip={() => onSkipExercise(idx)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Notes & Complete */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-4 space-y-3">
        <textarea
          value={workoutNotes}
          onChange={(e) => setWorkoutNotes(e.target.value)}
          placeholder="Workout notes (optional)"
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm resize-none"
          rows={2}
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(workoutNotes || undefined)}
            className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/50"
          >
            Complete Workout
          </button>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({
  exercise,
  exerciseIndex,
  onLogSet,
  onComplete,
  onSkip,
}: {
  exercise: ExerciseLog;
  exerciseIndex: number;
  onLogSet: (exerciseIndex: number, set: SetLog) => void;
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [expanded, setExpanded] = useState(!exercise.completed && !exercise.skipped);
  const allSetsCompleted = exercise.actual.every((s) => s.completed);

  return (
    <div
      className={`bg-white/5 backdrop-blur-xl rounded-xl border shadow-lg shadow-black/30 overflow-hidden transition-all ${
        exercise.completed
          ? 'border-green-500/30 bg-green-500/5'
          : exercise.skipped
          ? 'border-slate-700/30 opacity-50'
          : 'border-slate-700/50'
      }`}
    >
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0 ${
            exercise.completed
              ? 'bg-green-500/20 text-green-300'
              : exercise.skipped
              ? 'bg-slate-700 text-slate-500'
              : 'bg-cyan-500/20 text-cyan-300'
          }`}
        >
          {exercise.completed ? '✓' : exercise.skipped ? '—' : exerciseIndex + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-100 truncate">{exercise.exerciseName}</p>
          <p className="text-xs text-slate-400">
            {exercise.planned.sets} sets × {exercise.planned.reps}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && !exercise.completed && !exercise.skipped && (
        <div className="px-4 pb-4 space-y-2">
          {/* Set rows */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center text-xs text-slate-400 px-1">
            <span>Set</span>
            <span>Weight (kg)</span>
            <span>Reps</span>
            <span></span>
          </div>
          {exercise.actual.map((set) => (
            <div
              key={set.setNumber}
              className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center"
            >
              <span className="w-6 text-center text-sm text-slate-500">{set.setNumber}</span>
              <input
                type="number"
                inputMode="decimal"
                value={set.weight ?? ''}
                onChange={(e) =>
                  onLogSet(exerciseIndex, {
                    ...set,
                    weight: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                placeholder="0"
                className="h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 text-sm placeholder-slate-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
              />
              <input
                type="number"
                inputMode="numeric"
                value={set.reps ?? ''}
                onChange={(e) =>
                  onLogSet(exerciseIndex, {
                    ...set,
                    reps: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="0"
                className="h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 text-sm placeholder-slate-600 focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
              />
              <button
                onClick={() =>
                  onLogSet(exerciseIndex, { ...set, completed: !set.completed })
                }
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  set.completed
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
              >
                ✓
              </button>
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onSkip}
              className="px-3 py-1.5 text-xs text-slate-400 border border-slate-700 rounded-lg hover:bg-white/5"
            >
              Skip
            </button>
            {allSetsCompleted && (
              <button
                onClick={onComplete}
                className="px-3 py-1.5 text-xs bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutHistory({ logs }: { logs: WorkoutLog[] }) {
  const completedLogs = logs.filter((l) => l.completedAt);

  if (completedLogs.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6 text-center">
        <p className="text-slate-400">No workouts logged yet. Start your first workout above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-4">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Recent Workouts</h3>
      <div className="space-y-2">
        {completedLogs.slice(0, 10).map((log) => {
          const completed = log.exercises.filter((e) => e.completed).length;
          const total = log.exercises.length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          const date = log.startedAt.split('T')[0];

          return (
            <div key={log.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-sm font-medium">
                {pct}%
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100 truncate">{log.workoutFocus}</p>
                <p className="text-xs text-slate-400">{date}</p>
              </div>
              {log.durationMinutes && (
                <span className="text-xs text-slate-500">{log.durationMinutes} min</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WorkoutTracker({
  plan,
  workoutLogs,
  streak,
  nextDayIndex,
  activeWorkout,
  onStartWorkout,
  onLogSet,
  onCompleteExercise,
  onSkipExercise,
  onCompleteWorkout,
  onCancelWorkout,
}: WorkoutTrackerProps) {
  return (
    <div className="space-y-6">
      <StreakHeader streak={streak} daysPerWeek={plan.daysPerWeek} />

      {activeWorkout ? (
        <ActiveWorkoutView
          workout={activeWorkout}
          plan={plan}
          onLogSet={onLogSet}
          onCompleteExercise={onCompleteExercise}
          onSkipExercise={onSkipExercise}
          onComplete={onCompleteWorkout}
          onCancel={onCancelWorkout}
        />
      ) : (
        <TodaysWorkout plan={plan} nextDayIndex={nextDayIndex} onStart={onStartWorkout} />
      )}

      <WorkoutHistory logs={workoutLogs} />
    </div>
  );
}
