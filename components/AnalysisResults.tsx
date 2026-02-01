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

const categoryColors: Record<string, string> = {
  essential: 'bg-red-500/15 text-red-300',
  athletic: 'bg-green-500/15 text-green-300',
  fitness: 'bg-blue-500/15 text-blue-300',
  acceptable: 'bg-yellow-500/15 text-yellow-300',
  elevated: 'bg-orange-500/15 text-orange-300',
};

const categoryLabels: Record<string, string> = {
  essential: 'Essential Fat',
  athletic: 'Athletic',
  fitness: 'Fitness',
  acceptable: 'Acceptable',
  elevated: 'Elevated',
};

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  // Backward compatibility for old assessments
  const fitnessScore = analysis.fitnessScore ?? analysis.muscle.overallScore * 10;
  const bodyFat = analysis.bodyFat ?? null;
  const weaknesses = analysis.weaknesses ?? [];
  const nextSteps = analysis.nextSteps ?? [];

  const scoreColor = fitnessScore >= 70 ? 'text-green-400' : fitnessScore >= 45 ? 'text-cyan-400' : 'text-amber-400';
  const strokeColor = fitnessScore >= 70 ? '#4ade80' : fitnessScore >= 45 ? '#22d3ee' : '#fbbf24';

  return (
    <div className="space-y-6">
      {/* Hero Score Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl shadow-black/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Fitness Score Ring */}
          <div className="text-center">
            <div className="relative w-36 h-36 mx-auto">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor"
                  className="text-slate-800" strokeWidth="8" />
                <circle cx="60" cy="60" r="50" fill="none"
                  strokeWidth="8" strokeLinecap="round"
                  stroke={strokeColor}
                  strokeDasharray={`${(fitnessScore / 100) * 314} 314`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{fitnessScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-300 mt-3">Fitness Score</p>
          </div>

          {/* Body Fat Estimate */}
          {bodyFat ? (
            <div className="text-center p-6 bg-white/5 rounded-xl border border-slate-800/50">
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {bodyFat.range}
              </p>
              <p className="text-sm text-slate-400 mt-1">Estimated Body Fat</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${categoryColors[bodyFat.category] || 'bg-slate-700 text-slate-300'}`}>
                {categoryLabels[bodyFat.category] || bodyFat.category}
              </span>
              <p className="text-xs text-slate-500 mt-2">
                Confidence: {bodyFat.confidence}
              </p>
              {bodyFat.notes && (
                <p className="text-xs text-slate-500 mt-1">{bodyFat.notes}</p>
              )}
            </div>
          ) : (
            <div className="text-center p-6 bg-white/5 rounded-xl border border-slate-800/50">
              <p className="text-lg font-medium text-slate-400">Body Fat</p>
              <p className="text-sm text-slate-500 mt-1">Run a new assessment to get BF% estimate</p>
            </div>
          )}

          {/* Summary */}
          <div>
            <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* Key Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
          <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </span>
            Key Weaknesses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {weaknesses.map((w, i) => (
              <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <p className="font-medium text-amber-300">{w.area}</p>
                <p className="text-sm text-slate-300 mt-1">{w.description}</p>
                <p className="text-xs text-slate-400 mt-2">Impact: {w.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Do This Next */}
      {nextSteps.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-600/10 to-violet-600/10 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/10">
          <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            Do This Next
          </h3>
          <div className="space-y-3">
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-slate-800/50">
                <span className="w-7 h-7 bg-cyan-500/20 text-cyan-300 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-100">{step.action}</p>
                  <p className="text-sm text-slate-400 mt-1">{step.rationale}</p>
                </div>
                {step.priority === 'high' && (
                  <span className="px-2 py-1 bg-red-500/15 text-red-300 rounded-full text-xs font-medium flex-shrink-0">
                    High Priority
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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
              <p className="text-2xl font-bold text-blue-400">{analysis.muscle.overallScore}/10</p>
              <p className="text-xs text-slate-400">Overall Score</p>
            </div>
          </div>

          {/* Symmetry Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-3 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Left/Right</p>
              <p className="font-medium text-sm capitalize text-slate-200">{analysis.muscle.symmetry.leftRight.replace('_', ' ')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Upper/Lower</p>
              <p className="font-medium text-sm capitalize text-slate-200">{analysis.muscle.symmetry.upperLower.replace('_', ' ')}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-xs text-slate-400 mb-1">Front/Back</p>
              <p className="font-medium text-sm capitalize text-slate-200">{analysis.muscle.symmetry.frontBack.replace('_', ' ')}</p>
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
              <p className="text-2xl font-bold text-orange-400">{analysis.movement.mobilityScore}/10</p>
              <p className="text-sm text-slate-400">Mobility</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center border border-slate-800/50">
              <p className="text-2xl font-bold text-blue-400">{analysis.movement.stabilityScore}/10</p>
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

      {/* Medical Disclaimer */}
      <div className="p-5 bg-amber-500/5 rounded-xl border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-amber-300 mb-1">Medical Disclaimer</p>
            <p className="text-sm text-slate-400">{analysis.disclaimer}</p>
            <p className="text-xs text-slate-500 mt-2">
              FitAI provides fitness insights based on exercise science literature.
              This is not a medical diagnosis. Always consult a healthcare professional for health concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
