'use client';

import { useState } from 'react';
import { MuscleGroup } from '@/lib/types';

interface BodyMapProps {
  groups: MuscleGroup[];
}

function getScoreColor(score: number): string {
  if (score <= 3) return '#ef4444';
  if (score <= 5) return '#f59e0b';
  if (score <= 7) return '#22c55e';
  if (score <= 9) return '#10b981';
  return '#06b6d4';
}

function getScoreOpacity(score: number): number {
  return 0.5 + (score / 10) * 0.4;
}

const developmentLabels: Record<string, string> = {
  underdeveloped: 'Needs Work',
  balanced: 'Balanced',
  well_developed: 'Well Developed',
  overdominant: 'Overdominant',
};

interface MuscleRegion {
  name: string;
  paths: string[];
}

// Front view muscle regions
const frontRegions: MuscleRegion[] = [
  {
    name: 'Shoulders',
    paths: [
      // Left front delt
      'M54,92 C48,88 40,90 38,98 C36,106 40,112 48,112 C52,112 55,108 56,104 Z',
      // Right front delt
      'M146,92 C152,88 160,90 162,98 C164,106 160,112 152,112 C148,112 145,108 144,104 Z',
    ],
  },
  {
    name: 'Chest',
    paths: [
      // Left pec
      'M68,100 C64,98 56,104 58,114 C60,124 68,130 80,130 C88,130 96,126 98,122 C100,118 100,112 98,106 C96,100 88,98 80,98 C74,98 70,99 68,100 Z',
      // Right pec
      'M132,100 C136,98 144,104 142,114 C140,124 132,130 120,130 C112,130 104,126 102,122 C100,118 100,112 102,106 C104,100 112,98 120,98 C126,98 130,99 132,100 Z',
    ],
  },
  {
    name: 'Arms',
    paths: [
      // Left bicep
      'M38,114 C34,116 30,126 30,140 C30,154 32,164 36,168 C40,172 46,170 48,164 C50,158 50,148 50,138 C50,128 50,118 48,114 C46,110 42,112 38,114 Z',
      // Right bicep
      'M162,114 C166,116 170,126 170,140 C170,154 168,164 164,168 C160,172 154,170 152,164 C150,158 150,148 150,138 C150,128 150,118 152,114 C154,110 158,112 162,114 Z',
    ],
  },
  {
    name: 'Core',
    paths: [
      // Abs
      'M80,134 C76,134 74,138 74,144 L74,186 C74,192 78,196 84,196 L116,196 C122,196 126,192 126,186 L126,144 C126,138 124,134 120,134 Z',
    ],
  },
  {
    name: 'Quads',
    paths: [
      // Left quad
      'M70,204 C66,206 62,216 60,232 C58,248 58,268 60,288 C62,308 66,320 70,326 C74,332 80,332 84,328 C88,324 92,312 94,296 C96,280 96,260 96,244 C96,228 94,214 92,208 C90,202 84,200 78,202 Z',
      // Right quad
      'M130,204 C134,206 138,216 140,232 C142,248 142,268 140,288 C138,308 134,320 130,326 C126,332 120,332 116,328 C112,324 108,312 106,296 C104,280 104,260 104,244 C104,228 106,214 108,208 C110,202 116,200 122,202 Z',
    ],
  },
  {
    name: 'Calves',
    paths: [
      // Left calf (front view - shin/tibialis)
      'M66,340 C64,344 62,358 62,372 C62,386 64,396 68,402 C72,408 78,408 80,404 C82,400 84,390 84,378 C84,366 82,352 80,344 C78,336 72,336 66,340 Z',
      // Right calf (front view)
      'M134,340 C136,344 138,358 138,372 C138,386 136,396 132,402 C128,408 122,408 120,404 C118,400 116,390 116,378 C116,366 118,352 120,344 C122,336 128,336 134,340 Z',
    ],
  },
];

// Back view muscle regions
const backRegions: MuscleRegion[] = [
  {
    name: 'Shoulders',
    paths: [
      // Left rear delt
      'M54,92 C48,88 40,90 38,98 C36,106 40,112 48,112 C52,112 55,108 56,104 Z',
      // Right rear delt
      'M146,92 C152,88 160,90 162,98 C164,106 160,112 152,112 C148,112 145,108 144,104 Z',
    ],
  },
  {
    name: 'Back',
    paths: [
      // Traps
      'M76,86 C72,84 66,86 62,92 C58,98 60,106 64,108 L98,108 L100,90 Z',
      'M124,86 C128,84 134,86 138,92 C142,98 140,106 136,108 L102,108 L100,90 Z',
      // Lats
      'M62,112 C58,116 56,128 58,142 C60,156 66,166 74,170 L98,170 L98,112 Z',
      'M138,112 C142,116 144,128 142,142 C140,156 134,166 126,170 L102,170 L102,112 Z',
    ],
  },
  {
    name: 'Arms',
    paths: [
      // Left tricep
      'M38,114 C34,116 30,126 30,140 C30,154 32,164 36,168 C40,172 46,170 48,164 C50,158 50,148 50,138 C50,128 50,118 48,114 C46,110 42,112 38,114 Z',
      // Right tricep
      'M162,114 C166,116 170,126 170,140 C170,154 168,164 164,168 C160,172 154,170 152,164 C150,158 150,148 150,138 C150,128 150,118 152,114 C154,110 158,112 162,114 Z',
    ],
  },
  {
    name: 'Glutes',
    paths: [
      // Left glute
      'M68,196 C62,198 58,206 58,216 C58,226 64,234 72,236 C80,238 90,234 96,228 C98,224 100,218 100,212 C100,206 96,200 90,198 C84,196 76,194 68,196 Z',
      // Right glute
      'M132,196 C138,198 142,206 142,216 C142,226 136,234 128,236 C120,238 110,234 104,228 C102,224 100,218 100,212 C100,206 104,200 110,198 C116,196 124,194 132,196 Z',
    ],
  },
  {
    name: 'Hamstrings',
    paths: [
      // Left hamstring
      'M66,242 C62,246 58,260 58,278 C58,296 60,312 64,324 C68,336 74,338 80,334 C86,330 90,318 92,304 C94,290 94,272 92,258 C90,244 84,238 78,238 C72,238 68,240 66,242 Z',
      // Right hamstring
      'M134,242 C138,246 142,260 142,278 C142,296 140,312 136,324 C132,336 126,338 120,334 C114,330 110,318 108,304 C106,290 106,272 108,258 C110,244 116,238 122,238 C128,238 132,240 134,242 Z',
    ],
  },
  {
    name: 'Calves',
    paths: [
      // Left calf
      'M62,340 C58,346 56,360 56,374 C56,388 60,398 66,404 C72,410 80,408 84,402 C88,396 88,384 88,372 C88,360 86,348 82,342 C78,336 68,336 62,340 Z',
      // Right calf
      'M138,340 C142,346 144,360 144,374 C144,388 140,398 134,404 C128,410 120,408 116,402 C112,396 112,384 112,372 C112,360 114,348 118,342 C122,336 132,336 138,340 Z',
    ],
  },
];

// Body outline for context
const bodyOutlineFront = 'M100,12 C88,12 80,20 80,32 C80,44 88,52 100,52 C112,52 120,44 120,32 C120,20 112,12 100,12 Z M92,54 L82,58 C72,62 58,72 52,86 L38,112 C34,120 28,130 26,140 C24,150 26,168 30,176 L34,184 C36,188 38,186 36,180 L30,160 C28,150 30,142 34,134 L48,110 M108,54 L118,58 C128,62 142,72 148,86 L162,112 C166,120 172,130 174,140 C176,150 174,168 170,176 L166,184 C164,188 162,186 164,180 L170,160 C172,150 170,142 166,134 L152,110 M80,54 C72,58 64,68 60,80 L56,100 C54,108 54,118 56,128 L62,170 C64,182 66,192 66,200 L66,204 M120,54 C128,58 136,68 140,80 L144,100 C146,108 146,118 144,128 L138,170 C136,182 134,192 134,200 L134,204 M66,204 C64,210 60,230 58,260 C56,290 58,320 62,340 L66,360 C68,380 70,400 72,414 L78,414 C76,400 74,380 74,360 L72,340 C70,320 70,300 72,280 L80,240 M134,204 C136,210 140,230 142,260 C144,290 142,320 138,340 L134,360 C132,380 130,400 128,414 L122,414 C124,400 126,380 126,360 L128,340 C130,320 130,300 128,280 L120,240';

const bodyOutlineBack = 'M100,12 C88,12 80,20 80,32 C80,44 88,52 100,52 C112,52 120,44 120,32 C120,20 112,12 100,12 Z M92,54 L82,58 C72,62 58,72 52,86 L38,112 C34,120 28,130 26,140 C24,150 26,168 30,176 L34,184 C36,188 38,186 36,180 L30,160 C28,150 30,142 34,134 L48,110 M108,54 L118,58 C128,62 142,72 148,86 L162,112 C166,120 172,130 174,140 C176,150 174,168 170,176 L166,184 C164,188 162,186 164,180 L170,160 C172,150 170,142 166,134 L152,110 M80,54 C72,58 64,68 60,80 L56,100 C54,108 54,118 56,128 L62,170 C64,182 66,192 66,200 L66,204 M120,54 C128,58 136,68 140,80 L144,100 C146,108 146,118 144,128 L138,170 C136,182 134,192 134,200 L134,204 M66,204 C64,210 60,230 58,260 C56,290 58,320 62,340 L66,360 C68,380 70,400 72,414 L78,414 C76,400 74,380 74,360 L72,340 C70,320 70,300 72,280 L80,240 M134,204 C136,210 140,230 142,260 C144,290 142,320 138,340 L134,360 C132,380 130,400 128,414 L122,414 C124,400 126,380 126,360 L128,340 C130,320 130,300 128,280 L120,240';

function MuscleRegionPaths({
  region,
  score,
  development,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  region: MuscleRegion;
  score: number;
  development: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const color = getScoreColor(score);
  const opacity = getScoreOpacity(score);

  return (
    <g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="cursor-pointer transition-all duration-200"
    >
      {region.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={color}
          fillOpacity={isHovered ? Math.min(opacity + 0.2, 1) : opacity}
          stroke={isHovered ? '#f1f5f9' : color}
          strokeWidth={isHovered ? 1.5 : 0.5}
          strokeOpacity={isHovered ? 0.9 : 0.4}
          className="transition-all duration-200"
        />
      ))}
    </g>
  );
}

export default function BodyMap({ groups }: BodyMapProps) {
  const [hoveredMuscle, setHoveredMuscle] = useState<string | null>(null);

  const getGroup = (name: string): MuscleGroup | undefined => {
    return groups.find((g) => g.name.toLowerCase() === name.toLowerCase());
  };

  const hoveredGroup = hoveredMuscle ? getGroup(hoveredMuscle) : null;

  const renderView = (regions: MuscleRegion[], outline: string, label: string) => (
    <div className="flex-1 flex flex-col items-center">
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <svg viewBox="0 0 200 430" className="w-full max-w-[180px] md:max-w-[200px]">
        {/* Body outline */}
        <path
          d={outline}
          fill="none"
          stroke="#334155"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* Muscle regions */}
        {regions.map((region) => {
          const group = getGroup(region.name);
          if (!group) return null;
          return (
            <MuscleRegionPaths
              key={region.name}
              region={region}
              score={group.score}
              development={group.development}
              isHovered={hoveredMuscle === region.name}
              onHover={() => setHoveredMuscle(region.name)}
              onLeave={() => setHoveredMuscle(null)}
              onClick={() => setHoveredMuscle(hoveredMuscle === region.name ? null : region.name)}
            />
          );
        })}
      </svg>
    </div>
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl shadow-black/40">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/30">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Muscle Map</h3>
          <p className="text-sm text-slate-400">Color-coded by development score</p>
        </div>
      </div>

      {/* Body Views */}
      <div className="flex gap-4 md:gap-8 justify-center items-start">
        {renderView(frontRegions, bodyOutlineFront, 'Front')}
        {renderView(backRegions, bodyOutlineBack, 'Back')}
      </div>

      {/* Hover Tooltip */}
      <div className={`mt-4 p-3 rounded-xl border transition-all duration-200 ${
        hoveredGroup
          ? 'bg-white/5 border-slate-700/50 opacity-100'
          : 'bg-transparent border-transparent opacity-0'
      }`}>
        {hoveredGroup ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getScoreColor(hoveredGroup.score) }}
              />
              <span className="font-medium text-slate-100">{hoveredGroup.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                hoveredGroup.development === 'underdeveloped' ? 'bg-amber-500/15 text-amber-300' :
                hoveredGroup.development === 'balanced' ? 'bg-green-500/15 text-green-300' :
                hoveredGroup.development === 'well_developed' ? 'bg-blue-500/15 text-blue-300' :
                'bg-purple-500/15 text-purple-300'
              }`}>
                {developmentLabels[hoveredGroup.development] || hoveredGroup.development}
              </span>
            </div>
            <span className="text-lg font-bold" style={{ color: getScoreColor(hoveredGroup.score) }}>
              {hoveredGroup.score}/10
            </span>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center">Hover over a muscle group</p>
        )}
      </div>

      {/* Color Legend */}
      <div className="mt-4 flex items-center justify-center gap-1">
        <span className="text-xs text-slate-500 mr-2">Score:</span>
        {[
          { label: '1-3', color: '#ef4444' },
          { label: '4-5', color: '#f59e0b' },
          { label: '6-7', color: '#22c55e' },
          { label: '8-9', color: '#10b981' },
          { label: '10', color: '#06b6d4' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1 mx-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color, opacity: 0.8 }} />
            <span className="text-xs text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
