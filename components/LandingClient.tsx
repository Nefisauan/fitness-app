'use client';

import Link from 'next/link';

export default function LandingClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center relative">
          {/* Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/40">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-4">
            FitAI
          </h1>

          <p className="text-xl md:text-2xl font-semibold text-slate-100 mb-3">
            Stop guessing your fitness. Measure it.
          </p>

          <p className="text-slate-400 max-w-xl mx-auto mb-8">
            Upload your stats. Get an AI-driven fitness analysis in under 60 seconds.
            Personalized workout plan, nutrition targets, and progress tracking included.
          </p>

          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/40 hover:shadow-xl hover:shadow-violet-500/50"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              gradient: 'from-cyan-500 to-blue-600',
              title: 'Know your real starting point',
              description: 'Get an honest assessment of your muscle development, posture, and movement quality — not generic advice.',
            },
            {
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              gradient: 'from-violet-500 to-purple-600',
              title: 'Train what actually matters',
              description: 'AI identifies your 2-3 biggest weaknesses and gives you an exact plan to fix them. No guesswork.',
            },
            {
              icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              gradient: 'from-emerald-500 to-teal-600',
              title: 'Track real progress',
              description: 'See your fitness score improve over time with data, not feelings. Weekly check-ins and progress photos.',
            },
          ].map((benefit, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
              <div className={`w-12 h-12 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">{benefit.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Preview Section */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-slate-100 mb-2">See what you get</h2>
        <p className="text-center text-slate-400 mb-8">Example analysis results</p>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl shadow-black/40 opacity-90">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Mock Fitness Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" strokeWidth="8" strokeLinecap="round" stroke="#22d3ee"
                    strokeDasharray={`${(52 / 100) * 314} 314`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-cyan-400">52</span>
                  <span className="text-xs text-slate-500">/ 100</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-300 mt-2">Fitness Score</p>
            </div>

            {/* Mock BF% */}
            <div className="text-center p-5 bg-white/5 rounded-xl border border-slate-800/50">
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">18-22%</p>
              <p className="text-sm text-slate-400 mt-1">Estimated Body Fat</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-300">
                Acceptable
              </span>
            </div>

            {/* Mock Summary */}
            <div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Intermediate lifter with solid upper body development but notable posterior chain and core stability gaps. Addressing these will unlock significant compound lift progress.
              </p>
            </div>
          </div>

          {/* Mock Weaknesses */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="font-medium text-amber-300">Posterior Chain</p>
              <p className="text-sm text-slate-400 mt-1">Hamstrings and glutes undertrained relative to quads.</p>
            </div>
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="font-medium text-amber-300">Core Stability</p>
              <p className="text-sm text-slate-400 mt-1">Core lags behind limb strength, limiting compound lifts.</p>
            </div>
          </div>

          {/* Mock Next Step */}
          <div className="mt-4 flex items-start gap-3 p-4 bg-cyan-500/5 rounded-xl border border-cyan-500/20">
            <span className="w-7 h-7 bg-cyan-500/20 text-cyan-300 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
            <div>
              <p className="font-medium text-slate-200">Add 2 weekly RDL sessions at RPE 7-8</p>
              <p className="text-sm text-slate-400 mt-0.5">Addresses the posterior chain deficit — the highest-impact fix.</p>
            </div>
            <span className="px-2 py-1 bg-red-500/15 text-red-300 rounded-full text-xs font-medium flex-shrink-0">High Priority</span>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center text-slate-100 mb-8">How it works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '1',
              title: 'Enter your stats',
              description: 'Age, height, weight, training history, and your fitness goal. Most fields are click-based — done in under 2 minutes.',
            },
            {
              step: '2',
              title: 'Get AI analysis',
              description: 'Our AI evaluates your physique, posture, and movement patterns using peer-reviewed exercise science research.',
            },
            {
              step: '3',
              title: 'Follow your plan',
              description: 'Personalized workout split, nutrition targets, and recovery guidance — backed by research from Schoenfeld, Israetel, and Helms.',
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40 h-full">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full text-white font-bold text-lg mb-4 shadow-lg shadow-violet-500/30">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Signals */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Powered by peer-reviewed exercise science</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI analysis by Claude</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Free to use. No credit card required.</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Not medical advice. Always consult a professional.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-5xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-3">Ready to find out where you stand?</h2>
        <p className="text-slate-400 mb-6">Your personalized assessment is waiting.</p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-violet-500/40 hover:shadow-xl hover:shadow-violet-500/50"
        >
          Get Started Free
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800/50 py-6 text-center">
        <p className="text-xs text-slate-500">FitAI — AI-powered fitness assessment backed by exercise science.</p>
      </div>
    </div>
  );
}
