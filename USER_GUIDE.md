# User Guide

A practical guide for everyone using CognivPhotostic - from admins to content creators to site visitors.

---

## For Developers: Getting Started

### Prerequisites
- **Node.js** 18+ installed
- **npm** 6+ installed
- **Git** (to clone the repo)

### First Time Setup

#### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd cognivphotostic

# Backend
cd backend
npm install

# Frontend (in another terminal)
cd frontend
npm install
```

#### 2. Database Setup

**For Development (SQLite - Default):**
SQLite comes automatically, no setup needed. It creates a `database.sqlite` file automatically.

**For MySQL:**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE cognivphotostic;"

# Create backend/.env
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=cognivphotostic
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
```

#### 3. Start the Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run develop
```
Wait for message: `Strapi is running at http://localhost:1337`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Wait for message: `Ready in X seconds`

#### 4. Access the Admin Panel

1. Open browser to `http://localhost:1337/admin`
2. Create your admin account (first user)
3. You're now logged in

---

## For Content Creators / Admins: Managing Content

### Admin Dashboard Overview

**Access:** `http://localhost:1337/admin`

After login, you'll see:
- **Sidebar** - Navigation to all content types
- **Posts** - Blog articles
- **Categories** - Post groupings
- **Tags** - Post labels
- **Products** - Affiliate products
- **Settings** - Site configuration

### Creating Your First Post

#### Step 1: Navigate to Posts
1. Click "Posts" in sidebar
2. Click "Create new entry" button

#### Step 2: Fill Basic Info
| Field | What to Enter |
|-------|---------------|
| **Title** | Your post title (e.g., "5 Ways to Style a Small Living Room") |
| **Slug** | URL-friendly version (auto-generated, e.g., "5-ways-to-style-small-living-room") |
| **Description** | 1-2 sentence summary for search engines |
| **Featured Image** | Main image for the post (drag to upload) |

#### Step 3: Organize
- **Category** - Pick one (e.g., "Living Room", "Bedroom")
- **Tags** - Pick one or more (e.g., "DIY", "Budget", "Modern")

#### Step 4: Add Content Blocks
1. Scroll to "Blocks" section
2. Click "Add a component"
3. Choose block type:

**Text Block** - Regular paragraphs
- Enter text with formatting (bold, italics, links)
- Good for: Article body, tips, descriptions

**Image Block** - Single image
- Upload an image
- Add caption
- Good for: Process photos, inspiration images

**Gallery Block** - Multiple images
- Add 2+ images
- Displayed as grid
- Good for: Before/after comparisons, room inspiration

**Product Embed** - Affiliate recommendation
- Search and select a product
- Shows: Image, name, price, "View Product" button
- Good for: Recommend products readers can buy
- ⚠️ **This is where you earn money!**

**Comparison Table** - Side-by-side comparison
- Create rows with 2+ columns
- Good for: Product comparisons, feature lists

#### Step 5: Publish
1. Scroll to top
2. Click **"Publish"** button
3. Post appears live at `http://localhost:3000/blog/your-slug`

**Tip:** Click "Save as draft" to work on posts without publishing yet.

### Example Post Structure

```
Post: "Best Sofas for Small Spaces"

Block 1: Text
  "Choosing furniture for a small apartment is challenging. 
   Here are the best options I've found..."

Block 2: Image
  "My favorite small sofa model"
  
Block 3: Product Embed
  (Links to West Elm Compact Sofa - affiliate link)
  
Block 4: Text
  "This sofa comes in 5 colors and is perfect for..."
  
Block 5: Gallery
  (3 photos of the sofa in different rooms)
  
Block 6: Product Embed
  (Links to IKEA Kivik Sofa - another affiliate option)
```

### Managing Categories

#### Create Category
1. Click "Categories" in sidebar
2. Click "Create new entry"
3. Enter **Name** and **Slug** (e.g., "Living Room", "living-room")
4. Click "Publish"

**Purpose:** Helps readers browse by room type.

#### Link Post to Category
When creating/editing a post, choose a category. Readers can then browse all posts in that category at `http://localhost:3000/category/living-room`

### Managing Tags

#### Create Tag
1. Click "Tags" in sidebar
2. Click "Create new entry"
3. Enter **Name** and **Slug** (e.g., "DIY", "diy")
4. Click "Publish"

**Purpose:** Labels that help with search and filtering.

**Examples:** "DIY", "Budget-Friendly", "Modern", "Scandinavian", "Minimalist"

#### Link Post to Tags
When creating a post, add 2-3 relevant tags. Helps readers find related content.

### Managing Products (Affiliate Links)

Products are what you monetize through. Each product links to a merchant (Amazon, Wayfair, etc.) and tracks clicks.

#### Create Product
1. Click "Products" in sidebar
2. Click "Create new entry"
3. Fill in:

| Field | What to Enter |
|-------|---------------|
| **Name** | Product name (e.g., "West Elm Mid-Century Chair") |
| **Slug** | URL version (e.g., "west-elm-mid-century-chair") |
| **Image** | Product photo |
| **Price** | Product price (e.g., 499) |
| **Currency** | USD, EUR, etc. |
| **Affiliate URL** | Your affiliate link to merchant (e.g., Amazon affiliate link) |
| **Commission Rate** | What % you get from sales (e.g., 5) |
| **Description** | Why this product is good |

4. Click "Publish"

#### How It Works
1. You write a post recommending the sofa
2. In a product embed block, you link to this sofa
3. Reader clicks "View Product"
4. System logs: "Product X clicked from Post Y by visitor Z"
5. Reader gets redirected to merchant (Amazon, etc.)
6. Reader buys → You get commission!

**Important:** Use your affiliate links! Your product URLs should be YOUR affiliate tracking links from Amazon Associates, ShareASale, or similar.

#### Example Affiliate URLs
- Amazon: `https://amazon.com/dp/B08HY7X4K9?tag=yourname-20`
- Wayfair: `https://www.wayfair.com/... [affiliate tracking]`
- Target: `https://target.com/... [affiliate tracking]`

---

## For Website Visitors: Using the Site

### Homepage (`/`)
Shows recent blog posts and link to full blog.

**What to do:**
- Read featured posts
- Click category to browse by room type
- Click "View All Posts" to see everything

### Blog Page (`/blog`)
All posts in a grid layout with pagination.

**Browse:**
- See all published posts
- Posts show: Title, featured image, excerpt, category
- Click any post to read full article

### Reading a Post (`/blog/post-slug`)
Full article with all content blocks.

**Features:**
- Read article text
- View images and galleries
- **Click "View Product"** to check out recommended items
  - Opens merchant in new tab
  - Your affiliate click is tracked automatically
  - You might earn a commission if they buy!

### Category Page (`/category/category-slug`)
All posts in one category.

**Browse:**
- "Living Room" posts in one place
- "Bedroom" posts in another
- Easy way to find relevant content

### Products Page (`/products`)
All recommended products in a grid.

**Purpose:** Explore affiliate products without reading posts.

**Click any product:**
- Redirects to merchant
- Click is tracked
- You earn commission if they buy

---

## Tracking & Analytics

### Viewing Click Data

As an admin, you can check which products get clicked most.

**Method 1: Strapi Admin**
1. Click "Affiliate Clicks" in sidebar
2. See all recorded clicks with:
   - Which product
   - Which post (if from a blog)
   - Visitor's IP and location (approximate)
   - Timestamp

**Method 2: Database Query**
If you have database access:
```sql
-- Most clicked products
SELECT productId, COUNT(*) as clicks
FROM affiliate_clicks
GROUP BY productId
ORDER BY clicks DESC;

-- Which posts drive the most clicks
SELECT postId, COUNT(*) as clicks
FROM affiliate_clicks
WHERE postId IS NOT NULL
GROUP BY postId
ORDER BY clicks DESC;

-- Clicks today
SELECT COUNT(*) as today_clicks
FROM affiliate_clicks
WHERE DATE(created_at) = CURDATE();
```

### Interpreting Metrics

**High Performing Products:**
- More clicks = more likely sales
- Prioritize these in future posts
- Consider featuring them more prominently

**High Performing Posts:**
- Posts that get most clicks
- Write similar content
- Expand into series

**Seasonal Trends:**
- Track clicks over time
- Increase relevant content during peak times
- E.g., more furniture posts before spring moving season

---

## Workflow Examples

### Example 1: Writing About Bedroom Design

1. **Create post** "10 Ideas for a Cozy Bedroom"
   - Category: "Bedroom"
   - Tags: "Cozy", "Budget-Friendly", "DIY"
   
2. **Add content blocks:**
   - Text: Introduction
   - Image: Inspiration photo
   - Product embed: Recommend a comfy mattress
   - Text: Tips for cozy lighting
   - Product embed: Nice bedside lamp
   - Gallery: Room inspiration photos

3. **Publish**

4. **Monitor:** Check affiliate clicks weekly
   - Which products resonate?
   - Update post if better products available

### Example 2: Building an Affiliate Strategy

1. **Choose niche:** Small space furniture
2. **Create products:** Add all IKEA small furniture to Products
3. **Create posts:** "Best Sofas for Small Spaces", "Compact Dining Tables", etc.
4. **Embed:** In each post, link to relevant products
5. **Track:** Monitor which products get clicks
6. **Optimize:** Expand what works, remove what doesn't

---

## Troubleshooting

### Site Not Loading?

**Check backend is running:**
```bash
# Terminal 1
cd backend
npm run develop
# Should show: "Strapi is running at http://localhost:1337"
```

**Check frontend is running:**
```bash
# Terminal 2
cd frontend
npm run dev
# Should show: "Ready in X seconds"
```

### Post Not Appearing?

**Solutions:**
1. Confirm you clicked **Publish** (not just Save draft)
2. Wait up to 1 hour for ISR cache to refresh
3. Check post **slug** - that's the URL it uses
4. Verify post **visibility** settings (should be public)

### Product Link Not Working?

**Check:**
1. Affiliate URL is valid and complete
2. URL starts with `https://`
3. No typos in the URL
4. Affiliate program still active (some programs disable accounts)

### Can't Find Content in Admin?

**Navigation:**
- Posts → Posts (articles)
- Products → Products (affiliate items)
- Categories → Categories
- Tags → Tags
- Content Manager shows all available types

---

## Best Practices

### For Content

✅ **Do:**
- Write 1,000+ words per post (good for SEO)
- Use multiple content block types (text, images, products)
- Link to products naturally (not every paragraph)
- Use relevant categories and tags
- Update old posts with new products
- Disclose affiliate links clearly ("As an Amazon associate, I earn...")

❌ **Don't:**
- Write very short posts (under 300 words)
- Recommend products you don't believe in
- Hide affiliate links (be transparent)
- Spam too many product links (1-3 per post is good)
- Copy content from other sites

### For Affiliate Strategy

✅ **Do:**
- Choose products relevant to your niche
- Build a content calendar
- Track which products perform
- Create comparison posts (2+ products)
- Link between related posts
- Update products seasonally

❌ **Don't:**
- Recommend everything (be selective)
- Use non-affiliate links
- Ignore low-performing products (eventually)
- Copy competitor posts
- Only recommend expensive items

---

## Quick Reference

### Key URLs (Local Development)

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Website home |
| `http://localhost:3000/blog` | All posts |
| `http://localhost:3000/products` | All products |
| `http://localhost:1337/admin` | Admin dashboard |
| `http://localhost:1337/api/posts` | Posts API |
| `http://localhost:1337/api/products` | Products API |

### Keyboard Shortcuts (Admin)

| Action | Shortcut |
|--------|----------|
| Save | Ctrl+S (or Cmd+S) |
| Publish | Press "Publish" button |
| Cancel | Esc key |

### Helpful Admin Tips

- **Draft vs. Publish:** Save as draft to work privately, publish to go live
- **Auto-save:** Content auto-saves, but always manually publish
- **Images:** Upload images and Strapi auto-optimizes them
- **Slug field:** Auto-generated from title, edit if needed
- **Preview:** No preview in admin, check live site after publish

---

## Getting Help

### Common Questions

**Q: How long until my post appears online?**
A: Instantly when you publish. The website checks for updates every 30 min to 1 hour depending on page type.

**Q: Can I edit a post after publishing?**
A: Yes, just edit it in admin and publish again. Changes appear on the live site within the revalidation time.

**Q: Do affiliate clicks require authentication?**
A: No, they're tracked automatically. Visitors don't need to log in.

**Q: Where do I get affiliate links?**
A: Sign up for affiliate programs like Amazon Associates, Wayfair Affiliate, ShareASale, etc.

**Q: How much do I earn per click?**
A: Affiliate clicks are logged, but payment depends on your merchant affiliate program. Amazon is typically 1-5% commission.

---

**Last Updated:** May 2026  
**Questions?** Check ARCHITECTURE.md for system details or STACK.md for tech info.
