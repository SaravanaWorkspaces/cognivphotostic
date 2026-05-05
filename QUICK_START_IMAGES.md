# Quick Start: Image Sizing & Resizing

## 📋 What Was Delivered

A complete image sizing and resizing system with:
- ✅ Recommended sizes for 5 different use cases
- ✅ Client-side image validation
- ✅ Resizing utilities
- ✅ UI components for uploading and guidance
- ✅ Comprehensive documentation

## 🚀 Quick Examples

### Show Image Size Recommendations

```tsx
import ImageSizeGuide from '@/components/ui/ImageSizeGuide';

<ImageSizeGuide sizeKey="COVER_IMAGE" />
```

### Use Image Upload Component

```tsx
import ImageUploader from '@/components/ui/ImageUploader';

<ImageUploader
  sizeKey="COVER_IMAGE"
  onImageSelect={(file, dimensions) => {
    console.log(`Image: ${dimensions.width}×${dimensions.height}px`);
  }}
/>
```

### Validate Image File

```tsx
import { validateImageUpload } from '@/lib/image-optimizer';

const validation = await validateImageUpload(file, 'COVER_IMAGE');

if (validation.valid) {
  // ✅ Image is good to upload
} else {
  // ❌ Show errors
  validation.errors.forEach(err => console.error(err));
}
```

### Get Size Recommendation String

```tsx
import { getSizeRecommendation } from '@/lib/image-sizes';

const rec = getSizeRecommendation('COVER_IMAGE');
// Returns: "800×600px (4:3)"
```

## 📐 Recommended Image Sizes

| Use Case | Size | Min | Aspect |
|----------|------|-----|--------|
| Blog Cover | 800×600 | 600×450 | 4:3 |
| Post Card | 400×300 | 400×300 | 4:3 |
| Blog Content | 1000×600 | 800×480 | 16:9 |
| Gallery | 500×500 | 400×400 | 1:1 |
| Product | 400×400 | 300×300 | 1:1 |

## 📁 New Files

### Frontend Utilities
- `frontend/src/lib/image-sizes.ts` - Size constants & validation
- `frontend/src/lib/image-optimizer.ts` - Upload & resizing utilities
- `frontend/src/lib/image-optimizer.test.ts` - Usage examples

### UI Components
- `frontend/src/components/ui/ImageSizeGuide.tsx` - Size recommendation UI
- `frontend/src/components/ui/ImageUploader.tsx` - Upload component

### Backend Configuration
- `backend/config/image-sizes.js` - Backend image config

### Documentation
- `IMAGE_GUIDELINES.md` - For content creators
- `DEVELOPER_DOCS.md` - For developers
- `IMPLEMENTATION_SUMMARY.md` - Full technical overview
- `QUICK_START_IMAGES.md` - This file

### Updated Files
- `frontend/src/components/blog/PostCard.tsx` - Added size tooltip

## 🎯 Usage by Role

### Content Creator
1. Read `IMAGE_GUIDELINES.md`
2. Use recommended image sizes
3. Use ImageUploader component (if available in admin)

### Frontend Developer
1. Read `DEVELOPER_DOCS.md`
2. Import utilities from `src/lib/image-sizes.ts` and `src/lib/image-optimizer.ts`
3. Use `ImageUploader` and `ImageSizeGuide` components

### Backend Developer
1. Check `backend/config/image-sizes.js`
2. Can create Strapi hooks using image size config
3. See `DEVELOPER_DOCS.md` for Strapi integration

## 🔍 Key Functions

### Validation
```tsx
import { validateImageUpload } from '@/lib/image-optimizer';

const result = await validateImageUpload(file, 'COVER_IMAGE');
// {
//   valid: boolean,
//   errors: string[],
//   warnings: string[],
//   dimensions: { width: number, height: number },
//   optimizedSize: { width: number, height: number }
// }
```

### Size Constants
```tsx
import { IMAGE_SIZES } from '@/lib/image-sizes';

IMAGE_SIZES.COVER_IMAGE
// {
//   width: 800,
//   height: 600,
//   aspectRatio: '4:3',
//   minWidth: 600,
//   minHeight: 450,
//   maxWidth: 1200,
//   maxHeight: 900,
//   description: 'Blog post cover image'
// }
```

### Utility Functions
```tsx
import { 
  getSizeRecommendation,
  calculateOptimalDimensions,
  validateImageSize,
  getImageDimensions 
} from '@/lib/image-optimizer';

// Get human-readable size
getSizeRecommendation('COVER_IMAGE'); // "800×600px (4:3)"

// Calculate best fit dimensions
calculateOptimalDimensions(1600, 1200, IMAGE_SIZES.COVER_IMAGE);
// { width: 800, height: 600 }

// Validate dimensions
validateImageSize(800, 600, 'COVER_IMAGE');
// { valid: true, errors: [] }

// Extract image dimensions
const dims = await getImageDimensions(file);
// { width: 1600, height: 1200 }
```

## 🛠️ Implementation Checklist

- [x] Size constants defined for all use cases
- [x] Client-side validation utilities
- [x] Image dimension extraction
- [x] Aspect ratio checking
- [x] File size validation (max 5MB)
- [x] UI components created
- [x] Upload component with preview
- [x] Size recommendation guides
- [x] Backend configuration
- [x] User documentation
- [x] Developer documentation
- [x] Usage examples

## 📖 Documentation Files

### For Everyone
- `QUICK_START_IMAGES.md` ← You are here

### For Content Creators
- `IMAGE_GUIDELINES.md` - How to prepare images

### For Developers
- `DEVELOPER_DOCS.md` - Technical guide
- `IMPLEMENTATION_SUMMARY.md` - Full details

### Code Examples
- `frontend/src/lib/image-optimizer.test.ts` - 7 example patterns

## 🔗 Integration Points

### PostCard Component
```tsx
// Now shows tooltip with recommended size
<div title={`Recommended cover image size: 800×600px (4:3)`}>
  <Image src={imageUrl} ... />
</div>
```

### In Forms
```tsx
// Use ImageUploader component for file selection
<ImageUploader 
  sizeKey="COVER_IMAGE"
  onImageSelect={handleImageSelected}
/>
```

### In Validation
```tsx
// Validate before upload
const validation = await validateImageUpload(file, sizeKey);
if (!validation.valid) {
  showErrorsToUser(validation.errors);
}
```

## ⚙️ Configuration

### Change Recommended Sizes
Edit `frontend/src/lib/image-sizes.ts`:
```tsx
export const IMAGE_SIZES = {
  COVER_IMAGE: {
    width: 800,  // Change this
    height: 600, // Change this
    // ...
  }
}
```

### Change Validation Rules
Edit `frontend/src/lib/image-optimizer.ts`:
- `MAX_FILE_SIZE` - Default 5MB
- Validation logic in `validateImageUpload()`

### Sync with Backend
Update `backend/config/image-sizes.js` to match frontend config.

## 🧪 Testing

### Test Validation
```tsx
const file = /* user selected file */;
const result = await validateImageUpload(file, 'COVER_IMAGE');
console.log(result.valid); // true/false
```

### Test Component
```tsx
// In your component
<ImageUploader
  sizeKey="COVER_IMAGE"
  onImageSelect={(file, dims) => {
    console.log(`Selected: ${dims.width}×${dims.height}px`);
  }}
/>
```

### Test Size Recommendation
Hover over any post card image to see tooltip with recommended size.

## 🚨 Common Issues

### "Image dimensions don't match"
- Check recommended size for your use case
- Ensure aspect ratio is correct
- Use tools like Canva or ImageOptim to resize

### "File too large"
- Image must be under 5MB
- Use TinyPNG or ImageOptim to compress
- JPEG usually smaller than PNG

### "Validation always fails"
- Check file format (JPEG, PNG, WebP)
- Verify image is actual image file
- Check browser console for CORS errors

## 📞 Need Help?

1. **For image preparation**: Read `IMAGE_GUIDELINES.md`
2. **For code questions**: Read `DEVELOPER_DOCS.md`
3. **For implementation details**: Read `IMPLEMENTATION_SUMMARY.md`
4. **For examples**: Check `frontend/src/lib/image-optimizer.test.ts`
5. **For component usage**: See component source code comments

## 🎉 What's Next?

The system is ready to use! You can:
1. Use `ImageUploader` component in forms
2. Display `ImageSizeGuide` to guide users
3. Call validation utilities before upload
4. Access size constants in your code
5. Reference documentation as needed

---

**Created on**: 2026-05-05  
**Status**: ✅ Ready to use  
**Documentation**: Complete
