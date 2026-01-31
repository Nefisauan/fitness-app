'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WeeklyCheckin } from '@/lib/types';

interface CheckinHistoryProps {
  checkins: WeeklyCheckin[];
}

export default function CheckinHistory({ checkins }: CheckinHistoryProps) {
  const weightData = useMemo(() => {
    return checkins
      .filter((c) => c.weight != null)
      .map((c) => ({
        date: c.checkinDate.slice(5), // MM-DD
        weight: c.weight,
      }));
  }, [checkins]);

  const ratingData = useMemo(() => {
    return checkins
      .filter((c) => c.energyRating || c.sorenessRating || c.sleepRating || c.motivationRating)
      .map((c) => ({
        date: c.checkinDate.slice(5),
        energy: c.energyRating || null,
        soreness: c.sorenessRating || null,
        sleep: c.sleepRating || null,
        motivation: c.motivationRating || null,
      }));
  }, [checkins]);

  if (checkins.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6 text-center">
        <p className="text-slate-400">No check-ins yet. Complete your first check-in to start tracking trends.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weight Chart */}
      {weightData.length >= 2 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Weight Trend</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#f1f5f9',
                    fontSize: '0.875rem',
                  }}
                  formatter={(value) => [`${value} kg`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ fill: '#8b5cf6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Rating Trends */}
      {ratingData.length >= 2 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-4">Rating Trends</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingData}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[1, 5]}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={false}
                  width={24}
                  ticks={[1, 2, 3, 4, 5]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#f1f5f9',
                    fontSize: '0.875rem',
                  }}
                />
                <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={false} name="Energy" connectNulls />
                <Line type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Sleep" connectNulls />
                <Line type="monotone" dataKey="motivation" stroke="#ef4444" strokeWidth={2} dot={false} name="Motivation" connectNulls />
                <Line type="monotone" dataKey="soreness" stroke="#10b981" strokeWidth={2} dot={false} name="Soreness" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-500 inline-block"></span><span className="text-slate-400">Energy</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 inline-block"></span><span className="text-slate-400">Sleep</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block"></span><span className="text-slate-400">Motivation</span></span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block"></span><span className="text-slate-400">Soreness</span></span>
          </div>
        </div>
      )}

      {/* Check-in List */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">History</h3>
        <div className="space-y-2">
          {[...checkins].reverse().map((checkin) => (
            <div key={checkin.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-100">{checkin.checkinDate}</p>
                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                  {checkin.weight && <span>{checkin.weight} kg</span>}
                  {checkin.energyRating && <span>Energy: {checkin.energyRating}/5</span>}
                  {checkin.sleepRating && <span>Sleep: {checkin.sleepRating}/5</span>}
                </div>
              </div>
              {checkin.notes && (
                <p className="text-xs text-slate-500 truncate max-w-[150px]">{checkin.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
