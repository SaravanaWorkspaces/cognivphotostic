// Recommended image sizes for different use cases
export const IMAGE_SIZES = {
  // Cover image for blog posts (used in PostCard and blog detail view)
  COVER_IMAGE: {
    width: 800,
    height: 600,
    aspectRatio: '4:3',
    minWidth: 600,
    minHeight: 450,
    maxWidth: 1200,
    maxHeight: 900,
    description: 'Blog post cover image',
  },
  // Thumbnail for post cards (displayed as 400x300 in grid)
  POST_CARD_THUMB: {
    width: 400,
    height: 300,
    aspectRatio: '4:3',
    minWidth: 400,
    minHeight: 300,
    description: 'Post card thumbnail',
  },
  // Full-width image in blog post content
  CONTENT_IMAGE: {
    width: 1000,
    height: 600,
    aspectRatio: '16:9',
    minWidth: 800,
    minHeight: 480,
    description: 'Content block image',
  },
  // Gallery images in blog posts
  GALLERY_IMAGE: {
    width: 500,
    height: 500,
    aspectRatio: '1:1',
    minWidth: 400,
    minHeight: 400,
    description: 'Gallery image',
  },
  // Product image in product cards
  PRODUCT_IMAGE: {
    width: 400,
    height: 400,
    aspectRatio: '1:1',
    minWidth: 300,
    minHeight: 300,
    maxWidth: 600,
    maxHeight: 600,
    description: 'Product image',
  },
} as const;

export type ImageSizeKey = keyof typeof IMAGE_SIZES;

export interface ImageSize {
  width: number;
  height: number;
  aspectRatio: string;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  description: string;
}

/**
 * Validates if an image meets size requirements for a given use case
 */
export function validateImageSize(
  imageWidth: number,
  imageHeight: number,
  sizeKey: ImageSizeKey
): { valid: boolean; errors: string[] } {
  const size = IMAGE_SIZES[sizeKey] as any;
  const errors: string[] = [];

  if (size.minWidth && imageWidth < size.minWidth) {
    errors.push(
      `Image width must be at least ${size.minWidth}px (current: ${imageWidth}px)`
    );
  }

  if (size.minHeight && imageHeight < size.minHeight) {
    errors.push(
      `Image height must be at least ${size.minHeight}px (current: ${imageHeight}px)`
    );
  }

  if (size.maxWidth && imageWidth > size.maxWidth) {
    errors.push(
      `Image width should not exceed ${size.maxWidth}px (current: ${imageWidth}px)`
    );
  }

  if (size.maxHeight && imageHeight > size.maxHeight) {
    errors.push(
      `Image height should not exceed ${size.maxHeight}px (current: ${imageHeight}px)`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates dimensions to fit within the recommended size while maintaining aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number,
  originalHeight: number,
  targetSize: ImageSize
): { width: number; height: number } {
  const targetAspectRatio = targetSize.width / targetSize.height;
  const originalAspectRatio = originalWidth / originalHeight;

  let width = targetSize.width;
  let height = targetSize.height;

  if (originalAspectRatio > targetAspectRatio) {
    // Image is wider than target aspect ratio
    height = targetSize.width / originalAspectRatio;
  } else {
    // Image is taller than target aspect ratio
    width = targetSize.height * originalAspectRatio;
  }

  // Ensure we don't exceed max bounds if they exist
  if (targetSize.maxWidth && width > targetSize.maxWidth) {
    width = targetSize.maxWidth;
    height = width / originalAspectRatio;
  }

  if (targetSize.maxHeight && height > targetSize.maxHeight) {
    height = targetSize.maxHeight;
    width = height * originalAspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Generates a srcset string for responsive images
 */
export function generateSrcSet(
  baseUrl: string,
  sizeKey: ImageSizeKey,
  useFormats: boolean = true
): string {
  const size = IMAGE_SIZES[sizeKey];
  const widths = [size.width, size.width * 1.5, size.width * 2];

  return widths
    .map((w) => {
      const url = new URL(baseUrl, 'http://localhost');
      if (useFormats) {
        url.searchParams.set('w', w.toString());
      }
      return `${url.toString()} ${w}w`;
    })
    .join(', ');
}

/**
 * Gets the recommended size information for UI display
 */
export function getSizeRecommendation(sizeKey: ImageSizeKey): string {
  const size = IMAGE_SIZES[sizeKey];
  return `${size.width}×${size.height}px (${size.aspectRatio})`;
}
