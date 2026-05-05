'use client';

import { useState, useRef } from 'react';
import { IMAGE_SIZES, ImageSizeKey } from '@/lib/image-sizes';

interface ImageUploaderProps {
  sizeKey: ImageSizeKey;
  onImageSelect: (file: File, dimensions: { width: number; height: number }) => void;
  disabled?: boolean;
}

export default function ImageUploader({
  sizeKey,
  onImageSelect,
  disabled = false,
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sizeInfo = IMAGE_SIZES[sizeKey] as any;

  const handleFileSelect = (file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (img.width < (sizeInfo.minWidth || sizeInfo.width) ||
          img.height < (sizeInfo.minHeight || sizeInfo.height)) {
        setError(
          `Image must be at least ${sizeInfo.minWidth || sizeInfo.width}×${sizeInfo.minHeight || sizeInfo.height}px`
        );
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file, { width: img.width, height: img.height });
    };

    img.onerror = () => {
      setError('Failed to load image');
    };

    img.src = URL.createObjectURL(file);
  };

  const handleDragAndDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragAndDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
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
            disabled={disabled}
            className="hidden"
          />

          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="font-semibold text-gray-700">
              Click to upload or drag & drop
            </p>
            <p className="text-sm text-gray-600">
              Recommended: {sizeInfo.width}×{sizeInfo.height}px
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
            >
              Change
            </button>
            <button
              onClick={clearSelection}
              disabled={disabled}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ {error}
        </div>
      )}
    </div>
  );
}
