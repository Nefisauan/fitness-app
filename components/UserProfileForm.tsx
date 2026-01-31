'use client';

import { UserProfile, PainDiscomfort, FitnessGoal, WorkoutSplit, MuscleTarget } from '@/lib/types';

interface UserProfileFormProps {
  profile: UserProfile;
  painAreas: PainDiscomfort;
  onProfileChange: (profile: UserProfile) => void;
  onPainAreasChange: (painAreas: PainDiscomfort) => void;
}

const goals: { id: FitnessGoal; label: string; description: string; icon: string }[] = [
  { id: 'lean', label: 'Get Lean', description: 'Reduce body fat while preserving muscle', icon: '🔥' },
  { id: 'bulk', label: 'Bulk Up', description: 'Build maximum muscle mass', icon: '💪' },
  { id: 'aesthetic', label: 'Aesthetic', description: 'Build balanced, defined physique', icon: '✨' },
  { id: 'recomp', label: 'Recomp', description: 'Build muscle while losing fat', icon: '🔄' },
  { id: 'posture', label: 'Posture & Movement', description: 'Improve posture and mobility', icon: '🧘' },
];

const activityLevels = [
  { id: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { id: 'light', label: 'Light', description: '1-3 days/week' },
  { id: 'moderate', label: 'Moderate', description: '3-5 days/week' },
  { id: 'active', label: 'Active', description: '6-7 days/week' },
  { id: 'very_active', label: 'Very Active', description: 'Athlete level' },
];

const trainingLevels = [
  { id: 'beginner', label: 'Beginner', description: '< 1 year training' },
  { id: 'intermediate', label: 'Intermediate', description: '1-3 years training' },
  { id: 'advanced', label: 'Advanced', description: '3+ years training' },
];

const painAreasList: { id: keyof PainDiscomfort; label: string }[] = [
  { id: 'lowerBack', label: 'Lower Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'knees', label: 'Knees' },
  { id: 'neck', label: 'Neck' },
  { id: 'hips', label: 'Hips' },
  { id: 'ankles', label: 'Ankles' },
  { id: 'wrists', label: 'Wrists' },
];

const splitOptions: { id: WorkoutSplit; label: string; description: string; icon: string }[] = [
  { id: 'recommended', label: 'Recommended', description: 'Auto-select based on your goal & level', icon: '✨' },
  { id: 'full_body', label: 'Full Body', description: '3 days/week, great for beginners', icon: '🏋️' },
  { id: 'upper_lower', label: 'Upper / Lower', description: '4 days/week, balanced volume & recovery', icon: '🔄' },
  { id: 'ppl', label: 'Push / Pull / Legs', description: '6 days/week, high volume for advanced', icon: '💪' },
  { id: 'arnold', label: 'Arnold Split', description: '6 days/week, chest+back / shoulders+arms / legs', icon: '🏆' },
  { id: 'ppl_ul', label: 'PPL + Upper/Lower', description: '5 days/week, hybrid for growth', icon: '🔥' },
];

const musclePriorityOptions: { id: MuscleTarget; label: string }[] = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'arms', label: 'Arms' },
  { id: 'quads', label: 'Quads' },
  { id: 'hamstrings', label: 'Hamstrings' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'core', label: 'Core / Abs' },
  { id: 'calves', label: 'Calves' },
];

export default function UserProfileForm({
  profile,
  painAreas,
  onProfileChange,
  onPainAreasChange,
}: UserProfileFormProps) {
  const updateProfile = (updates: Partial<UserProfile>) => {
    onProfileChange({ ...profile, ...updates });
  };

  const togglePainArea = (area: keyof PainDiscomfort) => {
    onPainAreasChange({ ...painAreas, [area]: !painAreas[area] });
  };

  const toggleMusclePriority = (muscle: MuscleTarget) => {
    const current = profile.musclePriorities || [];
    const updated = current.includes(muscle)
      ? current.filter(m => m !== muscle)
      : [...current, muscle];
    updateProfile({ musclePriorities: updated });
  };

  return (
    <div className="space-y-6">
      {/* Goal Selection */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/30 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Your Goal</h2>
            <p className="text-sm text-slate-400">What do you want to achieve?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {goals.map(goal => (
            <button
              key={goal.id}
              onClick={() => updateProfile({ goal: goal.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                profile.goal === goal.id
                  ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                  : 'border-slate-700 hover:border-slate-600 bg-white/5'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <p className="font-medium text-slate-100 mt-2">{goal.label}</p>
              <p className="text-xs text-slate-400 mt-1">{goal.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Body Stats */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/30 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Body Stats</h2>
            <p className="text-sm text-slate-400">Help us calculate your targets</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
            <input
              type="number"
              value={profile.age || ''}
              onChange={(e) => updateProfile({ age: parseInt(e.target.value) || undefined })}
              placeholder="25"
              className="w-full px-3 py-2 border bg-slate-900/50 border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Gender</label>
            <select
              value={profile.gender || ''}
              onChange={(e) => updateProfile({ gender: e.target.value as UserProfile['gender'] })}
              className="w-full px-3 py-2 border bg-slate-900/50 border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Height (cm)</label>
            <input
              type="number"
              value={profile.height || ''}
              onChange={(e) => updateProfile({ height: parseInt(e.target.value) || undefined })}
              placeholder="175"
              className="w-full px-3 py-2 border bg-slate-900/50 border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg)</label>
            <input
              type="number"
              value={profile.weight || ''}
              onChange={(e) => updateProfile({ weight: parseInt(e.target.value) || undefined })}
              placeholder="70"
              className="w-full px-3 py-2 border bg-slate-900/50 border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Activity Level</label>
            <div className="grid grid-cols-5 gap-2">
              {activityLevels.map(level => (
                <button
                  key={level.id}
                  onClick={() => updateProfile({ activityLevel: level.id as UserProfile['activityLevel'] })}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    profile.activityLevel === level.id
                      ? 'border-blue-400 bg-blue-500/10 text-blue-300 shadow-lg shadow-blue-500/20'
                      : 'border-slate-700 hover:border-slate-600 bg-white/5 text-slate-300'
                  }`}
                  title={level.description}
                >
                  <span className="text-xs font-medium">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Training Experience</label>
            <div className="grid grid-cols-3 gap-2">
              {trainingLevels.map(level => (
                <button
                  key={level.id}
                  onClick={() => updateProfile({ trainingHistory: level.id as UserProfile['trainingHistory'] })}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    profile.trainingHistory === level.id
                      ? 'border-blue-400 bg-blue-500/10 text-blue-300 shadow-lg shadow-blue-500/20'
                      : 'border-slate-700 hover:border-slate-600 bg-white/5 text-slate-300'
                  }`}
                >
                  <span className="text-xs font-medium">{level.label}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Average Sleep (hours/night)
          </label>
          <input
            type="number"
            value={profile.sleepHours || ''}
            onChange={(e) => updateProfile({ sleepHours: parseFloat(e.target.value) || undefined })}
            placeholder="7"
            min="4"
            max="12"
            step="0.5"
            className="w-32 px-3 py-2 border bg-slate-900/50 border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Pain/Discomfort Areas */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Pain or Discomfort</h2>
            <p className="text-sm text-slate-400">Select any areas where you experience issues (optional)</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {painAreasList.map(area => (
            <button
              key={area.id}
              onClick={() => togglePainArea(area.id)}
              className={`px-4 py-2 rounded-full border transition-all ${
                painAreas[area.id]
                  ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-lg shadow-amber-500/20'
                  : 'border-slate-700 hover:border-slate-600 text-slate-300 bg-white/5'
              }`}
            >
              {painAreas[area.id] && (
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {area.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 mt-4">
          This helps us recommend appropriate exercises and modifications. Always consult a healthcare
          provider for persistent pain or injuries.
        </p>
      </div>

      {/* Muscle Priorities */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-500/30 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Muscle Priorities</h2>
            <p className="text-sm text-slate-400">Select muscles you want to prioritize for extra volume (optional)</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {musclePriorityOptions.map(muscle => {
            const isSelected = (profile.musclePriorities || []).includes(muscle.id);
            return (
              <button
                key={muscle.id}
                onClick={() => toggleMusclePriority(muscle.id)}
                className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                  isSelected
                    ? 'border-rose-400 bg-rose-500/10 text-rose-300 shadow-lg shadow-rose-500/20'
                    : 'border-slate-700 hover:border-slate-600 text-slate-300 bg-white/5'
                }`}
              >
                {isSelected && (
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {muscle.label}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Selected muscles get additional isolation exercises and higher weekly volume.
          Leave empty to train all muscle groups with equal priority.
        </p>
      </div>

      {/* Preferred Split */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-violet-500/30 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Preferred Split</h2>
            <p className="text-sm text-slate-400">Choose your workout structure</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {splitOptions.map(split => (
            <button
              key={split.id}
              onClick={() => updateProfile({ splitPreference: split.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                profile.splitPreference === split.id
                  ? 'border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/20'
                  : 'border-slate-700 hover:border-slate-600 bg-white/5'
              }`}
            >
              <span className="text-2xl">{split.icon}</span>
              <p className="font-medium text-slate-100 mt-2 text-sm">{split.label}</p>
              <p className="text-xs text-slate-400 mt-1">{split.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
