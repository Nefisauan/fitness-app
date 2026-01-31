'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ProgressPhoto, PhotoAngle } from '@/lib/types';

interface PhotoComparisonProps {
  photos: ProgressPhoto[];
  photoDates: string[];
  onUpload: (file: File, angle: PhotoAngle, date?: string) => Promise<void>;
  onDelete: (photoId: string, storagePath: string) => Promise<void>;
  getSignedUrl: (storagePath: string) => Promise<string | null>;
}

const angles: { id: PhotoAngle; label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'side', label: 'Side' },
  { id: 'back', label: 'Back' },
];

export default function PhotoComparison({
  photos,
  photoDates,
  onUpload,
  onDelete,
  getSignedUrl,
}: PhotoComparisonProps) {
  const [uploading, setUploading] = useState(false);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [urls, setUrls] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Auto-select first and last dates
  useEffect(() => {
    if (photoDates.length >= 2) {
      setDate1(photoDates[0]);
      setDate2(photoDates[photoDates.length - 1]);
    } else if (photoDates.length === 1) {
      setDate1(photoDates[0]);
    }
  }, [photoDates]);

  // Load signed URLs for comparison dates
  const loadUrls = useCallback(
    async (dates: string[]) => {
      const photosForDates = photos.filter((p) => dates.includes(p.photoDate));
      const newUrls: Record<string, string> = {};
      await Promise.all(
        photosForDates.map(async (p) => {
          const url = await getSignedUrl(p.storagePath);
          if (url) newUrls[p.id] = url;
        })
      );
      setUrls((prev) => ({ ...prev, ...newUrls }));
    },
    [photos, getSignedUrl]
  );

  useEffect(() => {
    const dates = [date1, date2].filter(Boolean);
    if (dates.length > 0) loadUrls(dates);
  }, [date1, date2, loadUrls]);

  const handleUpload = async (file: File, angle: PhotoAngle) => {
    setUploading(true);
    await onUpload(file, angle);
    setUploading(false);
  };

  const getPhotosForDate = (date: string, angle: PhotoAngle) => {
    return photos.find((p) => p.photoDate === date && p.angle === angle);
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-1">Upload Progress Photos</h3>
        <p className="text-sm text-slate-400 mb-4">Add photos to track your visual progress over time</p>

        <div className="grid grid-cols-3 gap-3">
          {angles.map(({ id, label }) => (
            <div key={id}>
              <input
                ref={(el) => { fileInputRefs.current[id] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleUpload(file, id);
                  e.target.value = '';
                }}
              />
              <button
                onClick={() => fileInputRefs.current[id]?.click()}
                disabled={uploading}
                className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 hover:border-violet-400 hover:bg-white/5 flex flex-col items-center justify-center transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-300">{label}</p>
                <p className="text-xs text-slate-500">{uploading ? 'Uploading...' : 'Click to upload'}</p>
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Progress photos are stored securely in your private cloud storage.
        </p>
      </div>

      {/* Comparison Section */}
      {photoDates.length >= 2 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Compare Progress</h3>

          {/* Date Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Before</label>
              <select
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Select date</option>
                {photoDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">After</label>
              <select
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full h-10 px-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:ring-1 focus:ring-violet-500"
              >
                <option value="">Select date</option>
                {photoDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-side comparison */}
          {date1 && date2 && (
            <div className="space-y-4">
              {angles.map(({ id, label }) => {
                const photo1 = getPhotosForDate(date1, id);
                const photo2 = getPhotosForDate(date2, id);

                if (!photo1 && !photo2) return null;

                return (
                  <div key={id}>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">{label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800">
                        {photo1 && urls[photo1.id] ? (
                          <>
                            <img
                              src={urls[photo1.id]}
                              alt={`${label} - ${date1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                              {date1}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800">
                        {photo2 && urls[photo2.id] ? (
                          <>
                            <img
                              src={urls[photo2.id]}
                              alt={`${label} - ${date2}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                              {date2}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm">
                            No photo
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* No photos yet */}
      {photoDates.length === 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6 text-center">
          <p className="text-slate-400">Upload your first set of progress photos above to start tracking visual changes.</p>
        </div>
      )}
    </div>
  );
}
