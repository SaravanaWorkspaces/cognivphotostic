/**
 * Example tests and usage examples for image optimizer utilities
 * These demonstrate how to use the image-optimizer module
 */

import {
  getStrapiUploadConstraints,
  validateImageUpload,
  calculateOptimalDimensions,
} from './image-optimizer';
import { IMAGE_SIZES } from './image-sizes';

// Example usage patterns for image validation and optimization

/**
 * Example 1: Get upload constraints for a specific image type
 */
export function exampleGetConstraints() {
  const constraints = getStrapiUploadConstraints('COVER_IMAGE');
  console.log('Cover image constraints:');
  console.log(`- Min: ${constraints.minWidth}×${constraints.minHeight}px`);
  console.log(`- Recommended: ${constraints.recommendedWidth}×${constraints.recommendedHeight}px`);
  console.log(`- Max: ${constraints.maxWidth}×${constraints.maxHeight}px`);
  console.log(`- Aspect Ratio: ${constraints.aspectRatio}`);

  // Output:
  // Cover image constraints:
  // - Min: 600×450px
  // - Recommended: 800×600px
  // - Max: 1800×1350px
  // - Aspect Ratio: 4:3
}

/**
 * Example 2: Validate image file before upload
 */
export async function exampleValidateUpload(file: File) {
  try {
    const validation = await validateImageUpload(file, 'COVER_IMAGE');

    console.log('Validation result:');
    console.log(`- Valid: ${validation.valid}`);
    console.log(`- Image dimensions: ${validation.dimensions.width}×${validation.dimensions.height}px`);

    if (!validation.valid) {
      console.error('Validation errors:');
      validation.errors.forEach((error) => console.error(`  - ${error}`));
    }

    if (validation.warnings.length > 0) {
      console.warn('Warnings:');
      validation.warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }

    console.log(`- Suggested size: ${validation.optimizedSize.width}×${validation.optimizedSize.height}px`);
  } catch (error) {
    console.error('Failed to validate image:', error);
  }
}

/**
 * Example 3: Calculate optimal dimensions
 */
export function exampleCalculateOptimal() {
  const original = { width: 1600, height: 1200 };
  const size = IMAGE_SIZES.COVER_IMAGE;

  const optimal = calculateOptimalDimensions(
    original.width,
    original.height,
    size
  );

  console.log('Dimension calculation:');
  console.log(`- Original: ${original.width}×${original.height}px`);
  console.log(`- Optimal: ${optimal.width}×${optimal.height}px`);
  console.log(`- Aspect preserved: ${(original.width / original.height).toFixed(3)} === ${(optimal.width / optimal.height).toFixed(3)}`);
}

/**
 * Example 4: Complete upload flow
 */
export async function exampleCompleteUploadFlow(file: File) {
  console.log('=== Image Upload Flow ===\n');

  // Step 1: Get constraints
  const constraints = getStrapiUploadConstraints('COVER_IMAGE');
  console.log('1. Upload constraints loaded');
  console.log(`   Expected: ${constraints.recommendedWidth}×${constraints.recommendedHeight}px\n`);

  // Step 2: Validate file
  const validation = await validateImageUpload(file, 'COVER_IMAGE');
  console.log('2. Image validated');
  console.log(`   Dimensions: ${validation.dimensions.width}×${validation.dimensions.height}px`);
  console.log(`   Valid: ${validation.valid}\n`);

  if (!validation.valid) {
    console.error('Upload failed - validation errors:');
    validation.errors.forEach((err) => console.error(`  - ${err}`));
    return;
  }

  if (validation.warnings.length > 0) {
    console.warn('Upload has warnings:');
    validation.warnings.forEach((warn) => console.warn(`  - ${warn}`));
  }

  // Step 3: Ready to upload
  console.log('3. Image ready for upload');
  console.log(`   File: ${file.name}`);
  console.log(`   Size: ${(file.size / 1024).toFixed(2)} KB`);
  console.log(`   Type: ${file.type}\n`);

  console.log('✅ Ready to upload to Strapi');
}

/**
 * Example 5: Handling different image types
 */
export async function exampleMultipleImageTypes() {
  const imageTypes = ['COVER_IMAGE', 'PRODUCT_IMAGE', 'GALLERY_IMAGE'] as const;

  console.log('=== Image Type Recommendations ===\n');

  for (const type of imageTypes) {
    const size = IMAGE_SIZES[type];
    const constraints = getStrapiUploadConstraints(type);

    console.log(`${size.description}:`);
    console.log(`  - Size: ${constraints.recommendedWidth}×${constraints.recommendedHeight}px`);
    console.log(`  - Min: ${constraints.minWidth}×${constraints.minHeight}px`);
    console.log(`  - Aspect: ${constraints.aspectRatio}\n`);
  }
}

/**
 * Example 6: Error handling patterns
 */
export async function exampleErrorHandling(file: File) {
  try {
    // Check file exists
    if (!file) {
      throw new Error('No file provided');
    }

    // Validate
    const validation = await validateImageUpload(file, 'COVER_IMAGE');

    // Handle validation errors
    if (!validation.valid) {
      const firstError = validation.errors[0];
      throw new Error(`Validation failed: ${firstError}`);
    }

    // Handle warnings (optional - don't throw, just log)
    if (validation.warnings.length > 0) {
      console.warn(`Upload has ${validation.warnings.length} warning(s)`);
      // Show warning to user but allow upload to proceed
    }

    // All good
    console.log('✅ Image passed all validations');
  } catch (error) {
    console.error('❌ Upload failed:', error instanceof Error ? error.message : error);
    // Show error message to user
  }
}

/**
 * Example 7: Using with form submission
 */
export async function exampleFormSubmission(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const file = formData.get('image') as File;

  if (!file) {
    console.error('No image selected');
    return;
  }

  const validation = await validateImageUpload(file, 'COVER_IMAGE');

  if (!validation.valid) {
    // Show form error
    console.error('Please upload a valid image');
    validation.errors.forEach((err) => console.error(`- ${err}`));
    return;
  }

  // Create upload form data
  const uploadData = new FormData();
  uploadData.append('files', file);
  uploadData.append('ref', 'api::post.post');
  uploadData.append('field', 'coverImage');

  // Upload to Strapi
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: uploadData,
  });

  if (response.ok) {
    console.log('✅ Image uploaded successfully');
  } else {
    console.error('❌ Upload failed');
  }
}

// Type definitions for reference
export type ImageUploadValidation = Awaited<ReturnType<typeof validateImageUpload>>;
export type UploadConstraints = ReturnType<typeof getStrapiUploadConstraints>;
