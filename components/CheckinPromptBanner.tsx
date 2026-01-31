'use client';

interface CheckinPromptBannerProps {
  daysSinceLastCheckin: number;
  onCheckinClick: () => void;
  onDismiss: () => void;
}

export default function CheckinPromptBanner({ daysSinceLastCheckin, onCheckinClick, onDismiss }: CheckinPromptBannerProps) {
  const label = daysSinceLastCheckin === Infinity
    ? "You haven't done a check-in yet"
    : `It's been ${daysSinceLastCheckin} days since your last check-in`;

  return (
    <div className="mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-200">{label}</p>
        <p className="text-xs text-amber-300/70">Track your progress with a quick weekly update</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
        >
          Dismiss
        </button>
        <button
          onClick={onCheckinClick}
          className="px-4 py-1.5 bg-amber-500/20 text-amber-200 text-xs font-medium rounded-lg hover:bg-amber-500/30 transition-colors border border-amber-500/30"
        >
          Check in now
        </button>
      </div>
    </div>
  );
}
