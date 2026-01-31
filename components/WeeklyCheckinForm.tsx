'use client';

import { useState } from 'react';
import { WeeklyCheckin, BodyMeasurements } from '@/lib/types';

interface WeeklyCheckinFormProps {
  onSave: (checkin: Omit<WeeklyCheckin, 'id' | 'createdAt'>) => Promise<void>;
  lastCheckin: WeeklyCheckin | null;
  onCancel?: () => void;
}

const ratingLabels = [
  { key: 'energyRating' as const, label: 'Energy', emoji: '⚡' },
  { key: 'sorenessRating' as const, label: 'Soreness', emoji: '💪' },
  { key: 'sleepRating' as const, label: 'Sleep Quality', emoji: '😴' },
  { key: 'motivationRating' as const, label: 'Motivation', emoji: '🔥' },
];

const measurementFields: { key: keyof BodyMeasurements; label: string }[] = [
  { key: 'chest', label: 'Chest (cm)' },
  { key: 'waist', label: 'Waist (cm)' },
  { key: 'hips', label: 'Hips (cm)' },
  { key: 'arms', label: 'Arms (cm)' },
  { key: 'thighs', label: 'Thighs (cm)' },
];

export default function WeeklyCheckinForm({ onSave, lastCheckin, onCancel }: WeeklyCheckinFormProps) {
  const [weight, setWeight] = useState(lastCheckin?.weight?.toString() || '');
  const [measurements, setMeasurements] = useState<BodyMeasurements>(lastCheckin?.measurements || {});
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [ratings, setRatings] = useState({
    energyRating: lastCheckin?.energyRating || 0,
    sorenessRating: lastCheckin?.sorenessRating || 0,
    sleepRating: lastCheckin?.sleepRating || 0,
    motivationRating: lastCheckin?.motivationRating || 0,
  });
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const checkin: Omit<WeeklyCheckin, 'id' | 'createdAt'> = {
      checkinDate: new Date().toISOString().split('T')[0],
      weight: weight ? parseFloat(weight) : undefined,
      measurements,
      energyRating: ratings.energyRating || undefined,
      sorenessRating: ratings.sorenessRating || undefined,
      sleepRating: ratings.sleepRating || undefined,
      motivationRating: ratings.motivationRating || undefined,
      notes: notes || undefined,
    };
    await onSave(checkin);
    setSaving(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-100 mb-1">Weekly Check-in</h3>
        <p className="text-sm text-slate-400">Quick update on how you're doing this week</p>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>
        <input
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder={lastCheckin?.weight ? `Last: ${lastCheckin.weight}` : '70'}
          className="w-40 h-11 px-4 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
      </div>

      {/* Measurements (collapsible) */}
      <div>
        <button
          onClick={() => setShowMeasurements(!showMeasurements)}
          className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
        >
          <svg
            className={`w-4 h-4 transition-transform ${showMeasurements ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Body Measurements (optional)
        </button>
        {showMeasurements && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {measurementFields.map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={measurements[key] ?? ''}
                  onChange={(e) =>
                    setMeasurements((prev) => ({
                      ...prev,
                      [key]: e.target.value ? parseFloat(e.target.value) : undefined,
                    }))
                  }
                  placeholder={lastCheckin?.measurements?.[key]?.toString() || '-'}
                  className="w-full h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-300">How are you feeling?</label>
        {ratingLabels.map(({ key, label, emoji }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="text-lg">{emoji}</span>
            <span className="text-sm text-slate-300 w-28">{label}</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setRatings((prev) => ({ ...prev, [key]: val }))}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    ratings[key] >= val
                      ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How's training going? Any wins or challenges?"
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm resize-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 border border-slate-700 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex-1 py-2.5 rounded-xl font-semibold text-white transition-all ${
            saving
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-lg shadow-violet-500/50'
          }`}
        >
          {saving ? 'Saving...' : 'Save Check-in'}
        </button>
      </div>
    </div>
  );
}
