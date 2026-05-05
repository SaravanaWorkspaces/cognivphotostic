'use client';

import { useState, useRef } from 'react';

interface CoverImageUploaderProps {
  onSuccess?: (fileId: number, url: string) => void;
  onError?: (error: string) => void;
}

export default function CoverImageUploader({
  onSuccess,
  onError,
}: CoverImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const RECOMMENDED_SIZE = '800×600px (4:3)';
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!selectedFile.type.startsWith('image/')) {
      const msg = 'Please select an image file (JPEG, PNG, or WebP)';
      setError(msg);
      onError?.(msg);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      const msg = `File size must be less than 5MB (current: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB)`;
      setError(msg);
      onError?.(msg);
      return;
    }

    // Validate dimensions
    const img = new Image();
    img.onload = () => {
      if (img.width < 600 || img.height < 450) {
        const msg = `Image must be at least 600×450px (current: ${img.width}×${img.height}px)`;
        setError(msg);
        onError?.(msg);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    };

    img.onerror = () => {
      const msg = 'Failed to load image. Please select a valid image file.';
      setError(msg);
      onError?.(msg);
    };

    img.src = URL.createObjectURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('files', file);

    // XHR for upload progress tracking via the local Next.js proxy
    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        setLoading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            const uploadedFile = Array.isArray(response) ? response[0] : response;
            setSuccess(`Uploaded successfully (File ID: ${uploadedFile.id})`);
            onSuccess?.(uploadedFile.id, uploadedFile.url);
            setTimeout(() => {
              setFile(null);
              setPreview(null);
              setSuccess(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }, 2500);
          } catch {
            setError('Upload succeeded but response could not be parsed.');
          }
        } else {
          let detail = '';
          try { detail = JSON.parse(xhr.responseText)?.error ?? ''; } catch {}
          const msg = `Upload failed (${xhr.status})${detail ? ': ' + detail : ''}`;
          setError(msg);
          onError?.(msg);
        }
        resolve();
      });

      xhr.addEventListener('error', () => {
        setLoading(false);
        const msg = 'Network error — check that the server is running.';
        setError(msg);
        onError?.(msg);
        resolve();
      });

      xhr.addEventListener('abort', () => {
        setLoading(false);
        resolve();
      });

      // POST to our local Next.js proxy (uses the server-side API token)
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          📸 Cover Image
        </h2>
        <p className="text-sm text-gray-600">
          Recommended: {RECOMMENDED_SIZE} • Max: 5MB
        </p>
      </div>

      {/* Main Upload Area */}
      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
            disabled={loading}
            className="hidden"
          />

          <div className="space-y-3">
            <div className="text-5xl">📤</div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">
                Click to upload or drag & drop
              </p>
              <p className="text-sm text-gray-600 mt-1">
                PNG, JPG, or WebP
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="rounded-xl overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg text-sm">
            <div>
              <p className="text-gray-600">File name</p>
              <p className="font-medium text-gray-900 truncate">
                {file?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-600">File size</p>
              <p className="font-medium text-gray-900">
                {(file?.size || 0) / 1024 < 1024
                  ? `${((file?.size || 0) / 1024).toFixed(1)} KB`
                  : `${((file?.size || 0) / 1024 / 1024).toFixed(2)} MB`}
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-gray-700">Uploading...</span>
                <span className="text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Uploading...
                </span>
              ) : (
                'Upload Image'
              )}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <span className="font-semibold">❌ Error:</span> {error}
          </p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            {success}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Use images at least 600×450px.
          Square or taller images will be auto-fitted to 4:3 ratio. For best results, upload an 800×600px image.
        </p>
      </div>
    </div>
  );
}
