# 🚀 Cover Image Upload - Testing Guide

## What's New

### ✨ New Components

1. **CoverImageUploader** (Simplified & Working)
   - `frontend/src/components/ui/CoverImageUploader.tsx`
   - Drag & drop interface
   - Real-time preview
   - Upload progress indicator
   - Success/error messages
   - Direct Strapi API integration

2. **Test Page**
   - `frontend/src/app/test-upload/page.tsx`
   - Ready-to-use testing interface
   - Built-in troubleshooting guide
   - Quick test steps

### 🔧 Updated Components

- **ImageUploader** - Simplified to core functionality
- **PostCard** - Already has size tooltip

---

## ⚡ Quick Test (5 minutes)

### Step 1: Start Services
```bash
# Terminal 1 - Backend
cd backend
npm run develop

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Step 2: Access Test Page
```
http://localhost:3000/test-upload
```

### Step 3: Create Test Image
Use free tools (no signup required):
- **Canva:** https://www.canva.com (easiest)
- **Squoosh:** https://squoosh.app
- **Command line:** `convert -size 800x600 gradient:red-blue test.jpg`

**Specs needed:**
- Size: 800×600px (or larger)
- Format: JPEG, PNG, or WebP
- File size: < 5MB

### Step 4: Upload & Verify
1. Drag image onto upload area (or click)
2. Click "Upload Image"
3. See progress bar
4. Check success message
5. View File ID in browser alert
6. Verify in Strapi Admin → Media Library

---

## 📝 What Should Happen

### When Upload Works ✅

```
1. Click upload area
   ↓
2. Select or drag image
   ↓
3. Image preview appears
   ↓
4. File info shows (name, size)
   ↓
5. Click "Upload Image"
   ↓
6. Progress bar (0% → 100%)
   ↓
7. Green success message
   ↓
8. File ID displayed
   ↓
9. Image appears in Strapi Media Library
```

### File Validation (Works Automatically)

| Issue | Status | Message |
|-------|--------|---------|
| Non-image file | ❌ Blocked | "Please select an image file" |
| File > 5MB | ❌ Blocked | "File size must be less than 5MB" |
| Image < 600×450px | ❌ Blocked | "Image must be at least 600×450px" |
| Valid image | ✅ Allowed | Shows preview |

---

## 🎯 Simple UI Features

### Upload Area
```
┌─────────────────────────────────┐
│                                 │
│    📤 Click to upload or        │
│    drag & drop                  │
│                                 │
│    Recommended: 800×600px       │
│    Max: 5MB                     │
│                                 │
└─────────────────────────────────┘
```

### After Selection
```
┌─────────────────────────────────┐
│                                 │
│   [Image Preview]               │
│                                 │
│   File name: image.jpg          │
│   File size: 256 KB             │
│                                 │
│  [Upload Image]  [Change]       │
│                                 │
└─────────────────────────────────┘
```

### During Upload
```
Progress: [████████░░░░░░░░░░░░] 40%
```

### After Success
```
✅ Image uploaded successfully!
   File ID: 123
```

---

## 🧪 Test Scenarios

### Scenario 1: Happy Path ✅
1. Select valid image (800×600)
2. Upload
3. See File ID
4. Image in Strapi Media Library

### Scenario 2: File Too Small ❌
1. Select small image (< 600×450)
2. Get error message
3. Select valid image
4. Upload succeeds

### Scenario 3: Change Mind ⟲
1. Select image
2. Click "Change"
3. Select different image
4. Upload

### Scenario 4: Drag & Drop 🎯
1. Drag image onto upload area
2. See preview immediately
3. Click upload
4. Success

---

## 🔍 Debugging

### If upload fails, check:

| Problem | Check |
|---------|-------|
| "Network error" | Is Strapi running? `npm run develop` |
| "401 Unauthorized" | API token in `.env.local`? |
| "404 Not Found" | Correct STRAPI_URL? |
| No progress bar | Check browser console (F12) |
| Preview but no upload | Check Network tab for errors |

### Browser Console (F12)
```javascript
// You should see:
✅ Image selected: 800x600px
✅ Uploading to Strapi...
✅ Upload successful! File ID: 123

// Not:
❌ CORS error
❌ 401 Unauthorized  
❌ Network failure
```

---

## 📁 Files Created/Updated

### New Files
```
frontend/src/components/ui/CoverImageUploader.tsx    [NEW] Working upload component
frontend/src/app/test-upload/page.tsx               [NEW] Test page
TESTING_IMAGE_UPLOAD.md                             [NEW] Detailed test guide
UPLOAD_TESTING_GUIDE.md                             [NEW] This file
```

### Updated Files
```
frontend/src/components/ui/ImageUploader.tsx        [UPDATED] Simplified
```

---

## ✅ Checklist Before Testing

- [ ] Node.js installed (`node --version`)
- [ ] Backend running (`npm run develop` in `/backend`)
- [ ] Frontend running (`npm run dev` in `/frontend`)
- [ ] API token set in `frontend/.env.local`
- [ ] Test image prepared (800×600px)
- [ ] Browser console open (F12)
- [ ] No other services blocking ports 1337 or 3000

---

## 📊 Success Metrics

After testing, you should be able to:

- ✅ Upload image by click or drag
- ✅ See real-time preview
- ✅ See upload progress
- ✅ Get File ID from success message
- ✅ Find image in Strapi Media Library
- ✅ No errors in browser console
- ✅ No CORS or auth errors

---

## 🎨 UI Comparison

### Before (Complex)
```
- Multiple validation messages
- Warning/error separate sections
- Resize utilities
- 6KB component size
```

### After (Simple) ✨
```
- Single error message
- Progress indicator
- Direct upload
- 3.5KB component size
- Cleaner interface
- Emoji feedback
```

---

## Next Steps

After successful testing:

1. **Integrate with forms**
   ```tsx
   import CoverImageUploader from '@/components/ui/CoverImageUploader';
   
   <CoverImageUploader 
     onSuccess={(fileId, url) => {
       // Save to post
     }}
   />
   ```

2. **Use File ID in post**
   ```tsx
   // When creating post
   {
     title: "My Post",
     coverImage: fileId,  // Use this
   }
   ```

3. **Add to admin forms**
   - Create post form
   - Edit post form
   - Product image upload

---

## 🚀 Ready to Test?

1. Go to `http://localhost:3000/test-upload`
2. Follow the steps
3. Upload a test image
4. See success!

---

## 💡 Tips

- **Easiest test image tool:** Canva (free, no login needed)
- **Browser to test:** Chrome/Firefox (both work fine)
- **Expected time:** 5-10 minutes for full testing
- **Most common error:** Forgetting to start Strapi

---

**Version:** 1.0
**Created:** 2026-05-05
**Status:** Ready for testing
