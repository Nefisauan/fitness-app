'use client';

import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
import { UploadedMedia, AssessmentPhoto, PhotoAngle } from '@/lib/types';
import {
  loadAssessmentPhotos,
  uploadAssessmentPhoto,
  deleteAssessmentPhoto,
  getPhotoSignedUrl,
} from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';

interface CachedUrl {
  url: string;
  fetchedAt: number;
}

export function useAssessmentPhotos(
  supabaseRef: MutableRefObject<ReturnType<typeof createClient> | null>,
  userId: string | null
) {
  const [dbPhotos, setDbPhotos] = useState<AssessmentPhoto[]>([]);
  const [photos, setPhotos] = useState<UploadedMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const urlCache = useRef<Map<string, CachedUrl>>(new Map());

  useEffect(() => {
    if (!userId || !supabaseRef.current) return;

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const supabase = supabaseRef.current!;
      const records = await loadAssessmentPhotos(supabase, userId!);
      if (cancelled) return;
      setDbPhotos(records);

      const mediaItems: UploadedMedia[] = [];
      await Promise.all(
        records.map(async (rec) => {
          const url = await getPhotoSignedUrl(supabase, rec.storagePath);
          if (url && !cancelled) {
            urlCache.current.set(rec.storagePath, { url, fetchedAt: Date.now() });
            mediaItems.push({
              id: rec.id,
              type: 'photo',
              angle: rec.angle,
              dataUrl: url,
              timestamp: new Date(rec.updatedAt),
            });
          }
        })
      );

      if (!cancelled) {
        setPhotos(mediaItems);
        setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [userId, supabaseRef]);

  const uploadPhoto = useCallback(
    async (file: File, angle: PhotoAngle): Promise<void> => {
      if (!userId || !supabaseRef.current) return;
      const supabase = supabaseRef.current;

      const record = await uploadAssessmentPhoto(supabase, userId, file, angle);
      if (!record) return;

      const url = await getPhotoSignedUrl(supabase, record.storagePath);
      if (!url) return;

      urlCache.current.set(record.storagePath, { url, fetchedAt: Date.now() });

      const newMedia: UploadedMedia = {
        id: record.id,
        type: 'photo',
        angle: record.angle,
        dataUrl: url,
        timestamp: new Date(record.updatedAt),
      };

      setDbPhotos((prev) => {
        const filtered = prev.filter((p) => p.angle !== angle);
        return [...filtered, record];
      });
      setPhotos((prev) => {
        const filtered = prev.filter((p) => p.angle !== angle);
        return [...filtered, newMedia];
      });
    },
    [userId, supabaseRef]
  );

  const removePhoto = useCallback(
    async (angle: PhotoAngle): Promise<void> => {
      if (!supabaseRef.current) return;
      const rec = dbPhotos.find((p) => p.angle === angle);
      if (!rec) return;

      await deleteAssessmentPhoto(supabaseRef.current, rec.id, rec.storagePath);
      urlCache.current.delete(rec.storagePath);
      setDbPhotos((prev) => prev.filter((p) => p.id !== rec.id));
      setPhotos((prev) => prev.filter((p) => p.angle !== angle));
    },
    [supabaseRef, dbPhotos]
  );

  return {
    photos,
    isLoading,
    uploadPhoto,
    removePhoto,
  };
}
