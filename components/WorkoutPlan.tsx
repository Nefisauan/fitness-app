'use client';

import { useState } from 'react';
import { WorkoutPlan as WorkoutPlanType, WorkoutDay, Exercise } from '@/lib/types';

interface WorkoutPlanProps {
  plan: WorkoutPlanType;
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const purposeColors: Record<string, string> = {
    strength: 'bg-red-100 text-red-700',
    hypertrophy: 'bg-blue-100 text-blue-700',
    mobility: 'bg-green-100 text-green-700',
    stability: 'bg-purple-100 text-purple-700',
    warmup: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        expanded ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-gray-900">{exercise.name}</h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${purposeColors[exercise.purpose]}`}>
              {exercise.purpose}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {exercise.sets} sets × {exercise.reps} • Rest: {exercise.rest}
          </p>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Target Muscles</p>
              <p className="font-medium text-gray-900">{exercise.targetMuscles.join(', ')}</p>
            </div>
            {exercise.tempo && (
              <div>
                <p className="text-gray-500">Tempo</p>
                <p className="font-medium text-gray-900">{exercise.tempo}</p>
              </div>
            )}
          </div>
          {exercise.notes && (
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm text-gray-600">{exercise.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DaySection({ day }: { day: WorkoutDay }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{day.day}</h3>
            <p className="text-sm text-gray-500">{day.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{day.estimatedDuration} min</span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Warmup */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
              </span>
              Warmup
            </h4>
            <div className="space-y-2">
              {day.warmup.map((exercise, i) => (
                <ExerciseCard key={i} exercise={exercise} index={i} />
              ))}
            </div>
          </div>

          {/* Main Workout */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              Main Workout
            </h4>
            <div className="space-y-2">
              {day.mainWorkout.map((exercise, i) => (
                <ExerciseCard key={i} exercise={exercise} index={i} />
              ))}
            </div>
          </div>

          {/* Cooldown */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              Cooldown
            </h4>
            <div className="space-y-2">
              {day.cooldown.map((exercise, i) => (
                <ExerciseCard key={i} exercise={exercise} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutPlan({ plan }: WorkoutPlanProps) {
  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="text-emerald-100 mt-2 max-w-2xl">{plan.description}</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">{plan.daysPerWeek}</p>
            <p className="text-sm text-emerald-100">Days/Week</p>
          </div>
        </div>
      </div>

      {/* Workout Days */}
      <div className="space-y-4">
        {plan.schedule.map((day, index) => (
          <DaySection key={index} day={day} />
        ))}
      </div>

      {/* Modifications */}
      {plan.modifications.length > 0 && (
        <div className="bg-amber-50 rounded-2xl p-6">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Modifications Based on Your Input
          </h3>
          <ul className="space-y-2">
            {plan.modifications.map((mod, index) => (
              <li key={index} className="flex items-start gap-2 text-amber-700">
                <span className="text-amber-500 mt-1">•</span>
                <span>{mod}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progression Notes */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Progression Guidelines
        </h3>
        <div className="prose prose-sm text-gray-600 max-w-none">
          {plan.progressionNotes.split('\n').map((line, i) => (
            <p key={i} className="mb-1">{line.replace(/^- /, '• ')}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
