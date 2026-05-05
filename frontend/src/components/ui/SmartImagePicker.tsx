'use client';

import { useState, useRef } from 'react';

const MAX_FILE_MB = 5;
const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export interface PickedImage {
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
  fileId: number;
  strapiUrl: string;
}

interface Props {
  onPick: (img: PickedImage) => void;
  onClear?: () => void;
  label?: string;
  disabled?: boolean;
}

type Step = 'idle' | 'preview' | 'uploading' | 'done';

export default function SmartImagePicker({
  onPick, onClear, label = 'Cover Image', disabled,
}: Props) {
  const [step, setStep] = useState<Step>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ w: number; h: number } | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep('idle');
    setFile(null);
    setPreviewUrl(null);
    setDimensions(null);
    setUploadedUrl(null);
    setError(null);
    setProgress(0);
    if (fileRef.current) fileRef.current.value = '';
    onClear?.();
  };

  const readFile = (selected: File) => {
    setError(null);
    if (!selected.type.startsWith('image/')) {
      setError('Please select a JPEG, PNG, or WebP image.');
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setError(`File is ${(selected.size / 1024 / 1024).toFixed(1)} MB — max ${MAX_FILE_MB} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setFile(selected);
        setPreviewUrl(url);
        setDimensions({ w: img.width, h: img.height });
        setStep('preview');
      };
      img.src = url;
    };
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStep('uploading');
    setProgress(0);

    const form = new FormData();
    form.append('files', file, file.name);

    await new Promise<void>(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const r = JSON.parse(xhr.responseText);
            const f = Array.isArray(r) ? r[0] : r;
            const base = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
            const strapiUrl = f.url.startsWith('/') ? `${base}${f.url}` : f.url;
            setUploadedUrl(strapiUrl);
            setStep('done');
            onPick({
              blob: file,
              width: dimensions?.w ?? 0,
              height: dimensions?.h ?? 0,
              previewUrl: strapiUrl,
              fileId: f.id,
              strapiUrl,
            });
          } catch {
            setError('Upload succeeded but the response was unexpected.');
            setStep('preview');
          }
        } else {
          let msg = `Upload failed (${xhr.status})`;
          try { const e = JSON.parse(xhr.responseText); if (e.error) msg += `: ${e.error}`; } catch {}
          setError(msg);
          setStep('preview');
        }
        resolve();
      });
      xhr.addEventListener('error', () => {
        setError('Network error — check that the server is running.');
        setStep('preview');
        resolve();
      });
      xhr.open('POST', '/api/upload');
      xhr.send(form);
    });
  };

  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-gray-800">{label}</label>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f); }}
      />

      {/* Idle */}
      {step === 'idle' && (
        <div
          onClick={() => !disabled && fileRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-400 hover:bg-brand-50/40'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium text-gray-600">Click to upload from computer</p>
          <p className="text-xs text-gray-400">JPEG · PNG · WebP · max {MAX_FILE_MB} MB</p>
        </div>
      )}

      {/* Preview */}
      {step === 'preview' && file && previewUrl && (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="preview" className="w-full max-h-64 object-contain block" />
            {dimensions && (
              <span className="absolute top-2 left-2 text-[11px] bg-black/60 text-white px-2 py-0.5 rounded">
                {dimensions.w}×{dimensions.h}px
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate px-0.5">{file.name}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleUpload}
              className="flex-1 py-2.5 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              Upload
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Uploading */}
      {step === 'uploading' && (
        <div className="space-y-3 py-4">
          <p className="text-sm text-center text-gray-600">Uploading… {progress}%</p>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Done */}
      {step === 'done' && uploadedUrl && (
        <div className="relative rounded-xl overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={uploadedUrl} alt="uploaded cover" className="w-full max-h-52 object-cover block" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
            Uploaded
          </span>
          <button
            type="button"
            onClick={reset}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 text-xs px-2.5 py-1 rounded-full shadow font-medium transition-colors"
          >
            Change
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span className="shrink-0 mt-0.5">✕</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
