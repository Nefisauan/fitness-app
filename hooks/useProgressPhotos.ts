'use client';

import { useState, useEffect, useCallback, useMemo, useRef, MutableRefObject } from 'react';
import { ProgressPhoto, PhotoAngle } from '@/lib/types';
import {
  loadProgressPhotos,
  uploadProgressPhoto,
  deleteProgressPhoto,
  getPhotoSignedUrl,
} from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';

interface CachedUrl {
  url: string;
  fetchedAt: number;
}

export function useProgressPhotos(
  supabaseRef: MutableRefObject<ReturnType<typeof createClient> | null>,
  userId: string | null
) {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const urlCache = useRef<Map<string, CachedUrl>>(new Map());

  useEffect(() => {
    if (!userId || !supabaseRef.current) return;
    loadProgressPhotos(supabaseRef.current, userId).then(setPhotos);
  }, [userId, supabaseRef]);

  const photoDates = useMemo(() => {
    const dates = new Set(photos.map((p) => p.photoDate));
    return [...dates].sort();
  }, [photos]);

  const uploadPhoto = useCallback(
    async (file: File, angle: PhotoAngle, date?: string) => {
      if (!userId || !supabaseRef.current) return;
      const photo = await uploadProgressPhoto(supabaseRef.current, userId, file, angle, undefined, date);
      if (photo) {
        setPhotos((prev) => [...prev, photo].sort((a, b) => a.photoDate.localeCompare(b.photoDate)));
      }
    },
    [userId, supabaseRef]
  );

  const deletePhoto = useCallback(
    async (photoId: string, storagePath: string) => {
      if (!supabaseRef.current) return;
      await deleteProgressPhoto(supabaseRef.current, photoId, storagePath);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      urlCache.current.delete(storagePath);
    },
    [supabaseRef]
  );

  const getSignedUrl = useCallback(
    async (storagePath: string): Promise<string | null> => {
      // Check cache (valid for 50 min)
      const cached = urlCache.current.get(storagePath);
      if (cached && Date.now() - cached.fetchedAt < 50 * 60 * 1000) {
        return cached.url;
      }

      if (!supabaseRef.current) return null;
      const url = await getPhotoSignedUrl(supabaseRef.current, storagePath);
      if (url) {
        urlCache.current.set(storagePath, { url, fetchedAt: Date.now() });
      }
      return url;
    },
    [supabaseRef]
  );

  return {
    photos,
    photoDates,
    uploadPhoto,
    deletePhoto,
    getSignedUrl,
  };
}
