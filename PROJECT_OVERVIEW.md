# CognivPhotostic - Project Overview

## What is CognivPhotostic?

CognivPhotostic is a **SEO-first blog platform with affiliate marketing capabilities** designed for the home decor, interior design, and lifestyle niche. It combines content creation with revenue generation through affiliate partnerships.

### Core Purpose
- **Content Publishing:** Publish beautiful, SEO-optimized blog posts about home decor and design
- **Revenue Generation:** Monetize content through affiliate links (earn commissions when readers purchase)
- **Audience Engagement:** Track which products drive clicks and optimize based on performance
- **Professional Presentation:** High-performance, mobile-responsive website built with modern tech

---

## What Can You Do With CognivPhotostic?

### 1. Create & Publish Blog Posts
- Write articles with rich text formatting
- Add cover images and galleries
- Embed product recommendations with affiliate links
- Include detailed product comparisons
- Organize posts by category and tags
- Auto-generate SEO metadata (meta titles, descriptions, social sharing images)

### 2. Manage Products
- Add products with pricing, descriptions, and affiliate URLs
- Track commission rates for each product
- Link products to blog posts
- Manage product inventory and availability

### 3. Track Affiliate Clicks
- Monitor every time a reader clicks on an affiliate link
- Know which blog post drove each click
- Identify your top-performing products
- Measure ROI on content

### 4. Grow Your Audience
- SEO-optimized content automatically ranks better
- Fast-loading pages (optimized for Core Web Vitals)
- Mobile-responsive design (looks perfect on phones & tablets)
- Social sharing metadata (better click-through rates)

---

## Tech Stack (What Powers It)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 15 | Fast, SEO-optimized website |
| **Backend CMS** | Strapi 5 | Content management (admin interface) |
| **Database** | MySQL (production) / SQLite (testing) | Store posts, products, clicks |
| **Hosting** | Hostinger VPS (backend) + Vercel/self-hosted (frontend) | Production deployment |
| **Styling** | Tailwind CSS 3 | Beautiful, responsive design |
| **Language** | TypeScript | Type-safe, maintainable code |

---

## How Everything Works Together

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Reader/Visitor)                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                   Visits Website
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
    Homepage           Blog Page          Products Page
    (Featured          (Post Listing)     (All Products)
     Posts)            [slug]

                           │
                  Reads Post & Clicks
                  "View Product" Button
                           │
                           ▼
                  ┌────────────────────┐
                  │ Affiliate Route    │ ← Logs click (productId, postId, IP)
                  │ /api/affiliate/[id]│
                  └────────────────────┘
                           │
                  302 Redirect to Merchant
                           │
                           ▼
                  Merchant Website
                  (Amazon, Wayfair, etc)
                           │
                  Reader Buys Product
                           │
                           ▼
                  YOU EARN COMMISSION ✓


┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN (Content Creator)                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                Log in to Strapi Admin
                (strapi-server:1337/admin)
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   Create Posts        Create Products    Manage Categories
   - Title             - Name              - Name
   - Excerpt           - Description       - Description
   - Cover Image       - Price
   - Content Blocks    - Affiliate URL
   - SEO Metadata      - Commission Rate
   - Categories/Tags
   - Product Embeds
   - Publish/Draft

```

---

## Key Features Explained

### 1. Dynamic Content Blocks
Instead of just plain text, you can build posts using **blocks**:
- **Text Block:** Rich text with formatting, lists, links
- **Image Block:** Single image with caption
- **Gallery Block:** Multiple images in responsive grid
- **Product Embed:** Product card with "Shop Now" button (affiliate link)
- **Comparison Table:** Feature-by-feature comparison of products

Example: A post about "5 Best Sofas for Modern Living Rooms" could have:
- Text block (intro)
- Image block (sofa photo)
- Comparison table (sofa specs)
- Product embed (Amazon affiliate link)

### 2. Automatic SEO Optimization
Every post has SEO fields:
- **Meta Title:** Appears in Google search results
- **Meta Description:** Summary shown under title
- **OG Image:** Custom image for social sharing
- **Canonical URL:** Prevent duplicate content issues
- **Keywords:** For internal reference

### 3. Affiliate Click Tracking
Every click is recorded with:
- **Product ID:** Which product was clicked
- **Post ID:** Which post drove the click
- **Visitor IP:** Where the visitor came from (geographic)
- **User Agent:** Device type (mobile/desktop)
- **Referrer:** Where visitor came from before your site

**Why this matters:** You can analyze "Product X performs best in Post Y" and create more similar content.

### 4. Performance & SEO
- **Incremental Static Regeneration (ISR):** Pages cache for 30 min to 24 hours, then refresh
- **Server Components:** Faster rendering, better SEO
- **Image Optimization:** Automatic resizing and lazy loading
- **Mobile First:** Responsive design works on all devices

---

## How Money Flows

```
Reader Clicks → Affiliate Link → Merchant → Reader Buys
                                              ↓
                                        Merchant Issues
                                        Commission to Network
                                        (Amazon Associates,
                                         ShareASale, etc)
                                              ↓
                                         YOU GET PAID
                                         (Monthly/Quarterly)
```

**Example:**
- You write: "Best Standing Desks for Home Offices"
- You embed Amazon affiliate link (10% commission)
- Reader clicks "View Product" on your site
- Reader buys desk ($400)
- You earn $40 commission

Multiply by 100 readers, 10 products, and you have a sustainable revenue stream.

---

## File Structure

```
cognivphotostic/
├── backend/                           # Strapi CMS Server
│   ├── src/
│   │   ├── api/
│   │   │   ├── post/                  # Blog posts content type
│   │   │   ├── product/               # Products content type
│   │   │   ├── category/              # Categories
│   │   │   ├── tag/                   # Tags
│   │   │   └── affiliate-click/       # Click tracking collection
│   │   └── components/
│   │       ├── blocks/                # Content block schemas
│   │       │   ├── text.json
│   │       │   ├── image.json
│   │       │   ├── gallery.json
│   │       │   ├── product-embed.json
│   │       │   └── comparison-table.json
│   │       └── shared/
│   │           └── seo.json           # SEO metadata component
│   └── package.json
│
├── frontend/                          # Next.js Website
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx           # Blog listing
│   │   │   │   └── [slug]/page.tsx    # Individual blog post
│   │   │   ├── category/
│   │   │   │   └── [slug]/page.tsx    # Category archive
│   │   │   ├── products/
│   │   │   │   └── page.tsx           # Products listing
│   │   │   ├── api/
│   │   │   │   ├── health/            # Health check endpoint
│   │   │   │   └── affiliate/[id]/    # Affiliate redirect
│   │   │   └── layout.tsx             # Root layout (Header/Footer)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx         # Navigation
│   │   │   │   └── Footer.tsx
│   │   │   ├── blog/
│   │   │   │   ├── PostCard.tsx       # Post card component
│   │   │   │   ├── PostGrid.tsx       # Grid of posts
│   │   │   │   ├── Pagination.tsx     # Page navigation
│   │   │   │   └── blocks/
│   │   │   │       ├── BlockRenderer.tsx    # Routes to correct block type
│   │   │   │       ├── TextBlock.tsx
│   │   │   │       ├── ImageBlock.tsx
│   │   │   │       ├── GalleryBlock.tsx
│   │   │   │       ├── ProductEmbed.tsx
│   │   │   │       └── ComparisonTable.tsx
│   │   │   ├── products/
│   │   │   │   └── ProductCard.tsx    # Product card component
│   │   │   └── ui/
│   │   │       ├── CategoryBadge.tsx
│   │   │       └── TagList.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                 # Strapi fetch functions
│   │   │   └── config.ts              # Configuration
│   │   └── types/index.ts             # TypeScript type definitions
│   └── package.json
│
└── README.md
```

---

## Success Metrics to Track

1. **Traffic:** Google Analytics - How many people visit
2. **Engagement:** Time on page, bounce rate - Are people reading?
3. **Click-Through Rate:** Affiliate clicks / visitors - Is content converting?
4. **Revenue:** Commission earned - Is it worth the effort?
5. **Search Rankings:** Google Search Console - Are you ranking?
6. **Product Performance:** Which products drive most clicks - What should you write more about?

---

## Security & Privacy

✓ **Data Protection:** Reader IPs logged for analytics (GDPR compliant with disclosure)
✓ **No Passwords Stored:** Affiliate URLs redirect securely
✓ **HTTPS Only:** All communication encrypted
✓ **No Cookies:** No tracking cookies (unless you add Google Analytics)
✓ **CORS Protected:** API is protected from unauthorized access

---

## Next Steps

1. **Read the [Admin Guide](./ADMIN_GUIDE.md)** - How to set up and manage content
2. **Read the [Content Creator Guide](./CONTENT_CREATOR_GUIDE.md)** - How to write and publish posts
3. **Read the [Deployment Guide](./DEPLOYMENT_GUIDE.md)** - How to go live
4. **Check [Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and fixes

---

## Support & Customization

### Built With
- **Next.js 15** - React framework
- **Strapi 5** - Headless CMS
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Can Be Extended With
- Google Analytics (track visitor behavior)
- Mailchimp (collect email subscribers)
- Cloudinary (advanced image management)
- CDN (faster global delivery)
- Custom analytics dashboard

---

## License & Usage Rights

This project is built with open-source tools. You own all your content (blog posts, products, affiliate relationships). The code is provided as-is for your use.

---

**Last Updated:** May 2, 2026
**Version:** 1.0 (Phase 5 Complete)
