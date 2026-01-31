'use client';

import { useState, useEffect, useCallback, useMemo, MutableRefObject } from 'react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { WeeklyCheckin } from '@/lib/types';
import { loadWeeklyCheckins, saveWeeklyCheckin } from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';

export function useWeeklyCheckins(
  supabaseRef: MutableRefObject<ReturnType<typeof createClient> | null>,
  userId: string | null
) {
  const [checkins, setCheckins] = useState<WeeklyCheckin[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!userId || !supabaseRef.current) return;
    loadWeeklyCheckins(supabaseRef.current, userId).then(setCheckins);
  }, [userId, supabaseRef]);

  const latestCheckin = useMemo(() => {
    if (checkins.length === 0) return null;
    return checkins[checkins.length - 1];
  }, [checkins]);

  const daysSinceLastCheckin = useMemo(() => {
    if (!latestCheckin) return Infinity;
    return differenceInCalendarDays(new Date(), parseISO(latestCheckin.checkinDate));
  }, [latestCheckin]);

  const shouldShowPrompt = !dismissed && daysSinceLastCheckin >= 7;

  const saveCheckin = useCallback(
    async (checkin: Omit<WeeklyCheckin, 'id' | 'createdAt'>) => {
      if (!userId || !supabaseRef.current) return;
      const id = await saveWeeklyCheckin(supabaseRef.current, userId, checkin);
      if (id) {
        const newCheckin: WeeklyCheckin = {
          ...checkin,
          id,
          createdAt: new Date().toISOString(),
        };
        setCheckins((prev) => {
          const existing = prev.findIndex((c) => c.checkinDate === checkin.checkinDate);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = newCheckin;
            return updated;
          }
          return [...prev, newCheckin].sort((a, b) => a.checkinDate.localeCompare(b.checkinDate));
        });
        setDismissed(false);
      }
    },
    [userId, supabaseRef]
  );

  const dismissPrompt = useCallback(() => setDismissed(true), []);

  return {
    checkins,
    latestCheckin,
    daysSinceLastCheckin,
    shouldShowPrompt,
    saveCheckin,
    dismissPrompt,
  };
}
