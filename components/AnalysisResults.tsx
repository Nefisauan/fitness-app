'use client';

import { PhysiqueAnalysis } from '@/lib/types';

interface AnalysisResultsProps {
  analysis: PhysiqueAnalysis;
}

function ScoreBar({ score, maxScore = 10, color }: { score: number; maxScore?: number; color: string }) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-slate-300 w-8">{score}/{maxScore}</span>
    </div>
  );
}

function DevelopmentBadge({ development }: { development: string }) {
  const colors: Record<string, string> = {
    underdeveloped: 'bg-amber-500/15 text-amber-300',
    balanced: 'bg-green-500/15 text-green-300',
    well_developed: 'bg-blue-500/15 text-blue-300',
    overdominant: 'bg-purple-500/15 text-purple-300',
  };

  const labels: Record<string, string> = {
    underdeveloped: 'Needs Work',
    balanced: 'Balanced',
    well_developed: 'Well Developed',
    overdominant: 'Overdominant',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[development] || 'bg-slate-700 text-slate-300'}`}>
      {labels[development] || development}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    mild: 'bg-yellow-500/15 text-yellow-300',
    moderate: 'bg-orange-500/15 text-orange-300',
    notable: 'bg-red-500/15 text-red-300',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[severity] || 'bg-slate-700 text-slate-300'}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl shadow-violet-500/30">
        <h2 className="text-xl font-bold mb-3">Analysis Summary</h2>
        <p className="text-violet-100">{analysis.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Muscle Analysis */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Muscle Development</h3>
                <p className="text-sm text-slate-400">Symmetry & balance assessment</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{analysis.muscle.overallScore}/10</p>
              <p className="text-xs text-slate-400">Overall Score</p>
            </div>
          </div>

          {/* Symmetry Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Left/Right</p>
              <p className="font-medium text-sm capitalize">{analysis.muscle.symmetry.leftRight.replace('_', ' ')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Upper/Lower</p>
              <p className="font-medium text-sm capitalize">{analysis.muscle.symmetry.upperLower.replace('_', ' ')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Front/Back</p>
              <p className="font-medium text-sm capitalize">{analysis.muscle.symmetry.frontBack.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Muscle Groups */}
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {analysis.muscle.groups.map((group, index) => (
              <div key={index} className="pb-3 border-b border-slate-700/50 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-100">{group.name}</span>
                  <DevelopmentBadge development={group.development} />
                </div>
                <ScoreBar score={group.score} color="bg-blue-500" />
                {group.notes && (
                  <p className="text-xs text-slate-400 mt-1">{group.notes}</p>
                )}
              </div>
            ))}
          </div>

          {/* Priority Areas */}
          {analysis.muscle.priorityAreas.length > 0 && (
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm font-medium text-amber-300 mb-2">Priority Areas to Develop</p>
              <div className="flex flex-wrap gap-2">
                {analysis.muscle.priorityAreas.map((area, index) => (
                  <span key={index} className="px-3 py-1 bg-amber-500/15 text-amber-300 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Postural Analysis */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Postural Indicators</h3>
                <p className="text-sm text-slate-400">Alignment & structural patterns</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              analysis.posture.overallPosture === 'good'
                ? 'bg-green-500/15 text-green-300'
                : analysis.posture.overallPosture === 'fair'
                ? 'bg-yellow-500/15 text-yellow-300'
                : 'bg-orange-500/15 text-orange-300'
            }`}>
              {analysis.posture.overallPosture === 'good' ? 'Good Posture' :
               analysis.posture.overallPosture === 'fair' ? 'Fair Posture' : 'Needs Attention'}
            </span>
          </div>

          {analysis.posture.indicators.length > 0 ? (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {analysis.posture.indicators.map((indicator, index) => (
                <div key={index} className="p-4 bg-white/5 border border-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-100">{indicator.area}</span>
                    <SeverityBadge severity={indicator.severity} />
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{indicator.indicator}</p>
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-emerald-400">{indicator.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No significant postural indicators detected</p>
            </div>
          )}
        </div>

        {/* Movement Analysis */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-100">Movement Quality</h3>
                <p className="text-sm text-slate-400">Mobility, stability & compensation patterns</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-2xl font-bold text-orange-600">{analysis.movement.mobilityScore}/10</p>
              <p className="text-sm text-slate-400">Mobility</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-2xl font-bold text-blue-600">{analysis.movement.stabilityScore}/10</p>
              <p className="text-sm text-slate-400">Stability</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.movement.overallMovementQuality === 'excellent'
                  ? 'bg-green-500/15 text-green-300'
                  : analysis.movement.overallMovementQuality === 'good'
                  ? 'bg-blue-500/15 text-blue-300'
                  : analysis.movement.overallMovementQuality === 'fair'
                  ? 'bg-yellow-500/15 text-yellow-300'
                  : 'bg-orange-500/15 text-orange-300'
              }`}>
                {analysis.movement.overallMovementQuality.charAt(0).toUpperCase() + analysis.movement.overallMovementQuality.slice(1)}
              </span>
              <p className="text-sm text-slate-400 mt-2">Overall Quality</p>
            </div>
          </div>

          {analysis.movement.flags.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.movement.flags.map((flag, index) => (
                <div key={index} className="p-4 border border-slate-700/50 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-100">{flag.movement}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      flag.limitation === 'mobility'
                        ? 'bg-orange-500/15 text-orange-300'
                        : flag.limitation === 'stability'
                        ? 'bg-blue-500/15 text-blue-300'
                        : 'bg-purple-500/15 text-purple-300'
                    }`}>
                      {flag.limitation}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{flag.observation}</p>
                  <p className="text-xs text-slate-400">Affected: {flag.affectedArea}</p>
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <p className="text-sm text-emerald-400">{flag.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <svg className="w-12 h-12 mx-auto text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Movement quality looks good! No significant issues detected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-white/5 rounded-xl text-sm text-slate-400 border border-slate-800/50">
        <p className="font-medium text-slate-300 mb-1">Disclaimer</p>
        <p>{analysis.disclaimer}</p>
      </div>
    </div>
  );
}
