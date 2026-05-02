# CognivPhotostic - Complete Platform

A **SEO-first blog platform with affiliate marketing** for home decor, interior design, and lifestyle content. Write posts, embed products, earn commissions.

**Stack:** Strapi 5 (CMS) · Next.js 15 (frontend) · MySQL (production) · SQLite (local dev)

---

## 📚 **START HERE - Complete Documentation**

### 🎯 New to CognivPhotostic?
**→ [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** (5 min)
*Understand what this project is, how it works, and how to make money with it.*

### 👨‍💼 Admin/Setup Instructions
**→ [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** (30 min)
*How to manage content, create posts/products, set up locally.*

### ✍️ Content Creator Guide
**→ [CONTENT_CREATOR_GUIDE.md](./CONTENT_CREATOR_GUIDE.md)** (45 min)
*How to write great posts, pick topics, monetize with affiliates.*

### 🚀 Production Deployment
**→ [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** (45 min)
*How to go live on the internet (backend + frontend + domain).*

### 🐛 Troubleshooting & FAQ
**→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** (reference)
*Something broken? Check here for solutions.*

---

## ⚡ Quick Start (5 Minutes)

## Project Structure

```
cognivphotostic/
├── backend/      # Strapi 5 CMS — API, content types, admin panel
└── frontend/     # Next.js 15 — App Router, TypeScript, Tailwind CSS
```

---

## Prerequisites

- Node.js 20 (backend) / 18+ (frontend) — use [nvm](https://github.com/nvm-sh/nvm)
- npm 10+
- MySQL 8+ (production only — SQLite is used locally)

---

## Local Development

### 1. Clone and enter the project

```bash
git clone <repo-url>
cd cognivphotostic
```

### 2. Backend (Strapi)

```bash
cd backend

# Switch to Node 20 (required by Strapi 5 — must stay on Node 20)
nvm use 20

# Install dependencies
npm install

# Copy env file and fill in values (SQLite works out of the box)
cp .env.example .env

# Start Strapi in dev mode (always run from the backend/ directory)
npm run develop
```

> **Note:** `npm run develop` calls `develop.sh`, which sources nvm and enforces
> Node 20 automatically. Never start Strapi with `node` or `strapi` directly —
> always use `npm run develop` from inside `backend/`.
>
> If you see a `better-sqlite3` Node version mismatch error, fix it with:
> ```bash
> cd backend && nvm use 20 && npm rebuild better-sqlite3 --build-from-source
> ```

Strapi admin: **http://localhost:1337/admin**

On first run, create your admin account at the URL above.

### 3. Frontend (Next.js)

Open a second terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
```

Edit `.env.local` — add your Strapi API token:

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337    
STRAPI_API_TOKEN=<paste token here>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> Get the token: Strapi Admin → Settings → API Tokens → Create Token (Full Access)

```bash
# Start Next.js
npm run dev
```

Frontend: **http://localhost:3000**

---

## Verify the connection

```bash
curl http://localhost:3000/api/health
# {"status":"ok","strapi":"ok","timestamp":"..."}
```

The homepage also shows a green indicator when Strapi is reachable.

---

## Environment Variables

### backend/.env

| Variable | Description |
|---|---|
| `DATABASE_CLIENT` | `sqlite` (local) or `mysql2` (production) |
| `DATABASE_FILENAME` | SQLite file path (local only) |
| `DATABASE_HOST/NAME/USERNAME/PASSWORD` | MySQL credentials (production) |
| `APP_KEYS` | 4 comma-separated random base64 strings |
| `ADMIN_JWT_SECRET` | Random secret for admin sessions |
| `API_TOKEN_SALT` | Salt for API token hashing |
| `JWT_SECRET` | Secret for user JWTs |
| `TRANSFER_TOKEN_SALT` | Salt for transfer tokens |
| `FRONTEND_URL` | Allowed CORS origin (e.g. `http://localhost:3000`) |

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### frontend/.env.local

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi base URL |
| `STRAPI_API_TOKEN` | Server-side API token (never exposed to browser) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for canonical URLs) |

---

## Useful Commands

```bash
# Backend
npm run develop   # dev mode with auto-reload
npm run build     # production build
npm run start     # start production server

# Frontend
npm run dev       # dev mode
npm run build     # production build
npm run start     # start production server
npm run lint      # ESLint
npm test          # Jest unit tests
```

---

## Production (MySQL)

Update `backend/.env`:

```
DATABASE_CLIENT=mysql2
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=cognivphotostic
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_password
```

Create the MySQL database:

```sql
CREATE DATABASE cognivphotostic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON cognivphotostic.* TO 'strapi_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## ✅ Build Phases (Complete)

| Phase | Description | Status |
|---|---|---|
| 1 | Project setup — Strapi + Next.js + API connection | ✅ Done |
| 2 | CMS content types — Posts, Categories, Tags, Products | ✅ Done |
| 3 | Frontend core — Layout, blog listing, blog detail, pages | ✅ Done |
| 4 | Dynamic blocks — Text, Image, Gallery, Product embed, Comparison Table | ✅ Done |
| 5 | Affiliate system — Products, click tracking, redirect routes | ✅ Done |
| 6 | SEO + Performance — Metadata, ISR, Mobile responsive | ✅ Done |
| 7 | Documentation — Complete user manual & guides | ✅ Done |

**Platform is production-ready!** All core features implemented. Ready to deploy and start earning.

---

## 📖 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** | What is CognivPhotostic? How does it work? | Everyone |
| **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** | Local setup, managing content, Strapi admin panel | Site owners, admins |
| **[CONTENT_CREATOR_GUIDE.md](./CONTENT_CREATOR_GUIDE.md)** | Writing posts, SEO, affiliate strategy | Content writers, creators |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Deploy to production (Hostinger/Vercel) | DevOps, site owners |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues and solutions | Everyone |
| **[README.md](./README.md)** | This file — Technical setup reference | Developers |
