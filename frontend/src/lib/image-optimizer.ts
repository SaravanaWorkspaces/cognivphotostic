import { IMAGE_SIZES, calculateOptimalDimensions, ImageSizeKey } from './image-sizes';

/**
 * Image optimization utilities for preparing images for upload
 */

export interface ImageOptimizationOptions {
  quality?: number; // 0-100, default 85
  format?: 'webp' | 'jpeg' | 'png';
  sizeKey: ImageSizeKey;
}

/**
 * Gets Strapi upload constraints for an image type
 */
export function getStrapiUploadConstraints(sizeKey: ImageSizeKey) {
  const size = IMAGE_SIZES[sizeKey] as any;

  return {
    minWidth: size.minWidth || size.width,
    minHeight: size.minHeight || size.height,
    maxWidth: size.maxWidth || size.width * 1.5,
    maxHeight: size.maxHeight || size.height * 1.5,
    recommendedWidth: size.width,
    recommendedHeight: size.height,
    aspectRatio: size.aspectRatio,
  };
}

/**
 * Reads file and returns image dimensions
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates image file before upload
 */
export async function validateImageUpload(
  file: File,
  sizeKey: ImageSizeKey
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  dimensions: { width: number; height: number };
  optimizedSize: { width: number; height: number };
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    errors.push(
      `Invalid file type. Supported: JPEG, PNG, WebP, GIF. Got: ${file.type}`
    );
  }

  // Check file size (max 5MB)
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSize) {
    errors.push(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 5MB limit`
    );
  }

  let dimensions = { width: 0, height: 0 };
  let optimizedSize = { width: 0, height: 0 };

  try {
    dimensions = await getImageDimensions(file);

    // Check dimensions
    const constraints = getStrapiUploadConstraints(sizeKey);

    if (dimensions.width < constraints.minWidth) {
      errors.push(
        `Image width (${dimensions.width}px) is less than minimum (${constraints.minWidth}px)`
      );
    }

    if (dimensions.height < constraints.minHeight) {
      errors.push(
        `Image height (${dimensions.height}px) is less than minimum (${constraints.minHeight}px)`
      );
    }

    if (dimensions.width > constraints.maxWidth) {
      warnings.push(
        `Image width (${dimensions.width}px) exceeds recommended maximum (${constraints.maxWidth}px)`
      );
    }

    if (dimensions.height > constraints.maxHeight) {
      warnings.push(
        `Image height (${dimensions.height}px) exceeds recommended maximum (${constraints.maxHeight}px)`
      );
    }

    // Calculate optimal size
    const sizeObj = IMAGE_SIZES[sizeKey];
    optimizedSize = calculateOptimalDimensions(
      dimensions.width,
      dimensions.height,
      sizeObj
    );

    if (
      dimensions.width !== optimizedSize.width ||
      dimensions.height !== optimizedSize.height
    ) {
      warnings.push(
        `Image aspect ratio differs from recommended. Current: ${dimensions.width}×${dimensions.height}, Suggested: ${optimizedSize.width}×${optimizedSize.height}`
      );
    }
  } catch (error) {
    errors.push(
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    dimensions,
    optimizedSize,
  };
}

/**
 * Creates a canvas-based image resizer for client-side resizing
 * Useful for creating thumbnails before upload
 */
export function resizeImageOnClient(
  imageSrc: string,
  targetWidth: number,
  targetHeight: number,
  format: 'jpeg' | 'webp' = 'jpeg',
  quality: number = 85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate dimensions maintaining aspect ratio
      let width = targetWidth;
      let height = targetHeight;
      const aspectRatio = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;

      if (aspectRatio > targetAspect) {
        width = targetHeight * aspectRatio;
      } else {
        height = targetWidth / aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image centered
      const x = (width - img.width) / 2;
      const y = (height - img.height) / 2;
      ctx.drawImage(img, x, y);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        `image/${format}`,
        quality / 100
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageSrc;
  });
}
