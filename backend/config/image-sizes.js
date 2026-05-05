/**
 * Image size configuration for CognivPhotostic
 * Used to validate and optimize images across the platform
 */

module.exports = {
  // Blog post cover images
  coverImage: {
    name: 'Blog Post Cover Image',
    width: 800,
    height: 600,
    aspectRatio: '4:3',
    minWidth: 600,
    minHeight: 450,
    maxWidth: 1200,
    maxHeight: 900,
    formats: ['webp', 'jpeg', 'png'],
  },

  // Post card thumbnails (derivative of cover image)
  postCardThumb: {
    name: 'Post Card Thumbnail',
    width: 400,
    height: 300,
    aspectRatio: '4:3',
    minWidth: 400,
    minHeight: 300,
    formats: ['webp', 'jpeg', 'png'],
  },

  // Full-width content images
  contentImage: {
    name: 'Content Block Image',
    width: 1000,
    height: 600,
    aspectRatio: '16:9',
    minWidth: 800,
    minHeight: 480,
    formats: ['webp', 'jpeg', 'png'],
  },

  // Gallery images
  galleryImage: {
    name: 'Gallery Image',
    width: 500,
    height: 500,
    aspectRatio: '1:1',
    minWidth: 400,
    minHeight: 400,
    formats: ['webp', 'jpeg', 'png'],
  },

  // Product images
  productImage: {
    name: 'Product Image',
    width: 400,
    height: 400,
    aspectRatio: '1:1',
    minWidth: 300,
    minHeight: 300,
    maxWidth: 600,
    maxHeight: 600,
    formats: ['webp', 'jpeg', 'png'],
  },
};
