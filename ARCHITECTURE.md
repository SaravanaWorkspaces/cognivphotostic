# Architecture

## System Overview

CognivPhotostic follows a **headless CMS architecture** where the content management system (Strapi) is completely separate from the website (Next.js).

```
┌─────────────────────────────────────────────────────────┐
│                    THE INTERNET                         │
│                   (Your Visitors)                       │
└──────────────────────────┬──────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
         ┌──────▼───────┐      ┌──────▼────────┐
         │   Next.js    │      │ Strapi Admin  │
         │   Website    │      │   Dashboard   │
         │ (3000)       │      │   (1337)      │
         └──────┬───────┘      └──────┬────────┘
                │                     │
                └──────────┬──────────┘
                           │
                    ┌──────▼──────┐
                    │   Strapi    │
                    │   API       │
                    │  (1337)     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    │  MySQL/     │
                    │  SQLite     │
                    └─────────────┘
```

---

## How Everything Works Together

### 1. Content Creation (Admin Side)

**Admin goes to:** `http://localhost:1337/admin`

```
Admin Dashboard → Creates/edits posts → Strapi saves to database
```

**Admin actions:**
- Create post with content blocks
- Upload images
- Link category and tags
- Add product recommendations
- Hit "Publish"

Strapi stores this in the database.

### 2. Content Delivery (Visitor Side)

**Visitor goes to:** `http://localhost:3000`

```
Visitor visits page → Next.js fetches from Strapi → Renders HTML → Browser displays
```

**What happens:**
1. Visitor loads `/blog/my-post-slug`
2. Next.js API route calls Strapi: `GET /api/posts?filters[slug]=my-post-slug`
3. Strapi returns post data with all content blocks
4. Next.js renders the page HTML
5. Browser shows the post to visitor

### 3. Affiliate Tracking (Monetization)

**Visitor clicks "View Product":**

```
Visitor clicks link → /api/affiliate/123 → Logs click → Redirects to merchant
```

**Detailed flow:**
1. Product button links to `/api/affiliate/123?postId=456`
2. Next.js route handler `/api/affiliate/[id]/route.ts` receives the request
3. Route handler:
   - Fetches product 123 from Strapi
   - Extracts the affiliate URL
   - Calls `POST /api/affiliate-clicks` to log the click
   - Returns HTTP 302 redirect to merchant URL
4. Browser redirects to merchant (e.g., Amazon)
5. Visitor potentially buys → You get commission
6. Database logs: "Product 123 from Post 456 was clicked from IP X"

---

## Data Flow Diagram

### Creating a Post with Products

```
┌─────────────┐
│    Admin    │
│  Creates    │
│    Post     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Strapi Admin Form      │
│  - Title                │
│  - Content blocks       │
│  - Product embeds       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Strapi Backend         │
│  - Validates data       │
│  - Saves to DB          │
│  - Triggers events      │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Database               │
│  posts table            │
│  affiliate_links table  │
└─────────────────────────┘
```

### Displaying a Post

```
┌──────────┐
│  Visitor │
│ Requests │
│ /blog/x  │
└──────┬───┘
       │
       ▼
┌──────────────────────┐
│  Next.js Page        │
│  [slug]/page.tsx     │
└──────┬───────────────┘
       │
       ├─→ fetchStrapi(`/posts?filters[slug]=${slug}`)
       │
       ▼
┌──────────────────────┐
│  Strapi API          │
│  /api/posts          │
│  Returns JSON        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Database Query      │
│  Select from posts   │
│  Join with blocks    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Strapi Returns      │
│  Post data + blocks  │
│  as JSON             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Next.js Renders     │
│  - Parses JSON       │
│  - Maps blocks to    │
│    React components  │
│  - Generates HTML    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Browser             │
│  Displays post       │
│  to visitor          │
└──────────────────────┘
```

### Tracking an Affiliate Click

```
┌──────────────┐
│  Visitor     │
│  Clicks      │
│  "View →     │
│  Product"    │
└──────┬───────┘
       │
       ├─→ Browser navigates to:
       │   /api/affiliate/123?postId=456
       │
       ▼
┌─────────────────────────────┐
│  Next.js Route Handler      │
│  /api/affiliate/[id]/       │
│  route.ts                   │
└──────┬──────────────────────┘
       │
       ├─→ Get product ID from URL
       │
       ├─→ fetchStrapi(`/products/123`)
       │
       ▼
┌─────────────────────────────┐
│  Strapi API                 │
│  Returns product with       │
│  affiliateUrl               │
└──────┬──────────────────────┘
       │
       ├─→ Extract: product.affiliateUrl
       │
       ├─→ Collect request headers:
       │   - IP address
       │   - User-Agent
       │   - Referer
       │
       ▼
┌─────────────────────────────┐
│  Call trackAffiliateClick() │
│  POST /api/affiliate-clicks │
│  Body:                      │
│  {                          │
│    productId: 123,          │
│    postId: 456,             │
│    ip: "192.168.1.1",       │
│    userAgent: "...",        │
│    url: "amazon.com/..."    │
│  }                          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Strapi API                 │
│  Creates affiliate_click    │
│  record                     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Database                   │
│  INSERT into                │
│  affiliate_clicks table     │
└──────┬──────────────────────┘
       │
       ▼ (Meanwhile, route handler continues)
┌─────────────────────────────┐
│  Return HTTP 302 Redirect   │
│  Location: affiliateUrl     │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Browser                    │
│  Redirects to merchant      │
│  (e.g., Amazon)             │
└─────────────────────────────┘
```

---

## Key Components

### Backend: Strapi
- **Role:** Data storage and REST API
- **Handles:** Content creation, user auth, API access
- **Database:** MySQL (production) or SQLite (dev)
- **Exposes:** REST API at `/api/...`

### Frontend: Next.js
- **Role:** Website rendering and user interface
- **Handles:** Page rendering, API integration, affiliate tracking
- **Features:** ISR (cached pages), Server Components, TypeScript
- **Calls:** Strapi API to fetch content

### Database
- **Stores:** All posts, products, categories, tags, affiliate clicks
- **Schema:** Auto-generated by Strapi from content types

---

## Content Block System

Posts support multiple content block types for flexibility:

```
Post {
  id: 1
  title: "My Awesome Post"
  blocks: [
    {
      __component: "blocks.text-block"
      text: "Some paragraph text..."
    },
    {
      __component: "blocks.image-block"
      image: { url: "/uploads/pic.jpg" }
    },
    {
      __component: "blocks.product-embed"
      product: { id: 5, name: "Chair", affiliateUrl: "..." }
    },
    {
      __component: "blocks.gallery-block"
      images: [...]
    }
  ]
}
```

**Block types:**
- **Text** - Paragraphs, formatted text
- **Image** - Single image with caption
- **Gallery** - Multiple images in grid
- **Product Embed** - Recommendation with CTA button
- **Comparison Table** - Side-by-side product comparison

Frontend `BlockRenderer` component maps each block type to a React component.

---

## Performance Optimization

### ISR (Incremental Static Regeneration)

Pages are not generated on every request. Instead:

1. **First build:** Next.js pre-renders all pages
2. **User visits:** Browser gets cached HTML (instant)
3. **Content changes:** Strapi updates database
4. **Cache expires:** Based on `revalidate` time
5. **Next visit:** Next.js regenerates updated page in background
6. **Future visits:** Get fresh cache

Benefits:
- ⚡ Pages load instantly (from cache)
- 🔄 Always eventually up-to-date
- 📉 Reduced server load

### Revalidation Schedule
- Posts: 1 hour (3600 seconds)
- Categories: 24 hours (86400 seconds)
- Homepage: 30 minutes (1800 seconds)
- Products: 1 hour (3600 seconds)

---

## Security Model

### Public Access (Unauthenticated)
- ✅ Read posts, categories, tags, products
- ✅ Create affiliate-click logs (to track clicks)
- ❌ Cannot create, edit, delete content

### Admin Access (Authenticated)
- ✅ Full access to everything
- Login via Strapi admin dashboard

### API Security
- **Server-side API token** (`STRAPI_API_TOKEN`) - Used by route handlers
- **Public read URLs** - No auth needed
- **Affiliate click writes** - Public allowed (intentional for tracking)

---

## Deployment Considerations

### Development
- Local Strapi instance (SQLite)
- Local Next.js dev server
- No external dependencies

### Production
- Strapi on Hostinger VPS (MySQL)
- Next.js on Vercel or VPS
- DNS routing to both services
- Environment variables for API URLs

---

## Common Workflows

### Adding a New Blog Post

1. Admin logs into `localhost:1337/admin`
2. Create new Post
3. Add title, slug, featured image
4. Select category and tags
5. Add content blocks in editor
6. Embed product recommendations
7. Publish
8. Website `/blog/[slug]` page auto-updates (after revalidation)

### Creating an Affiliate Product

1. Admin goes to Products section
2. Create new Product (name, affiliate URL, image, price)
3. Publish
4. When creating posts, can embed this product in blocks
5. Visitors can click → tracked → redirected to merchant

### Monitoring Performance

View database `affiliate_clicks` table:
- Which products get most clicks
- Which posts drive traffic
- Visitor geography (from IP)
- Time-based trends

---

## Summary

| Layer | Technology | Responsibility |
|-------|-----------|-----------------|
| **Presentation** | Next.js | Render pages, track clicks |
| **API** | Strapi | Serve content, handle uploads |
| **Data** | MySQL | Store posts, products, clicks |

All three work together to create a fast, scalable, monetized blog platform.

---

**Last Updated:** May 2026
