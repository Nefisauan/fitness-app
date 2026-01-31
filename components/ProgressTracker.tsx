'use client';

import { useState } from 'react';
import { PhysiqueAnalysis } from '@/lib/types';

interface ProgressEntry {
  id: string;
  date: string;
  muscleScore: number;
  postureStatus: string;
  movementQuality: string;
  mobilityScore: number;
  stabilityScore: number;
  weight?: number;
}

interface ProgressTrackerProps {
  currentAnalysis: PhysiqueAnalysis | null;
  history: ProgressEntry[];
  onSaveEntry: (entry: ProgressEntry) => void;
}

export default function ProgressTracker({ currentAnalysis, history, onSaveEntry }: ProgressTrackerProps) {
  const [weight, setWeight] = useState('');

  const handleSave = () => {
    if (!currentAnalysis) return;

    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      muscleScore: currentAnalysis.muscle.overallScore,
      postureStatus: currentAnalysis.posture.overallPosture,
      movementQuality: currentAnalysis.movement.overallMovementQuality,
      mobilityScore: currentAnalysis.movement.mobilityScore,
      stabilityScore: currentAnalysis.movement.stabilityScore,
      weight: weight ? parseFloat(weight) : undefined,
    };

    onSaveEntry(entry);
    setWeight('');
  };

  const getChangeIndicator = (current: number, previous: number) => {
    if (current > previous) return { icon: '↑', color: 'text-green-400', label: 'Improved' };
    if (current < previous) return { icon: '↓', color: 'text-red-400', label: 'Declined' };
    return { icon: '→', color: 'text-slate-400', label: 'Maintained' };
  };

  const latestEntry = history[history.length - 1];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Progress Tracking</h2>
        <p className="text-indigo-100">Track your improvements over time. Save your current assessment to compare later.</p>
      </div>

      {/* Save Current Assessment */}
      {currentAnalysis && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Save Current Assessment</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
              <p className="text-xs text-slate-400">Muscle Score</p>
              <p className="text-xl font-bold text-blue-400">{currentAnalysis.muscle.overallScore}/10</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
              <p className="text-xs text-slate-400">Posture</p>
              <p className="text-sm font-bold text-emerald-400 capitalize">{currentAnalysis.posture.overallPosture.replace('_', ' ')}</p>
            </div>
            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center">
              <p className="text-xs text-slate-400">Mobility</p>
              <p className="text-xl font-bold text-orange-400">{currentAnalysis.movement.mobilityScore}/10</p>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-center">
              <p className="text-xs text-slate-400">Stability</p>
              <p className="text-xl font-bold text-purple-400">{currentAnalysis.movement.stabilityScore}/10</p>
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Weight (kg, optional)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-32 px-3 py-2 border border-slate-700 bg-slate-900/50 text-slate-100 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 placeholder-slate-500"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/30"
            >
              Save to Progress
            </button>
          </div>
        </div>
      )}

      {/* Progress History */}
      {history.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <h3 className="font-semibold text-slate-100 mb-4">Assessment History</h3>

          {/* Comparison with previous */}
          {history.length >= 2 && currentAnalysis && latestEntry && (
            <div className="mb-6 p-4 bg-white/5 border border-slate-800/50 rounded-xl">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Compared to Last Assessment</h4>
              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  const muscleChange = getChangeIndicator(currentAnalysis.muscle.overallScore, latestEntry.muscleScore);
                  return (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${muscleChange.color}`}>{muscleChange.icon}</p>
                      <p className="text-sm text-slate-300">Muscle Score</p>
                      <p className="text-xs text-slate-400">{muscleChange.label}</p>
                    </div>
                  );
                })()}
                {(() => {
                  const mobilityChange = getChangeIndicator(currentAnalysis.movement.mobilityScore, latestEntry.mobilityScore);
                  return (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${mobilityChange.color}`}>{mobilityChange.icon}</p>
                      <p className="text-sm text-slate-300">Mobility</p>
                      <p className="text-xs text-slate-400">{mobilityChange.label}</p>
                    </div>
                  );
                })()}
                {(() => {
                  const stabilityChange = getChangeIndicator(currentAnalysis.movement.stabilityScore, latestEntry.stabilityScore);
                  return (
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${stabilityChange.color}`}>{stabilityChange.icon}</p>
                      <p className="text-sm text-slate-300">Stability</p>
                      <p className="text-xs text-slate-400">{stabilityChange.label}</p>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Muscle</th>
                  <th className="pb-3 pr-4">Posture</th>
                  <th className="pb-3 pr-4">Mobility</th>
                  <th className="pb-3 pr-4">Stability</th>
                  <th className="pb-3">Weight</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((entry) => (
                  <tr key={entry.id} className="border-t border-slate-700/50">
                    <td className="py-3 pr-4 text-sm text-slate-100">{entry.date}</td>
                    <td className="py-3 pr-4">
                      <span className="text-sm font-medium text-blue-400">{entry.muscleScore}/10</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.postureStatus === 'good' ? 'bg-green-500/15 text-green-300' :
                        entry.postureStatus === 'fair' ? 'bg-yellow-500/15 text-yellow-300' :
                        'bg-orange-500/15 text-orange-300'
                      }`}>
                        {entry.postureStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-sm font-medium text-orange-400">{entry.mobilityScore}/10</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-sm font-medium text-purple-400">{entry.stabilityScore}/10</span>
                    </td>
                    <td className="py-3">
                      {entry.weight ? (
                        <span className="text-sm text-slate-300">{entry.weight} kg</span>
                      ) : (
                        <span className="text-sm text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-8 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-100 mb-2">No Progress Data Yet</h3>
          <p className="text-sm text-slate-400">
            Complete your first assessment and save it to start tracking your progress over time.
          </p>
        </div>
      )}
    </div>
  );
}
