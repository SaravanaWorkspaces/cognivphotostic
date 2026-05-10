'use strict';

// Taxonomy seed for South India-focused interior, lifestyle, fashion blog.
// Edit this file to add/rename. Bootstrap is idempotent: matches by `slug`,
// creates if missing, updates name/description/parent if changed.

const categories = [
  // ─── Top-level ──────────────────────────────────────────────────────────────
  { slug: 'interiors',         name: 'Interiors',           description: 'Home interiors with a South Indian sensibility — heritage, tropical, and apartment living.' },
  { slug: 'fashion',           name: 'Fashion',             description: 'Sarees, jewellery, ethnic and fusion wear rooted in South Indian style.' },
  { slug: 'lifestyle',         name: 'Lifestyle',           description: 'Food, wellness, festivals, and slow living the South Indian way.' },
  { slug: 'culture-heritage',  name: 'Culture & Heritage',  description: 'Crafts, temples, weavers and the cultural threads that tie it all together.' },
  { slug: 'shop-the-look',     name: 'Shop the Look',       description: 'Curated affiliate picks — sarees, decor, jewellery and more.' },

  // ─── Interiors subcategories ────────────────────────────────────────────────
  { slug: 'chettinad-heritage-homes', name: 'Chettinad & Heritage Homes', parent: 'interiors' },
  { slug: 'kerala-tharavadu',         name: 'Kerala Tharavadu / Nalukettu', parent: 'interiors' },
  { slug: 'pooja-room-design',        name: 'Pooja Room Design',          parent: 'interiors' },
  { slug: 'courtyard-thinnai-living', name: 'Courtyard & Thinnai Living', parent: 'interiors' },
  { slug: 'apartment-interiors',      name: 'Apartment Interiors',        parent: 'interiors' },
  { slug: 'small-space-rental',       name: 'Small Space & Rental-Friendly', parent: 'interiors' },
  { slug: 'tropical-monsoon-design',  name: 'Tropical & Monsoon-Proof Design', parent: 'interiors' },
  { slug: 'vastu-layout',             name: 'Vastu & Layout',             parent: 'interiors' },
  { slug: 'festive-decor',            name: 'Festive Decor',              parent: 'interiors' },

  // ─── Fashion subcategories ──────────────────────────────────────────────────
  { slug: 'sarees',                   name: 'Sarees',                     parent: 'fashion' },
  { slug: 'half-sarees-langa-voni',   name: 'Half Sarees / Langa Voni',   parent: 'fashion' },
  { slug: 'bridal-wear',              name: 'Bridal Wear',                parent: 'fashion' },
  { slug: 'temple-jewellery',         name: 'Temple Jewellery & Antique Gold', parent: 'fashion' },
  { slug: 'everyday-ethnic-fusion',   name: 'Everyday Ethnic / Fusion Wear', parent: 'fashion' },
  { slug: 'mens-veshti-kurta',        name: "Men's Veshti, Kurta & Sherwani", parent: 'fashion' },
  { slug: 'skincare-tropical',        name: 'Skincare for Tropical Climate', parent: 'fashion' },
  { slug: 'hair-care',                name: 'Hair Care',                  parent: 'fashion' },
  { slug: 'monsoon-summer-wardrobe',  name: 'Monsoon & Summer Wardrobe',  parent: 'fashion' },

  // ─── Lifestyle subcategories ────────────────────────────────────────────────
  { slug: 'south-indian-cooking',     name: 'South Indian Home Cooking',  parent: 'lifestyle' },
  { slug: 'filter-coffee-tiffin',     name: 'Filter Coffee & Tiffin Culture', parent: 'lifestyle' },
  { slug: 'wellness-ayurveda',        name: 'Wellness & Ayurveda',        parent: 'lifestyle' },
  { slug: 'festivals-rituals',        name: 'Festivals & Rituals',        parent: 'lifestyle' },
  { slug: 'parenting-traditions',     name: 'Parenting & Family Traditions', parent: 'lifestyle' },
  { slug: 'slow-living',              name: 'Slow Living',                parent: 'lifestyle' },
  { slug: 'sustainable-handmade',     name: 'Sustainable & Handmade',     parent: 'lifestyle' },

  // ─── Culture & Heritage subcategories ───────────────────────────────────────
  { slug: 'temples-architecture',     name: 'Temples & Architecture',     parent: 'culture-heritage' },
  { slug: 'crafts',                   name: 'Crafts',                     parent: 'culture-heritage' },
  { slug: 'weavers-artisans',         name: 'Weavers & Artisans',         parent: 'culture-heritage' },
  { slug: 'regional-spotlights',      name: 'Regional Spotlights',        parent: 'culture-heritage' },

  // ─── Shop the Look subcategories ────────────────────────────────────────────
  { slug: 'saree-edits',              name: 'Saree Edits',                parent: 'shop-the-look' },
  { slug: 'jewellery-picks',          name: 'Jewellery Picks',            parent: 'shop-the-look' },
  { slug: 'home-decor-finds',         name: 'Home Decor Finds',           parent: 'shop-the-look' },
  { slug: 'skincare-beauty-picks',    name: 'Skincare & Beauty',          parent: 'shop-the-look' },
  { slug: 'gifting-guides',           name: 'Gifting Guides',             parent: 'shop-the-look' },
];

const tags = [
  // Region
  'tamil-nadu', 'kerala', 'karnataka', 'andhra-pradesh', 'telangana',
  'chennai', 'bengaluru', 'hyderabad', 'kochi', 'madurai', 'mysuru', 'coimbatore',
  // Occasion
  'wedding', 'griha-pravesham', 'pongal', 'onam', 'ugadi', 'diwali', 'navratri',
  'varalakshmi-vratam', 'karva-chauth', 'engagement', 'baby-shower-seemantham',
  // Style / Aesthetic
  'minimalist', 'maximalist', 'boho', 'traditional', 'indo-western',
  'vintage', 'coastal', 'colonial', 'earthy', 'jewel-tones',
  // Material / Craft
  'silk', 'cotton', 'linen', 'handloom', 'block-print', 'kalamkari', 'ikat',
  'terracotta', 'brass', 'teak', 'rosewood', 'athangudi-tiles', 'oxide-flooring',
  // Budget / Format
  'under-5k', 'under-25k', 'splurge', 'diy', 'rental-friendly',
  'gift-guide', 'haul', 'review', 'tutorial', 'lookbook',
  // Audience
  'bride', 'groom', 'new-home', 'working-women', 'nri', 'students',
].map((slug) => ({
  slug,
  name: slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
}));

module.exports = { categories, tags };
