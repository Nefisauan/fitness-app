'use client';

import { useState, useRef } from 'react';
import { UploadedMedia } from '@/lib/types';

interface PhotoUploadProps {
  onPhotosChange: (photos: UploadedMedia[]) => void;
  photos: UploadedMedia[];
}

const photoAngles: { id: UploadedMedia['angle']; label: string; description: string }[] = [
  { id: 'front', label: 'Front View', description: 'Stand facing the camera, arms relaxed at sides' },
  { id: 'side', label: 'Side View', description: 'Stand sideways, maintain natural posture' },
  { id: 'back', label: 'Back View', description: 'Stand facing away from camera' },
];

export default function PhotoUpload({ onPhotosChange, photos }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFile = (file: File, angle: UploadedMedia['angle']) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newPhoto: UploadedMedia = {
        id: `${angle}-${Date.now()}`,
        type: 'photo',
        angle,
        dataUrl: e.target?.result as string,
        timestamp: new Date(),
      };

      const updatedPhotos = photos.filter(p => p.angle !== angle);
      updatedPhotos.push(newPhoto);
      onPhotosChange(updatedPhotos);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, angle: UploadedMedia['angle']) => {
    e.preventDefault();
    setDragActive(null);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file, angle);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, angle: UploadedMedia['angle']) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file, angle);
    }
  };

  const removePhoto = (angle: UploadedMedia['angle']) => {
    onPhotosChange(photos.filter(p => p.angle !== angle));
  };

  const getPhotoForAngle = (angle: UploadedMedia['angle']) => {
    return photos.find(p => p.angle === angle);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Body Photos</h2>
          <p className="text-sm text-slate-400">Upload photos for physique analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photoAngles.map(({ id, label, description }) => {
          const photo = getPhotoForAngle(id);

          return (
            <div key={id} className="relative">
              <input
                ref={el => { fileInputRefs.current[id] = el; }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleInputChange(e, id)}
              />

              {photo ? (
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 group">
                  <img
                    src={photo.dataUrl}
                    alt={label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRefs.current[id]?.click()}
                      className="px-3 py-2 bg-white/10 backdrop-blur rounded-lg text-sm font-medium text-white hover:bg-white/20"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => removePhoto(id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded-lg">
                    {label}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRefs.current[id]?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(id); }}
                  onDragLeave={() => setDragActive(null)}
                  onDrop={(e) => handleDrop(e, id)}
                  className={`aspect-[3/4] rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center p-4 ${
                    dragActive === id
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-slate-700 hover:border-violet-400 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    dragActive === id ? 'bg-violet-500/20' : 'bg-slate-800'
                  }`}>
                    <svg className={`w-6 h-6 ${dragActive === id ? 'text-violet-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="font-medium text-slate-300 text-center">{label}</p>
                  <p className="text-xs text-slate-400 text-center mt-1">{description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-amber-300">
            <p className="font-medium">Photo Tips</p>
            <ul className="mt-1 space-y-1 text-amber-300/80">
              <li>• Wear form-fitting clothing or athletic wear</li>
              <li>• Use good lighting and a plain background</li>
              <li>• Stand with a natural, relaxed posture</li>
              <li>• Assessment photos are processed locally and not stored</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
