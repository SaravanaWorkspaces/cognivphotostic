# CognivPhotostic

A **blog platform focused on home decor, interior design, and lifestyle** with built-in affiliate marketing capabilities. Readers discover inspiration, and creators earn commissions through product recommendations.

## What This Platform Does

- 📝 **Publish Blog Posts** - Create rich, visual content with text, images, galleries, and embedded products
- 🏷️ **Organize Content** - Use categories and tags to help readers find what they need
- 🛍️ **Monetize** - Link to affiliate products and track clicks to measure performance
- 📊 **Track Performance** - See which products get clicks from which posts
- ⚡ **Fast & SEO-Ready** - Optimized for search engines and quick page loads

## Quick Start

### Run Locally

**Backend (CMS)**
```bash
cd backend
npm install
npm run develop
```
Runs on `http://localhost:1337`

**Frontend (Website)**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`

### Access the Admin Panel

1. Go to `http://localhost:1337/admin`
2. Create your first admin account
3. Add content: posts, categories, products
4. Publish and watch it appear on the website

## Project Structure

```
cognivphotostic/
├── backend/           # Strapi CMS (content management)
│   └── src/api/      # Content types: posts, products, categories
├── frontend/          # Next.js website (what visitors see)
│   └── src/
│       ├── app/      # Pages: blog, products, categories
│       ├── components/ # Reusable UI pieces
│       └── lib/      # Helper functions
└── docs/             # This documentation
```

## Key Features

✅ Rich blog posts with multiple content block types  
✅ Product recommendations with affiliate tracking  
✅ Fast page rendering (ISR - incremental static regeneration)  
✅ Mobile-friendly responsive design  
✅ Search-engine optimized (SEO)  

## Documentation

- **[STACK.md](STACK.md)** - What technologies power this platform
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - How the pieces fit together
- **[USER_GUIDE.md](USER_GUIDE.md)** - Step-by-step instructions for creators and admins

## Tech Stack Overview

- **Backend**: Strapi 5 (Headless CMS)
- **Frontend**: Next.js 15 with React 19
- **Database**: MySQL (production) / SQLite (development)
- **Styling**: Tailwind CSS
- **Hosting**: Hostinger VPS (backend) + Vercel (optional frontend)

## How Affiliate Tracking Works

1. Visitor reads a blog post with product recommendations
2. They click "View Product" 
3. System logs: which visitor, which product, which post
4. Visitor is redirected to merchant website
5. You can measure which posts drive the most clicks

## Environment Setup

Create a `.env` file in each directory:

**backend/.env**
```
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=cognivphotostic
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
```

**frontend/.env.local**
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Need Help?

- Check [USER_GUIDE.md](USER_GUIDE.md) for step-by-step walkthroughs
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system design
- Consult [STACK.md](STACK.md) for technology details

---

**Last Updated:** May 2026  
**Status:** Production Ready
