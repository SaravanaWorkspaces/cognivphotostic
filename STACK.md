# Technology Stack

## Overview

CognivPhotostic is built as a **monorepo** with two independent applications:

- **Backend**: Strapi 5 (Headless CMS)
- **Frontend**: Next.js 15 (React 19)
- **Database**: MySQL or SQLite

---

## Backend Stack

### Strapi 5 (Node.js)
A headless CMS that manages all your content.

**Key Packages:**
- `@strapi/strapi` - Core CMS framework
- `@strapi/plugin-users-permissions` - User authentication & permissions
- `mysql2` - MySQL database driver (production)
- `better-sqlite3` - SQLite driver (development)

**What it does:**
- Provides a REST API for all content
- Admin dashboard at `/admin` for creating/editing content
- Handles user permissions (who can read/write what)
- Stores content in a database

**Port:** `1337`

### Strapi Content Types

The CMS manages these content types:

#### Post
Blog articles with metadata and dynamic content blocks
- Title, slug, description
- Featured image
- Category (links to one Category)
- Tags (links to multiple Tags)
- Dynamic content blocks (text, images, galleries, products)
- Publishing status

#### Category
Grouping for posts (e.g., "Living Room", "Kitchen", "Bedroom")
- Name, slug, description

#### Tag
Labels for posts (e.g., "DIY", "Budget-Friendly", "Modern")
- Name, slug

#### Product
Affiliate products to recommend in posts
- Name, slug
- Affiliate URL (merchant link)
- Price, currency
- Commission rate
- Description, image

#### Affiliate Click (Log Type)
Records every time someone clicks an affiliate link
- Product ID
- Post ID (which post had the link)
- IP address, user agent, referer
- Timestamp (auto)

### Strapi Permissions

Public users (unauthenticated) can:
- ✅ **Read** posts, categories, tags, products (find and findOne)
- ✅ **Create** affiliate-click logs
- ❌ Cannot read, update, or delete affiliate-clicks
- ❌ Cannot write content

Authenticated admins can:
- ✅ Do everything

---

## Frontend Stack

### Next.js 15 (React 19)
The website that visitors see.

**Key Packages:**
- `next` - React framework for production
- `react` - UI library
- `tailwindcss` - Utility-first CSS
- `@tailwindcss/typography` - Styles for article text

**What it does:**
- Fetches content from Strapi
- Renders pages with SEO meta tags
- Handles dynamic routes (posts, categories, products)
- Optimizes images and code splitting
- Tracks affiliate clicks

**Port:** `3000`

### Pages (Routes)

| Route | Purpose |
|-------|---------|
| `/` | Homepage with featured posts |
| `/blog` | All blog posts (paginated) |
| `/blog/[slug]` | Individual blog post |
| `/category/[slug]` | Posts in a category |
| `/products` | All available products for shopping |
| `/api/affiliate/[id]` | Affiliate redirect & tracking |

### Key Features

**ISR (Incremental Static Regeneration)**
- Pages are pre-rendered and cached
- On-demand revalidation when content changes
- Fast load times + always fresh content

Revalidation times:
- Posts: Every 1 hour
- Categories: Every 24 hours
- Homepage: Every 30 minutes
- Products page: Every 1 hour

**Server-Side Rendering**
- All pages use `async` components
- Data fetched at build/request time
- Full TypeScript type safety

**Responsive Design**
- Mobile-first approach
- Tailwind CSS utilities
- Works on all devices

### Component Structure

```
src/
├── app/              # Page routes
│   ├── page.tsx     # Homepage
│   ├── blog/        # Blog section
│   ├── category/    # Category pages
│   ├── products/    # Product listing
│   └── api/         # API routes (tracking)
├── components/       # Reusable components
│   ├── layout/      # Header, footer
│   ├── blog/        # Post & content components
│   ├── products/    # Product display
│   └── ui/          # Generic UI elements
├── lib/             # Utilities
│   ├── api.ts       # Strapi API client
│   └── config.ts    # Site configuration
├── types/           # TypeScript definitions
└── hooks/           # React hooks
```

---

## Database

### Production: MySQL
- **Driver:** `mysql2/promise`
- **Host:** Typically on Hostinger VPS
- **Tables:** `posts`, `categories`, `tags`, `products`, `affiliate_clicks`, etc.

### Development: SQLite
- **Driver:** `better-sqlite3`
- **Location:** `backend/database.sqlite`
- **Use:** Local development, CI/CD testing

### Connection

Strapi automatically handles database connections based on `.env`:

```env
DATABASE_CLIENT=mysql  # or sqlite
DATABASE_HOST=...
DATABASE_NAME=cognivphotostic
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
```

---

## Infrastructure

### Local Development
- Both backend and frontend run on `localhost`
- SQLite for quick iteration
- No external services needed

### Production
- **Backend:** Hostinger VPS (Node.js + MySQL)
- **Frontend:** Optional Vercel deployment (auto-scaling, CDN)
- **Database:** MySQL on VPS

### Environment Files

**backend/.env** (not in git, create manually)
```env
DATABASE_CLIENT=mysql
DATABASE_HOST=your-host.com
DATABASE_NAME=cognivphotostic
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret
```

**frontend/.env.local** (not in git, create manually)
```env
NEXT_PUBLIC_STRAPI_URL=https://your-backend.com
```

---

## API Communication

### Frontend → Backend

Frontend uses `fetchStrapi()` utility to call Strapi APIs:

```typescript
// Get all posts
const response = await fetchStrapi('/posts?populate=*');

// Get one post by slug
const post = await fetchStrapi(`/posts?filters[slug]=$eq:${slug}&populate=*`);

// Create affiliate click log
await fetchStrapi('/affiliate-clicks', {
  method: 'POST',
  body: { productId, postId, ip, userAgent, referer }
});
```

### API Endpoints

Public endpoints (no auth):
- `GET /api/posts` - List posts
- `GET /api/posts/:id` - Single post
- `GET /api/categories` - List categories
- `GET /api/tags` - List tags
- `GET /api/products` - List products
- `POST /api/affiliate-clicks` - Log a click

Admin endpoints (authenticated):
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Edit post
- etc.

---

## Development Tools

### Backend
- **Node.js** 18+
- **npm** 6+
- **SQLite** (comes with better-sqlite3)

### Frontend
- **Node.js** 18+
- **npm** 6+
- **TypeScript** 5
- **Jest** for testing

### CI/CD
- GitHub Actions (CI pipeline)
- Runs tests, builds, and checks code

---

## Summary Table

| Component | Technology | Purpose | Port |
|-----------|-----------|---------|------|
| CMS | Strapi 5 | Content management | 1337 |
| Website | Next.js 15 | Content display | 3000 |
| Database | MySQL/SQLite | Data storage | 3306 |
| Styling | Tailwind CSS | UI design | - |
| Language | TypeScript/JavaScript | Development | - |

---

**Last Updated:** May 2026
