# Testing Image Upload - Complete Guide

## 🚀 Quick Start

### 1. Access Test Page
```
http://localhost:3000/test-upload
```

### 2. Upload an Image
- **Method 1:** Click the upload area
- **Method 2:** Drag & drop an image
- **Method 3:** Paste from clipboard (in some browsers)

### 3. Verify Success
- Should see preview
- Should see file info
- Should see upload progress
- Should see success message with File ID

---

## 📋 Requirements Check

Before testing, ensure:

✅ **Strapi is running** 
```bash
# In backend directory
npm run develop
# Should be at http://localhost:1337
```

✅ **Frontend is running**
```bash
# In frontend directory
npm run dev
# Should be at http://localhost:3000
```

✅ **API Token is set**
Check `frontend/.env.local`:
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=<your-token>
```

---

## 🧪 Test Cases

### Test 1: Basic Upload
**Goal:** Upload a valid image

**Steps:**
1. Go to http://localhost:3000/test-upload
2. Drag or click to upload `test-image.jpg` (800×600px)
3. Click "Upload Image"

**Expected Result:**
- ✅ Preview shows image
- ✅ File info displays correctly
- ✅ Progress bar appears
- ✅ Success message shows File ID
- ✅ Image appears in Strapi Media Library

**Verify in Strapi:**
```
Admin → Media Library → Should see uploaded image
```

---

### Test 2: Drag & Drop
**Goal:** Test drag-and-drop functionality

**Steps:**
1. Go to http://localhost:3000/test-upload
2. Drag an image file onto the upload area
3. Click "Upload Image"

**Expected Result:**
- ✅ File is selected without clicking
- ✅ Preview appears
- ✅ Upload completes

---

### Test 3: Invalid File Type
**Goal:** Reject non-image files

**Steps:**
1. Try to upload a `.txt` or `.pdf` file
2. Or drag a non-image file

**Expected Result:**
- ❌ "Please select an image file" error
- ❌ File not accepted

---

### Test 4: Image Too Small
**Goal:** Reject images smaller than 600×450px

**Steps:**
1. Create or find a small image (< 600×450px)
2. Try to upload it

**Expected Result:**
- ❌ "Image must be at least 600×450px" error
- ❌ File not accepted

---

### Test 5: Image Too Large (File Size)
**Goal:** Reject files larger than 5MB

**Steps:**
1. Create a very large image file (> 5MB)
2. Try to upload it

**Expected Result:**
- ❌ "File size must be less than 5MB" error
- ❌ Upload prevented

---

### Test 6: Multiple Uploads
**Goal:** Upload multiple images in succession

**Steps:**
1. Upload image 1
2. After success, upload image 2
3. Upload image 3

**Expected Result:**
- ✅ All images upload successfully
- ✅ Each gets unique File ID
- ✅ All appear in Strapi Media Library

---

### Test 7: Change Image
**Goal:** Replace selected image without uploading

**Steps:**
1. Select image 1
2. Click "Change"
3. Select image 2
4. Click "Upload Image"

**Expected Result:**
- ✅ Image 2 is uploaded
- ✅ Image 1 is not uploaded

---

## 📐 Test Images

### Create Test Images (Free Tools)

#### Option 1: Canva (Easiest)
1. Go to https://www.canva.com
2. Create → Custom size → 800×600px
3. Add any design
4. Download as PNG/JPG

#### Option 2: Squoosh (No signup)
1. Go to https://squoosh.app
2. Upload or paste image
3. Resize to 800×600px
4. Download

#### Option 3: ImageMagick (Command line)
```bash
# Create 800×600 test image
convert -size 800x600 gradient:red-blue test-image.jpg

# Resize existing image
convert input.jpg -resize 800x600 output.jpg
```

#### Option 4: ffmpeg
```bash
# Create 800×600 test image
ffmpeg -f lavfi -i color=red:s=800x600:d=1 -frames:v 1 test.jpg
```

### Test Image Sizes

Create these for comprehensive testing:

| Name | Size | Dimensions | Purpose |
|------|------|-----------|---------|
| valid.jpg | 50KB | 800×600 | Valid upload |
| large.jpg | 6MB | 800×600 | Test file size limit |
| small.jpg | 20KB | 400×300 | Test dimension minimum |
| wide.jpg | 50KB | 1600×900 | Test wide aspect ratio |
| tall.jpg | 50KB | 600×800 | Test tall aspect ratio |

---

## 🔍 Debug Checklist

### Upload fails with 401/403 error
- [ ] API token is set in `.env.local`
- [ ] Token is valid (check Strapi admin)
- [ ] Strapi is running

### Upload fails with 404 error
- [ ] Strapi URL is correct
- [ ] Strapi is running on correct port
- [ ] Check STRAPI_URL in `.env.local`

### Upload completes but no success message
- [ ] Check browser console (F12 → Console)
- [ ] Check network tab (F12 → Network)
- [ ] Look for errors in response

### Image appears corrupted in preview
- [ ] Image file is valid
- [ ] Browser can display it locally
- [ ] Try different image format

### Progress bar stuck at 0%
- [ ] Check network tab for hung requests
- [ ] Restart Strapi
- [ ] Check API token validity

---

## 🧩 Components to Test

### CoverImageUploader
**File:** `frontend/src/components/ui/CoverImageUploader.tsx`

**Features to verify:**
- [ ] Drag & drop works
- [ ] Click to browse works
- [ ] Preview displays
- [ ] File info shows correctly
- [ ] Upload progress visible
- [ ] Success/error messages appear
- [ ] Change button works
- [ ] Form submission works

### ImageUploader (Generic)
**File:** `frontend/src/components/ui/ImageUploader.tsx`

**Features to verify:**
- [ ] File selection works
- [ ] Dimension validation works
- [ ] Preview displays
- [ ] Clear button works
- [ ] Error messages display
- [ ] Callback function fires

---

## 📊 Strapi Verification

### Check Uploaded Images

1. **Via Admin UI:**
   ```
   Strapi Admin → Media Library
   → Should see uploaded images
   → Click on image to see URL
   ```

2. **Via API:**
   ```bash
   curl http://localhost:1337/api/upload/files
   
   # Should return list of uploaded files with URLs
   ```

3. **Via Database:**
   ```sql
   -- Check sqlite database
   SELECT * FROM files_folder_file;
   ```

### Get Upload URLs

For each uploaded image, you should get:
- File ID (e.g., 123)
- File URL (e.g., `/uploads/abc123.jpg`)
- Full URL (e.g., `http://localhost:1337/uploads/abc123.jpg`)

---

## 🚨 Common Issues & Solutions

### "Network request failed"
**Cause:** Strapi not running or wrong URL

**Solution:**
1. Check Strapi is running: `npm run develop` in `/backend`
2. Verify URL in `.env.local`: `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
3. Restart both Strapi and frontend

### "401 Unauthorized"
**Cause:** Invalid or missing API token

**Solution:**
1. Get valid token from Strapi Admin → Settings → API Tokens
2. Add to `.env.local`: `NEXT_PUBLIC_STRAPI_API_TOKEN=your-token-here`
3. Restart frontend: `npm run dev`

### "File size exceeds limit"
**Cause:** Image file is too large (> 5MB)

**Solution:**
1. Compress image using TinyPNG: https://tinypng.com
2. Or use ImageMagick:
   ```bash
   convert input.jpg -quality 85 output.jpg
   ```

### "Image dimensions too small"
**Cause:** Image is less than 600×450px

**Solution:**
1. Use larger source image
2. Or resize using Canva/Squoosh
3. Minimum required: 600×450px

### Preview shows but upload hangs
**Cause:** Large file or slow connection

**Solution:**
1. Check file size (max 5MB)
2. Compress image
3. Check network speed
4. Try simpler test image

---

## 📝 Test Report Template

Use this to document test results:

```
TEST DATE: ______________
TESTER: __________________

ENVIRONMENT:
- Frontend: http://localhost:3000
- Strapi: http://localhost:1337
- API Token: [Set] / [Not Set]
- Node Version: ___________

TEST CASE 1: Basic Upload
Result: ☐ PASS ☐ FAIL
Notes: _________________________

TEST CASE 2: Drag & Drop
Result: ☐ PASS ☐ FAIL
Notes: _________________________

TEST CASE 3: Invalid File
Result: ☐ PASS ☐ FAIL
Notes: _________________________

TEST CASE 4: Small Image
Result: ☐ PASS ☐ FAIL
Notes: _________________________

TEST CASE 5: Large File
Result: ☐ PASS ☐ FAIL
Notes: _________________________

TEST CASE 6: Multiple Uploads
Result: ☐ PASS ☐ FAIL
Notes: _________________________

TEST CASE 7: Change Image
Result: ☐ PASS ☐ FAIL
Notes: _________________________

OVERALL: ☐ PASS ☐ FAIL

ISSUES FOUND:
1. ____________________________
2. ____________________________
3. ____________________________

COMMENTS:
_________________________________
_________________________________
```

---

## 🎯 Success Criteria

Upload is working correctly when:

✅ Can select image by click or drag
✅ Image preview displays
✅ File validation works (rejects invalid files)
✅ Dimension validation works (rejects small images)
✅ Upload progress shows
✅ Success message appears with File ID
✅ Image appears in Strapi Media Library
✅ No console errors
✅ Network requests show 200 OK response

---

## 📖 Additional Resources

- [Strapi Upload Documentation](https://docs.strapi.io/user-docs/media-library)
- [Strapi API Tokens](https://docs.strapi.io/user-docs/settings/API-tokens)
- [Testing in Next.js](https://nextjs.org/docs/testing)

---

## Next Steps

Once upload is working:

1. **Integrate with post creation form**
   - Use in admin panel for creating posts
   - Save file ID to post.coverImage

2. **Add to post editing form**
   - Allow changing cover image
   - Handle image replacement

3. **Create admin panel**
   - Full Strapi admin interface
   - Or custom Next.js admin pages

---

**Last Updated:** 2026-05-05
**Status:** Complete and tested
