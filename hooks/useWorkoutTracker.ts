'use client';

import { useState, useEffect, useCallback, useMemo, MutableRefObject } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO, differenceInCalendarDays } from 'date-fns';
import { WorkoutPlan, WorkoutLog, ExerciseLog, SetLog, WorkoutStreak } from '@/lib/types';
import { loadWorkoutLogs, saveWorkoutLog, updateWorkoutLog } from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';

interface ActiveWorkout {
  dayIndex: number;
  logId: string;
  exercises: ExerciseLog[];
  startedAt: string;
}

export function useWorkoutTracker(
  supabaseRef: MutableRefObject<ReturnType<typeof createClient> | null>,
  userId: string | null,
  assessmentId: string | null,
  workoutPlan: WorkoutPlan | null
) {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load logs on mount
  useEffect(() => {
    if (!userId || !supabaseRef.current) return;
    setIsLoading(true);
    loadWorkoutLogs(supabaseRef.current, userId).then((logs) => {
      setWorkoutLogs(logs);
      // Restore in-progress workout if any
      const inProgress = logs.find((l) => !l.completedAt);
      if (inProgress) {
        setActiveWorkout({
          dayIndex: inProgress.workoutDayIndex,
          logId: inProgress.id,
          exercises: inProgress.exercises,
          startedAt: inProgress.startedAt,
        });
      }
      setIsLoading(false);
    });
  }, [userId, supabaseRef]);

  // Compute next workout day index
  const nextDayIndex = useMemo(() => {
    if (!workoutPlan) return 0;
    const completedLogs = workoutLogs.filter((l) => l.completedAt);
    if (completedLogs.length === 0) return 0;
    const lastIndex = completedLogs[0]?.workoutDayIndex ?? 0; // logs are desc
    return (lastIndex + 1) % workoutPlan.schedule.length;
  }, [workoutLogs, workoutPlan]);

  // Compute streak
  const streak = useMemo<WorkoutStreak>(() => {
    const completedLogs = workoutLogs.filter((l) => l.completedAt);
    const total = completedLogs.length;

    if (total === 0) {
      return { currentStreak: 0, longestStreak: 0, totalWorkouts: 0, thisWeekCount: 0, lastWorkoutDate: null };
    }

    // This week count
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const thisWeek = completedLogs.filter((l) => {
      const d = parseISO(l.startedAt);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    });

    // Get unique workout dates sorted descending
    const uniqueDates = [...new Set(completedLogs.map((l) => l.startedAt.split('T')[0]))].sort().reverse();
    const lastWorkoutDate = uniqueDates[0] || null;

    // Compute streak: consecutive days with workouts (allowing gaps matching rest days)
    // Simple approach: count days where there was a workout, allowing up to 2-day gaps
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        // Check if last workout was within 2 days of today
        const daysDiff = differenceInCalendarDays(now, parseISO(uniqueDates[0]));
        if (daysDiff > 2) {
          tempStreak = 0;
        } else {
          tempStreak = 1;
        }
      } else {
        const prev = parseISO(uniqueDates[i - 1]);
        const curr = parseISO(uniqueDates[i]);
        const gap = differenceInCalendarDays(prev, curr);
        if (gap <= 2) {
          tempStreak++;
        } else {
          if (currentStreak === 0) currentStreak = tempStreak;
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    if (currentStreak === 0) currentStreak = tempStreak;
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      totalWorkouts: total,
      thisWeekCount: thisWeek.length,
      lastWorkoutDate,
    };
  }, [workoutLogs]);

  const startWorkout = useCallback(
    async (dayIndex: number) => {
      if (!userId || !supabaseRef.current || !workoutPlan) return;

      const day = workoutPlan.schedule[dayIndex];
      if (!day) return;

      const exercises: ExerciseLog[] = [
        ...day.warmup.map((ex) => buildExerciseLog(ex, 'warmup')),
        ...day.mainWorkout.map((ex) => buildExerciseLog(ex, 'main')),
        ...day.cooldown.map((ex) => buildExerciseLog(ex, 'cooldown')),
      ];

      const startedAt = new Date().toISOString();
      const logId = await saveWorkoutLog(supabaseRef.current, userId, {
        assessmentId: assessmentId ?? undefined,
        workoutDayIndex: dayIndex,
        workoutDayLabel: day.day,
        workoutFocus: day.focus,
        exercises,
        startedAt,
      });

      if (logId) {
        setActiveWorkout({ dayIndex, logId, exercises, startedAt });
      }
    },
    [userId, supabaseRef, workoutPlan, assessmentId]
  );

  const updateExercises = useCallback(
    async (updatedExercises: ExerciseLog[]) => {
      if (!activeWorkout || !supabaseRef.current) return;
      setActiveWorkout((prev) => (prev ? { ...prev, exercises: updatedExercises } : null));
      await updateWorkoutLog(supabaseRef.current, activeWorkout.logId, { exercises: updatedExercises });
    },
    [activeWorkout, supabaseRef]
  );

  const logSet = useCallback(
    async (exerciseIndex: number, set: SetLog) => {
      if (!activeWorkout) return;
      const updated = [...activeWorkout.exercises];
      const exercise = { ...updated[exerciseIndex] };
      const setIdx = exercise.actual.findIndex((s) => s.setNumber === set.setNumber);
      if (setIdx >= 0) {
        exercise.actual = [...exercise.actual];
        exercise.actual[setIdx] = set;
      } else {
        exercise.actual = [...exercise.actual, set];
      }
      updated[exerciseIndex] = exercise;
      await updateExercises(updated);
    },
    [activeWorkout, updateExercises]
  );

  const completeExercise = useCallback(
    async (exerciseIndex: number) => {
      if (!activeWorkout) return;
      const updated = [...activeWorkout.exercises];
      updated[exerciseIndex] = { ...updated[exerciseIndex], completed: true };
      await updateExercises(updated);
    },
    [activeWorkout, updateExercises]
  );

  const skipExercise = useCallback(
    async (exerciseIndex: number) => {
      if (!activeWorkout) return;
      const updated = [...activeWorkout.exercises];
      updated[exerciseIndex] = { ...updated[exerciseIndex], skipped: true };
      await updateExercises(updated);
    },
    [activeWorkout, updateExercises]
  );

  const completeWorkout = useCallback(
    async (notes?: string) => {
      if (!activeWorkout || !supabaseRef.current) return;
      const completedAt = new Date().toISOString();
      const startMs = new Date(activeWorkout.startedAt).getTime();
      const durationMinutes = Math.round((Date.now() - startMs) / 60000);

      await updateWorkoutLog(supabaseRef.current, activeWorkout.logId, {
        exercises: activeWorkout.exercises,
        completedAt,
        durationMinutes,
        notes,
      });

      const completedLog: WorkoutLog = {
        id: activeWorkout.logId,
        assessmentId: assessmentId ?? undefined,
        workoutDayIndex: activeWorkout.dayIndex,
        workoutDayLabel: '',
        workoutFocus: '',
        exercises: activeWorkout.exercises,
        startedAt: activeWorkout.startedAt,
        completedAt,
        durationMinutes,
        notes,
        createdAt: activeWorkout.startedAt,
      };

      setWorkoutLogs((prev) => [completedLog, ...prev.filter((l) => l.id !== activeWorkout.logId)]);
      setActiveWorkout(null);
    },
    [activeWorkout, supabaseRef, assessmentId]
  );

  const cancelWorkout = useCallback(async () => {
    setActiveWorkout(null);
  }, []);

  return {
    workoutLogs,
    activeWorkout,
    streak,
    nextDayIndex,
    isLoading,
    startWorkout,
    logSet,
    completeExercise,
    skipExercise,
    completeWorkout,
    cancelWorkout,
  };
}

function buildExerciseLog(
  ex: { name: string; sets: number; reps: string },
  section: 'warmup' | 'main' | 'cooldown'
): ExerciseLog {
  return {
    exerciseName: ex.name,
    section,
    planned: { sets: ex.sets, reps: ex.reps },
    actual: Array.from({ length: ex.sets }, (_, i) => ({
      setNumber: i + 1,
      reps: null,
      weight: null,
      completed: false,
    })),
    completed: false,
    skipped: false,
  };
}
