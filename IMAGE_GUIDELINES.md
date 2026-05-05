# Image Size Guidelines

This document provides recommendations for image sizes used throughout the CognivPhotostic platform.

## Recommended Sizes by Use Case

### 📝 Blog Post Cover Images
- **Recommended Size:** 800×600px
- **Aspect Ratio:** 4:3
- **Minimum:** 600×450px
- **Maximum:** 1200×900px
- **Use Case:** Featured image on blog post cards and detail pages
- **Optimization:** Ensures fast loading on both desktop and mobile

### 🏷️ Post Card Thumbnails
- **Size:** 400×300px
- **Aspect Ratio:** 4:3
- **Use Case:** Displayed in blog post grid/list views
- **Note:** Usually a derivative of the cover image

### 📰 Full-Width Content Images
- **Recommended Size:** 1000×600px
- **Aspect Ratio:** 16:9
- **Minimum:** 800×480px
- **Use Case:** Images displayed in the blog post content (ImageBlock)
- **Optimization:** Scales responsively across all screen sizes

### 🖼️ Gallery Images
- **Size:** 500×500px
- **Aspect Ratio:** 1:1
- **Minimum:** 400×400px
- **Use Case:** Images in gallery blocks within blog posts
- **Optimization:** Square format works best for grids

### 🛍️ Product Images
- **Recommended Size:** 400×400px
- **Aspect Ratio:** 1:1
- **Minimum:** 300×300px
- **Maximum:** 600×600px
- **Use Case:** Product cards on the products page
- **Optimization:** Square format for consistent product grid display

## How to Prepare Images

### Best Practices

1. **Start with high-quality source:** Use images at least 1.5x the recommended size
2. **Maintain aspect ratio:** Use the specified aspect ratio to avoid distortion
3. **Compress before upload:** Use tools like TinyPNG or ImageOptim
4. **Use appropriate formats:**
   - JPEG for photographs
   - PNG for images with transparency
   - WebP for modern browsers (Strapi auto-converts)

### Tools for Image Optimization

**Online Tools:**
- [TinyPNG](https://tinypng.com/) - Compress PNG/JPEG
- [ImageOptim](https://imageoptim.com/) - Batch optimize images
- [Canva](https://www.canva.com/) - Create and resize images
- [Squoosh](https://squoosh.app/) - Advanced image compression

**Command Line:**
```bash
# Using ImageMagick
convert input.jpg -resize 800x600 -quality 85 output.jpg

# Using FFmpeg
ffmpeg -i input.jpg -vf scale=800:600 output.jpg
```

## Implementation Details

### Frontend Utilities

The frontend provides helper utilities for image validation and optimization in `/src/lib/`:

- **`image-sizes.ts`** - Size constants and validation functions
- **`image-optimizer.ts`** - Upload validation and client-side resizing

### Using Image Size Guide Component

To display image size recommendations in your components:

```tsx
import ImageSizeGuide from '@/components/ui/ImageSizeGuide';

export default function MyComponent() {
  return (
    <>
      <ImageSizeGuide sizeKey="COVER_IMAGE" />
      
      {/* Compact version */}
      <ImageSizeGuide sizeKey="COVER_IMAGE" compact />
    </>
  );
}
```

### Validating Image Uploads

```tsx
import { validateImageUpload } from '@/lib/image-optimizer';

async function handleImageUpload(file: File) {
  const validation = await validateImageUpload(file, 'COVER_IMAGE');
  
  if (!validation.valid) {
    validation.errors.forEach(err => console.error(err));
    return;
  }
  
  if (validation.warnings.length > 0) {
    validation.warnings.forEach(warn => console.warn(warn));
  }
  
  // Proceed with upload
}
```

### Getting Image Dimensions

```tsx
import { getImageDimensions } from '@/lib/image-optimizer';

const file = /* user selected file */;
const { width, height } = await getImageDimensions(file);
console.log(`Image is ${width}×${height}px`);
```

## Strapi Configuration

In Strapi Admin UI, you can set image constraints on media fields:

1. Go to Content-Type Builder
2. Select the content type (e.g., "Post")
3. Click on the media field (e.g., "coverImage")
4. In field settings, you can add:
   - Required: true/false
   - Accept specific file types
   - Size limitations

### Recommended Field Configuration for Posts

**Cover Image Field:**
```
Required: Yes
Multiple: No
Accepted file types: Images
```

## Responsive Images with Next.js

The platform uses Next.js Image component which automatically:
- Optimizes images at build time and runtime
- Generates multiple image formats (WebP, etc.)
- Serves appropriately sized images based on device
- Implements lazy loading

Example usage:
```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## Performance Tips

1. **Lazy load when possible:** Images below the fold should be lazy-loaded
2. **Use placeholder:** Provide blur placeholders for better perceived performance
3. **Optimize formats:** Let Next.js serve WebP to modern browsers
4. **Monitor file size:** Keep images under 200KB after compression
5. **Use appropriate srcSet:** Let browsers download right-sized images

## Image Quality Checklist

Before uploading an image, verify:

- ✅ Correct dimensions (matches recommended size)
- ✅ Proper aspect ratio (no letterboxing/pillarboxing)
- ✅ File size < 200KB after optimization
- ✅ No watermarks or artifacts
- ✅ Alt text is descriptive (for accessibility)
- ✅ Image is relevant to the content
- ✅ File format is appropriate (JPEG for photos, PNG for diagrams)

## SEO Considerations

- Use descriptive alt text for all images
- Include relevant keywords in alt text (naturally)
- Optimize file names: `blog-post-title-description.jpg`
- Add image captions for context
- Use schema markup for images when relevant

## Troubleshooting

### Image appears blurry
- Ensure image is at least the minimum recommended size
- Check if image is being stretched beyond original dimensions

### Image takes too long to load
- Reduce file size using compression tools
- Check image format (JPEG is usually smaller than PNG)
- Enable responsive images with Next.js

### Image aspect ratio is wrong
- Verify image was resized to correct dimensions
- Check CSS/layout isn't forcing different aspect ratio
- Consider using CSS aspect-ratio property instead of fixed dimensions

## Additional Resources

- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev Image Optimization](https://web.dev/image-optimization/)
- [MDN Image Performance](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
