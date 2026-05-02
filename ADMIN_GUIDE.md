# Admin Guide - CognivPhotostic Setup & Management

## Getting Started

### Prerequisites
- Node.js 20+ installed
- Access to terminal/command line
- Text editor (VSCode recommended)
- Basic understanding of folders and commands

---

## 🚀 Initial Setup

### Step 1: Install Dependencies

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

**What this does:** Downloads all required libraries that the project needs to run.

---

### Step 2: Start the Backend (Strapi CMS)

```bash
cd backend
npm run develop
```

**Output should show:**
```
✔ Strapi started successfully
http://localhost:1337
```

✓ **Backend is now running at:** `http://localhost:1337`

---

### Step 3: Start the Frontend (Next.js Website)

**In a NEW terminal window:**

```bash
cd frontend
npm run dev
```

**Output should show:**
```
✓ Ready in 1234ms
- Local: http://localhost:3000
```

✓ **Frontend is now running at:** `http://localhost:3000`

---

### Step 4: Access Strapi Admin Panel

Open your browser and go to:
```
http://localhost:1337/admin
```

You'll see the Strapi login screen. On first access, you can create your admin account.

**Create an admin user:**
- Email: your@email.com
- Password: Strong password (12+ characters, mix of letters/numbers)
- Click "Let's start"

✓ **You're now in the Strapi Admin Panel!**

---

## 📋 Content Types Overview

In Strapi, you manage 4 main content types:

### 1. **Posts** (Blog Articles)
Access: `Content Manager > Posts`

**Fields:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Title | Text | Yes | "5 Best Sofas for 2026" |
| Slug | Auto-generated | Yes | "5-best-sofas-for-2026" |
| Excerpt | Rich Text | Yes | "Discover the most comfortable and stylish sofas..." |
| Cover Image | Image | Yes | [Upload hero image] |
| Category | Relation | No | "Living Room" |
| Tags | Relation | No | "Sofa", "Comfort", "Modern" |
| Author | Text | No | "Your Name" |
| Published At | Date | No | Select to publish |
| Blocks | Dynamic Zone | No | [Add content blocks] |
| SEO | Component | No | Meta title, description, etc |

**Creating a Post:**

1. Click **"+ Create new entry"**
2. Fill in basic info:
   - Title: "Best Standing Desks for Home Offices"
   - Excerpt: "A curated selection of standing desks..."
   - Upload cover image (1200x600px recommended)
3. Select category (create if needed)
4. Add tags
5. **Scroll down to "Blocks"** - This is where content goes
6. Click **"+ Add entry to Blocks"** and choose block type:
   - **Text Block:** Rich text content
   - **Image Block:** Single image + caption
   - **Gallery Block:** Multiple images
   - **Product Embed:** Product with affiliate link
   - **Comparison Table:** Feature comparison
7. **Fill SEO fields** (optional but recommended):
   - Meta Title: What appears in Google search
   - Meta Description: Summary (max 160 chars)
   - Keywords: Comma-separated (for reference)
8. Click **"Save"**
9. Click **"Publish"** (makes it live)

---

### 2. **Products**
Access: `Content Manager > Products`

**Fields:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | "Herman Miller Aeron Chair" |
| Slug | Auto-generated | Yes | "herman-miller-aeron-chair" |
| Description | Text | Yes | "Professional task chair with lumbar support..." |
| Affiliate URL | Text | Yes | "https://amazon.com/... (your affiliate link)" |
| Price | Decimal | No | 1395.00 |
| Currency | Text | No | "USD" |
| Image | Image | No | [Product photo] |
| Commission Rate | Decimal | No | 5 (means 5%) |

**Creating a Product:**

1. Click **"+ Create new entry"**
2. Fill fields:
   - Name: "Autonomous SmartDesk Pro"
   - Description: "Electric standing desk with memory presets..."
   - **IMPORTANT:** Affiliate URL - Get this from Amazon Associates, ShareASale, etc.
   - Price: 599.00
   - Currency: USD
   - Commission Rate: 5 (you earn 5% of purchases)
3. Upload product image
4. Click **"Save"** → **"Publish"**

**Where to get affiliate URLs:**
- Amazon Associates: https://affiliate-program.amazon.com
- ShareASale: https://www.shareasale.com
- CJ Affiliate: https://www.cj.com
- Each will provide special tracking links

---

### 3. **Categories**
Access: `Content Manager > Categories`

**Fields:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | "Living Room" |
| Slug | Auto-generated | Yes | "living-room" |
| Description | Text | No | "Furniture and decor for living spaces" |

**Why categories matter:**
- Organize posts by topic
- Creates category archives (`/category/living-room`)
- Helps with SEO (topical authority)

**Create common categories:**
- Living Room
- Bedroom
- Kitchen
- Dining Room
- Office
- Home Theater
- Garden & Outdoor

---

### 4. **Tags**
Access: `Content Manager > Tags`

**Fields:**
| Field | Type | Required | Example |
|-------|------|----------|---------|
| Name | Text | Yes | "Modern" |
| Slug | Auto-generated | Yes | "modern" |

**Why tags matter:**
- Help readers find related posts
- Better content discoverability
- Internal linking opportunity

**Example tags:**
- Modern, Minimalist, Traditional
- Luxury, Budget-Friendly, Mid-Range
- Small Space, Large Space
- Pet-Friendly, Eco-Friendly, Sustainable

---

## 📝 Complete Content Creation Workflow

### Example: Write & Publish a Blog Post

**Goal:** Create a post "Best Minimalist Shelving Solutions for 2026"

**Step 1: Create the Post**
```
Title: Best Minimalist Shelving Solutions for 2026
Slug: (auto-generates: best-minimalist-shelving-solutions-2026)
Excerpt: Discover stylish, space-saving shelving that pairs perfectly with minimalist decor
Cover Image: [Upload minimalist shelf photo]
Category: Living Room
Tags: Shelving, Minimalist, Organization, Budget-Friendly
Author: Your Name
```

**Step 2: Build Content with Blocks**

Add blocks in this order:

**Block 1 - Text Block (Introduction)**
```
Content: "Minimalist shelving doesn't mean boring. These solutions combine 
form and function, creating visual interest while keeping your space 
organized and clutter-free..."
```

**Block 2 - Image Block (Product Photo)**
```
Image: [Floating shelf photo]
Caption: "Floating shelves create clean lines and visual space"
```

**Block 3 - Product Embed (Affiliate Link)**
```
Product: Select "IKEA Lack Floating Shelf" (must be created first)
Click "Shop Now" link will take readers to your affiliate URL
```

**Block 4 - Comparison Table (Compare Options)**
```
Title: "Minimalist Shelf Styles Comparison"
Rows:
- Feature: "Price Range", Values: "Budget (<$50) | Mid ($50-150) | Premium (>$150)"
- Feature: "Install Type", Values: "Floating | Wall-Mounted | Freestanding"
- Feature: "Best For", Values: "Small spaces | Living rooms | All areas"
```

**Block 5 - Text Block (Buying Guide)**
```
Content: "When choosing minimalist shelving, consider: 1) Your space 
dimensions, 2) Weight capacity needs, 3) Existing furniture style, 
4) Installation difficulty..."
```

**Block 6 - Gallery Block (Inspiration)**
```
Images: [3-4 beautiful minimalist shelf setup photos]
```

**Block 7 - Product Embed (Another Product)**
```
Product: Select "String Shelving System"
```

**Step 3: Add SEO Metadata**

Scroll to SEO section:
```
Meta Title: "Best Minimalist Shelving 2026 - 7 Space-Saving Solutions"
(max 60 chars, should match your goal keyword)

Meta Description: "Discover 7 minimalist shelving solutions for 2026. 
From floating shelves to wall systems, find the perfect fit for your space."
(max 160 chars)

OG Image: [Same as cover image or custom]
Keywords: minimalist shelves, wall shelving, floating shelves, space saving storage
```

**Step 4: Publish**

1. Click **"Save"**
2. Click **"Publish"**
3. Check box: "Publish now"
4. Click **"Publish"** again

✓ **Your post is now live!** View it at: `http://localhost:3000/blog/best-minimalist-shelving-solutions-2026`

---

## 🎨 Tips for Better Content

### Writing for Blog Posts
- **Title:** Make it specific and benefit-focused
  - ✓ "5 Best Affordable Lamps Under $100"
  - ✗ "Lamps"
- **Excerpt:** 2-3 sentences that hook the reader
- **Cover Image:** High quality, visually appealing, 1200x600px
- **Content Blocks:** Mix text, images, products for engagement

### Product Strategy
- **Add commission rate:** Track which products are most profitable
- **Link multiple times:** Don't just embed once - mention in text too
- **Honest descriptions:** Recommend products you'd actually use
- **Update prices:** Keep price information current

### SEO Optimization
- **Target long-tail keywords:** "best budget sofas for small spaces" (more specific = easier to rank)
- **Use descriptive titles:** Include the benefit/number when possible
- **Write for humans first:** SEO second (Google rewards good content)
- **Internal linking:** Link to related posts when mentioning topics

### Consistency
- **Post frequency:** 2-4 times per month (quality > quantity)
- **Consistent brand:** Use same terminology, tone, style
- **Category consistency:** Keep posts in 2-3 main categories for topical authority

---

## 🔗 Creating Affiliate Links

### For Amazon Associates
1. Log in to https://affiliate-program.amazon.com
2. Search for product
3. Click "Get Link"
4. Copy the URL (format: `https://amazon.com/dp/ASIN?tag=YOUR-TAG`)
5. Paste into Product "Affiliate URL" field

### Commission Tracking
Each product has a "Commission Rate" field:
- Amazon Associates: ~3-5%
- ShareASale: Varies by merchant (5-25%)
- CJ Affiliate: Varies by merchant

Enter the actual rate so you can track profitability per product.

---

## 📊 Monitoring & Analytics

### Built-in Tracking
Go to: `Content Manager > Affiliate Clicks`

This shows:
- **Product ID:** Which product was clicked
- **Post ID:** Which article drove the click
- **URL:** Where they went
- **IP:** Visitor location (anonymized)
- **User Agent:** Device type
- **Created At:** When the click happened

### Using This Data
Track patterns like:
- "Product X gets most clicks from Post Y"
- "Mobile traffic vs Desktop traffic"
- "Best performing content categories"

Use this to decide what to write about next.

### External Analytics (Optional)
Add Google Analytics to track:
- Page views
- Time on page
- Bounce rate
- Traffic sources
- Visitor geography

---

## ⚙️ Configuration Settings

### Revalidation Times (ISR Caching)
The website caches pages to load faster:

| Page | Revalidation | Why |
|------|--------------|-----|
| Homepage | 30 minutes | Featured posts change sometimes |
| Blog Posts | 1 hour | New comments/updates infrequent |
| Categories | 24 hours | Change rarely |
| Products | 1 hour | Prices update sometimes |

**What this means:** If you update a post, wait up to 1 hour for changes to appear on site.

### API Configuration
Backend URL: `http://localhost:1337`
Frontend URL: `http://localhost:3000`

Change these in `frontend/.env.local` for production deployment.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Clear Strapi cache
rm -rf backend/.strapi-updater.json

# Reinstall dependencies
npm install

# Try again
npm run develop
```

### Frontend won't start
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Reinstall
npm install

# Try again
npm run dev
```

### Posts not appearing on website
1. Check post is **Published** (not in Draft)
2. Check "Published At" date is set
3. Wait up to 1 hour for ISR cache to refresh
4. Manually force refresh: `npm run build` in frontend

### Product links not working
1. Check Affiliate URL is correct and uses full `https://...`
2. Check product is **Published**
3. Click "Preview" to test link

### Database issues (SQLite dev only)
```bash
# Reset local database
rm backend/.tmp/data.db

# Restart
npm run develop
```

---

## 📋 Pre-Launch Checklist

Before going live to production:

- [ ] Create 10+ blog posts
- [ ] Create 20+ products
- [ ] Fill out SEO fields for all posts
- [ ] Set category for each post
- [ ] Add tags to posts
- [ ] Test all affiliate links work
- [ ] Review cover images (are they high quality?)
- [ ] Check mobile display (open in phone browser)
- [ ] Verify all images load (no broken images)
- [ ] Test blog navigation (category filters, pagination)
- [ ] Review footer links (add your contact info)
- [ ] Enable Google Analytics (if desired)
- [ ] Set up analytics dashboard
- [ ] Write privacy policy (mention affiliate relationships)
- [ ] Set up email notifications (optional)

---

## 📞 Common Admin Tasks

### Daily
- Check affiliate clicks (which products are performing?)
- Monitor traffic (is anyone visiting?)

### Weekly
- Write 1-2 new posts
- Respond to any comments/feedback
- Update product prices if changed

### Monthly
- Analyze top-performing posts
- Review affiliate earnings
- Plan next month's content topics
- Update SEO strategy based on rankings

---

## 🔐 Security Best Practices

✓ Use strong passwords (12+ characters, mixed case, numbers, symbols)
✓ Don't share admin credentials
✓ Keep browser updated
✓ Log out when finished
✓ Back up database regularly
✓ Use HTTPS in production (automatically with Vercel)

---

## Need Help?

### Strapi Documentation
- Official docs: https://strapi.io/documentation
- Community forum: https://forum.strapi.io

### Next.js Documentation
- Official docs: https://nextjs.org/docs
- Discussions: https://github.com/vercel/next.js/discussions

---

**Next Step:** Read [CONTENT_CREATOR_GUIDE.md](./CONTENT_CREATOR_GUIDE.md) for detailed writing tips.
