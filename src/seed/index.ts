import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

// ─── Types ──────────────────────────────────────────────────────────────────

type ProductUnit = 'kg' | 'lb' | 'dozen' | 'bunch' | 'piece'
type ProductStatus = 'in_season' | 'out_of_season' | 'sold_out'
type FarmType = 'produce' | 'dairy' | 'livestock' | 'mixed' | 'orchard'

type ProductDef = {
  name: string
  category: string
  price: number
  unit: ProductUnit
  stock: number
  status?: ProductStatus
  desc: string
}

type FarmDef = {
  email: string
  ownerName: string
  name: string
  type: FarmType
  organic: boolean
  region: string
  city: string
  address: string
  lat: number
  lng: number
  desc: string
  products: ProductDef[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ADMIN_PW = 'admin123'
const FARM_PW = 'farm123456'
const CUSTOMER_PW = 'customer123'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

function pickN<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function fetchMedia(payload: any, seed: number, alt: string): Promise<string> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(`https://picsum.photos/seed/${seed}/900/600`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = Buffer.from(await res.arrayBuffer())
      const media = await payload.create({
        collection: 'media',
        data: { alt },
        file: { data, mimetype: 'image/jpeg', name: `seed-${seed}.jpg`, size: data.length },
        overrideAccess: true,
      })
      return media.id as string
    } catch (err) {
      if (attempt === 3) throw new Error(`Failed to fetch image seed ${seed}: ${err}`)
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
  throw new Error('unreachable')
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Produce', key: 'produce' },
  { name: 'Dairy', key: 'dairy' },
  { name: 'Eggs', key: 'eggs' },
  { name: 'Meat', key: 'meat' },
  { name: 'Honey', key: 'honey' },
  { name: 'Baked Goods', key: 'baked_goods' },
] as const

const CUSTOMERS = [
  { name: 'Anna Mueller', email: 'anna.mueller@example.com' },
  { name: 'Max Bauer', email: 'max.bauer@example.com' },
  { name: 'Sophie Wagner', email: 'sophie.wagner@example.com' },
  { name: 'Lukas Schmidt', email: 'lukas.schmidt@example.com' },
  { name: 'Emma Fischer', email: 'emma.fischer@example.com' },
  { name: 'Noah Schneider', email: 'noah.schneider@example.com' },
  { name: 'Mia Hoffmann', email: 'mia.hoffmann@example.com' },
  { name: 'Felix Weber', email: 'felix.weber@example.com' },
  { name: 'Lena Braun', email: 'lena.braun@example.com' },
  { name: 'Jonas Zimmermann', email: 'jonas.zimmermann@example.com' },
]

// Review pools per farm type
const REVIEWS: Record<FarmType, { rating: number; title: string; comment: string }[]> = {
  orchard: [
    { rating: 5, title: 'Incredibly fresh fruit!', comment: 'The apples were perfectly crisp and the freshly pressed juice is the best I have ever had. Highly recommended!' },
    { rating: 4, title: 'Great variety', comment: 'Really impressive selection of varieties. The homemade jam is an absolute highlight.' },
    { rating: 5, title: 'Best fruit in the region', comment: 'You can immediately taste that everything comes straight from the farm. Quality like it used to be.' },
    { rating: 4, title: 'Highly recommended', comment: 'Fast delivery, everything well packaged. The pears were so ripe and juicy. I order here regularly.' },
    { rating: 5, title: 'Real flavor', comment: 'After years, fruit that actually tastes like fruit again. A wonderful difference compared to supermarket produce.' },
  ],
  dairy: [
    { rating: 5, title: 'Exceptional dairy products', comment: 'The cheese is absolutely phenomenal. Real farm flavor that you simply cannot get in any supermarket.' },
    { rating: 5, title: 'Best butter around', comment: 'The farm butter has such an incredibly creamy, rich taste. My whole family is delighted.' },
    { rating: 4, title: 'Wonderful fresh milk', comment: 'I love the non-homogenized milk with the cream layer on top. That is exactly how milk should be!' },
    { rating: 5, title: 'Artisan quality', comment: 'Yogurt and quark at the highest level. You can feel how much care and love goes into every product.' },
    { rating: 4, title: 'Regular customer', comment: 'I order every week. The quality is consistently excellent and delivery is always on time.' },
  ],
  produce: [
    { rating: 5, title: 'Finally, real tomatoes!', comment: 'The tomatoes actually taste like tomatoes. What a difference compared to supermarket produce. Excellent farm!' },
    { rating: 4, title: 'Great organic quality', comment: 'The mixed vegetable box was fresh and well sorted. Everything perfect, great value for money.' },
    { rating: 5, title: 'Local farming at its best', comment: 'Huge variety, all hand-picked. The heritage varieties are an absolute highlight. Highly recommended!' },
    { rating: 4, title: 'Fresher than fresh', comment: 'Harvested in the morning, at my door by noon. You simply cannot get this kind of freshness anywhere else.' },
    { rating: 5, title: 'Absolutely delighted', comment: 'We have been loyal customers since our very first order. The herbs are so intensely aromatic, it is a dream.' },
  ],
  livestock: [
    { rating: 5, title: 'Best meat I have ever bought', comment: 'The pork schnitzel was incredibly tender. You can immediately tell these animals are raised with real care.' },
    { rating: 4, title: 'Excellent quality', comment: 'The bratwurst were outstanding – perfectly seasoned and incredibly juicy. This is now our go-to farm!' },
    { rating: 5, title: 'Real farm flavor', comment: 'The beef roast fell apart after 3 hours in the oven. Full of flavor, absolutely fantastic!' },
    { rating: 5, title: 'Craftsmanship at its finest', comment: 'Everything from their own butchery and processing. You can taste it. The liver pate is the best spread I have had.' },
    { rating: 4, title: 'Regular order', comment: 'I have been buying the mince and sausages here for months now. Quality consistently remains very high.' },
  ],
  mixed: [
    { rating: 5, title: 'Fantastic variety', comment: 'I love the product range – from eggs to honey, everything is at the highest level. Absolutely brilliant farm!' },
    { rating: 4, title: 'Very happy with the order', comment: 'The eggs had brilliantly orange yolks. The chicken was juicy and full of flavor. Excellent!' },
    { rating: 5, title: 'Transparent and fair farming', comment: 'It is so nice to know exactly where your food comes from. The quality is noticeably better than in any shop.' },
    { rating: 4, title: 'Would recommend', comment: 'Family-friendly farm with genuine commitment to quality. The products deliver exactly what they promise.' },
    { rating: 5, title: 'My weekly go-to farm', comment: 'I have been ordering here regularly for over a year now. Never once been disappointed. Absolutely recommended.' },
  ],
}

// Order status pool (weighted towards completed/confirmed)
const ORDER_STATUSES: Array<'pending' | 'confirmed' | 'shipped' | 'completed' | 'cancelled'> = [
  'completed',
  'completed',
  'completed',
  'confirmed',
  'confirmed',
  'shipped',
  'pending',
  'cancelled',
]

const FARMS: FarmDef[] = [
  {
    email: 'obstgut.mueller@farmshop.com',
    ownerName: 'Klaus Mueller',
    name: "Mueller's Orchard",
    type: 'orchard',
    organic: false,
    region: 'Bavaria',
    city: 'Rosenheim',
    address: '12 Orchard Lane',
    lat: 47.8561,
    lng: 12.1289,
    desc: 'Our family orchard has been cultivating traditional stone and pome fruit at the foot of the Bavarian Alps for over 80 years. With more than 3,000 fruit trees, we offer seasonal fruit, freshly pressed juices, and homemade jams — all directly from our farm.',
    products: [
      { name: 'Honeycrisp Apples', category: 'produce', price: 2.90, unit: 'kg', stock: 120, desc: 'Crisp, sweet Honeycrisp apples picked straight from the tree. Perfect for eating fresh or baking.' },
      { name: 'Conference Pears', category: 'produce', price: 3.50, unit: 'kg', stock: 80, desc: 'Juicy Conference pears at peak ripeness. Great for desserts and as a fresh snack.' },
      { name: 'Italian Plums', category: 'produce', price: 4.20, unit: 'kg', stock: 60, desc: 'Traditional Italian plums with deep purple skin and a sweet, intense aroma.' },
      { name: 'Mirabelle Plums', category: 'produce', price: 5.90, unit: 'kg', stock: 40, status: 'out_of_season', desc: 'Small golden mirabelle plums of extraordinary sweetness. Only available in midsummer.' },
      { name: 'Cloudy Apple Juice', category: 'produce', price: 3.80, unit: 'piece', stock: 45, desc: 'Freshly pressed cloudy apple juice from a blend of orchard varieties. 1-liter bottle.' },
      { name: 'Pear Jam', category: 'baked_goods', price: 4.90, unit: 'piece', stock: 30, desc: 'Homemade pear jam with a hint of vanilla. Made from our own Conference pears. 250g jar.' },
      { name: 'Apple Cider Vinegar', category: 'produce', price: 6.50, unit: 'piece', stock: 25, desc: 'Naturally fermented apple cider vinegar, aged in oak barrels. 500ml bottle.' },
      { name: 'Dried Apple Rings', category: 'produce', price: 5.90, unit: 'piece', stock: 35, desc: 'Gently dried apple rings, lightly sweetened. 200g bag — a healthy and satisfying snack.' },
    ],
  },
  {
    email: 'hofmolkerei.weber@farmshop.com',
    ownerName: 'Heike Weber',
    name: 'Weber Family Dairy',
    type: 'dairy',
    organic: true,
    region: 'Bavaria',
    city: 'Kempten',
    address: '34 Alpine Street',
    lat: 47.7267,
    lng: 10.3150,
    desc: 'Our organic dairy farm in the Allgaeu region keeps a small herd of Brown Swiss cattle on lush alpine pastures. The fresh mountain air and rich grass give our milk and dairy products their unmistakable depth of flavor.',
    products: [
      { name: 'Organic Whole Milk', category: 'dairy', price: 1.80, unit: 'piece', stock: 80, desc: 'Fresh whole milk from our organic herd, pasteurized but not homogenized. 1-liter glass bottle.' },
      { name: 'Allgaeu Emmentaler', category: 'dairy', price: 12.90, unit: 'kg', stock: 15, desc: 'Traditional Allgaeu Emmentaler with characteristic holes and a nutty flavor. Aged at least 4 months. Per 100g.' },
      { name: 'Farmhouse Butter', category: 'dairy', price: 4.50, unit: 'piece', stock: 40, desc: 'Hand-churned butter from the fresh cream of our pasture cows. Golden, rich, and intensely flavored. 250g.' },
      { name: 'Organic Greek-Style Yogurt', category: 'dairy', price: 2.20, unit: 'piece', stock: 60, desc: 'Thick, creamy yogurt from whole milk, strained to perfection. 500g pot.' },
      { name: 'Sour Cream', category: 'dairy', price: 1.90, unit: 'piece', stock: 50, desc: 'Fresh sour cream with 24% fat content. Ideal for dips, sauces, and baking. 200ml.' },
      { name: 'Farmers Quark', category: 'dairy', price: 2.50, unit: 'piece', stock: 45, desc: 'Fresh quark from whole milk. Smooth and mild — ideal for cheesecake and dips. 500g.' },
      { name: 'Whipping Cream', category: 'dairy', price: 1.60, unit: 'piece', stock: 55, desc: 'Fresh whipping cream, 35% fat. Whips perfectly and has a natural, full-bodied aroma. 200ml.' },
      { name: 'Mountain Herb Cheese', category: 'dairy', price: 9.90, unit: 'kg', stock: 12, desc: 'Semi-hard mountain cheese blended with locally sourced alpine herbs. Mild and aromatic. Per 100g.' },
      { name: 'Organic Kefir', category: 'dairy', price: 2.80, unit: 'piece', stock: 35, desc: 'Traditionally fermented kefir, naturally slightly fizzy. 500ml bottle. Rich in live probiotics.' },
    ],
  },
  {
    email: 'biohof.sonnenschein@farmshop.com',
    ownerName: 'Petra Sonnenschein',
    name: 'Sunshine Organic Farm',
    type: 'produce',
    organic: true,
    region: 'Baden-Wuerttemberg',
    city: 'Freiburg',
    address: '7 Vineyard Path',
    lat: 47.9990,
    lng: 7.8421,
    desc: 'Since 1998 we have been running our certified organic vegetable farm in the sunny Freiburg countryside. We rely on diverse crop rotations, companion planting, and gentle soil management to grow healthy vegetables without pesticides.',
    products: [
      { name: 'Organic Zucchini', category: 'produce', price: 2.40, unit: 'kg', stock: 70, desc: 'Tender organic zucchini, harvested young. Great for grilling, roasting, or raw in salads.' },
      { name: 'Organic Vine Tomatoes', category: 'produce', price: 3.90, unit: 'kg', stock: 60, desc: 'Sun-ripened organic vine tomatoes with intense flavor. Grown outdoors in our fields.' },
      { name: 'Mixed Salad Bag', category: 'produce', price: 2.80, unit: 'piece', stock: 40, desc: 'Ready-to-eat organic salad mix of 6 varieties. Washed and pre-packed. 150g bag.' },
      { name: 'Organic Carrots', category: 'produce', price: 2.20, unit: 'kg', stock: 90, desc: 'Sweet organic carrots grown without pesticides, sold with tops still attached. Wonderful crunch.' },
      { name: 'Organic Bell Peppers Mixed', category: 'produce', price: 4.50, unit: 'kg', stock: 55, desc: 'Colorful organic bell peppers in red, yellow, and orange. Sweet and crisp.' },
      { name: 'Cherry Tomatoes', category: 'produce', price: 4.90, unit: 'kg', stock: 45, desc: 'Sweet organic cherry tomatoes, a mix of red, yellow, and black varieties. 500g punnet.' },
      { name: 'Organic Cucumber', category: 'produce', price: 1.20, unit: 'piece', stock: 80, desc: 'Large organic cucumber, freshly picked. Thin skin, no bitterness. Perfect for salads.' },
      { name: 'Fresh Basil Plant', category: 'produce', price: 2.90, unit: 'piece', stock: 25, desc: 'Living basil plant in a pot, fragrant Genovese variety. Snip leaves as needed.' },
      { name: 'Rainbow Swiss Chard', category: 'produce', price: 2.60, unit: 'bunch', stock: 30, desc: 'Colorful rainbow chard with red, yellow, and orange stems. Very nutritious and versatile.' },
      { name: 'Pak Choi', category: 'produce', price: 2.90, unit: 'piece', stock: 35, desc: 'Fresh baby pak choi, mild and tender. Ideal for stir-fries and soups.' },
      { name: 'Organic Kohlrabi', category: 'produce', price: 1.80, unit: 'piece', stock: 50, desc: 'Crispy organic kohlrabi in green and purple. Sweet raw and delicious cooked.' },
      { name: 'Heritage Radishes', category: 'produce', price: 1.50, unit: 'bunch', stock: 40, desc: 'Mixed heritage radishes — round, long, and white varieties bundled together.' },
    ],
  },
  {
    email: 'gutshof.roth@farmshop.com',
    ownerName: 'Bernd Roth',
    name: 'Roth Livestock Farm',
    type: 'livestock',
    organic: false,
    region: 'Bavaria',
    city: 'Deggendorf',
    address: '3 Farm Lane',
    lat: 48.8375,
    lng: 12.9600,
    desc: 'Roth Livestock Farm is a traditional estate with over 100 years of history. Our animals grow up on natural pastures. We butcher in-house and process everything on site — for full transparency and fair prices.',
    products: [
      { name: 'Pork Schnitzel', category: 'meat', price: 12.90, unit: 'kg', stock: 25, desc: 'Lean pork schnitzel cuts from our own Landrace pigs. Ready to pound and bread. Approx. 500g pack.' },
      { name: 'Bratwurst (6 pcs)', category: 'meat', price: 8.50, unit: 'piece', stock: 40, desc: 'Classic Bavarian-style bratwurst made in-house. Pure pork, seasoned with marjoram and black pepper.' },
      { name: 'Beef Roast Shoulder', category: 'meat', price: 18.90, unit: 'kg', stock: 15, desc: 'Beef shoulder for slow roasting from our own Simmental cattle. Ideal for Sunday roasts. Approx. 1.2kg.' },
      { name: 'Smoked Pork Ribs', category: 'meat', price: 14.50, unit: 'kg', stock: 20, desc: 'Beech wood-smoked pork spare ribs with our own dry rub. Ready to grill or oven-bake. Approx. 800g rack.' },
      { name: 'Smoked Pork Belly', category: 'meat', price: 9.90, unit: 'kg', stock: 30, desc: 'Slow-cured pork belly smoked over beech wood. Excellent sliced for salads or pan-fried.' },
      { name: 'Liver Pate (jar)', category: 'meat', price: 7.20, unit: 'piece', stock: 35, desc: 'Smooth pork liver pate made to our grandmother\'s recipe. 200g jar. Wonderful spread on fresh bread.' },
      { name: 'Black Pudding', category: 'meat', price: 6.80, unit: 'piece', stock: 22, desc: 'Traditional black pudding from our in-house butchery. Pan-fried in slices, it is irresistible. 300g.' },
      { name: 'Minced Beef & Pork Mix', category: 'meat', price: 10.90, unit: 'kg', stock: 30, desc: 'Mixed beef and pork mince 50/50. Ideal for bolognese, burgers, or meatballs. Fresh 500g pack.' },
    ],
  },
  {
    email: 'imkerei.bluetenzauber@farmshop.com',
    ownerName: 'Thomas Bluem',
    name: 'Blossom Magic Apiary',
    type: 'mixed',
    organic: true,
    region: 'Brandenburg',
    city: 'Potsdam',
    address: '7 Bee Lane',
    lat: 52.3906,
    lng: 13.0645,
    desc: 'Thomas Bluem has been running his organic apiary since 2005 in the flower-rich landscape around Potsdam. His bees forage exclusively on pesticide-free meadows and in the untouched forests of the Mark Brandenburg region.',
    products: [
      { name: 'Wildflower Honey 500g', category: 'honey', price: 9.90, unit: 'piece', stock: 50, desc: 'Raw wildflower honey from late summer, golden and mildly sweet. Unfiltered and unpasteurized. 500g jar.' },
      { name: 'Forest Honey 500g', category: 'honey', price: 11.90, unit: 'piece', stock: 35, desc: 'Dark forest honey from pine and fir honeydew. Strong, resinous, and full-bodied. 500g jar.' },
      { name: 'Acacia Honey 500g', category: 'honey', price: 12.50, unit: 'piece', stock: 30, desc: 'Light, liquid acacia honey with a delicate floral aroma. Stays liquid the longest of all honeys. 500g jar.' },
      { name: 'Honeycomb Block', category: 'honey', price: 16.90, unit: 'piece', stock: 15, desc: 'Pure beeswax honeycomb filled with raw honey. Eat as-is or serve on a cheese board. 300g.' },
      { name: 'Raw Bee Pollen', category: 'honey', price: 8.50, unit: 'piece', stock: 25, desc: 'Fresh raw bee pollen collected from our pollen traps. Rich in nutrients and natural enzymes. 150g bag.' },
      { name: 'Propolis Tincture', category: 'honey', price: 14.90, unit: 'piece', stock: 18, desc: 'Natural propolis extract in alcohol, used as a natural immunity support. 30ml dropper bottle.' },
    ],
  },
  {
    email: 'gefluegelhof.braun@farmshop.com',
    ownerName: 'Gisela Braun',
    name: 'Braun Poultry Farm',
    type: 'mixed',
    organic: false,
    region: 'Lower Saxony',
    city: 'Hannover',
    address: '22 Hen Lane',
    lat: 52.3759,
    lng: 9.7320,
    desc: 'Braun Poultry Farm is a fourth-generation family business. We keep chickens, ducks, and geese on generous free-range pastures and place great value on species-appropriate husbandry without any compromises.',
    products: [
      { name: 'Free Range Eggs (10 pcs)', category: 'eggs', price: 3.90, unit: 'piece', stock: 100, desc: 'Fresh free-range eggs from our happy hens. Grade A, mixed sizes. Collected fresh daily.' },
      { name: 'Duck Eggs (6 pcs)', category: 'eggs', price: 4.80, unit: 'piece', stock: 40, desc: 'Rich, creamy duck eggs with large yolks. Excellent for baking and frying.' },
      { name: 'Goose Eggs (4 pcs)', category: 'eggs', price: 5.50, unit: 'piece', stock: 20, status: 'out_of_season', desc: 'Large, flavorful goose eggs. Seasonal — spring only. Each one is equivalent to about 3 chicken eggs.' },
      { name: 'Whole Chicken (1.6 kg)', category: 'meat', price: 14.90, unit: 'piece', stock: 15, desc: 'Whole free-range chicken, oven-ready. Slow-grown heritage breed, approx. 1.5–1.8 kg.' },
      { name: 'Chicken Thighs', category: 'meat', price: 8.50, unit: 'kg', stock: 30, desc: 'Skin-on, bone-in free-range chicken thighs. Juicy and full of flavor. 500g pack.' },
      { name: 'Whole Duck (2 kg)', category: 'meat', price: 22.90, unit: 'piece', stock: 8, desc: 'Whole oven-ready duck, naturally fattened. Approx. 2.0–2.4 kg. A classic for festive occasions.' },
      { name: 'Chicken Breast Fillet', category: 'meat', price: 11.90, unit: 'kg', stock: 25, desc: 'Boneless, skinless free-range chicken breast. Approx. 2 fillets per 500g pack.' },
      { name: 'Christmas Goose (whole)', category: 'meat', price: 38.90, unit: 'piece', stock: 5, status: 'out_of_season', desc: 'Whole goose, traditionally fattened on grain and pasture. Approx. 4–5 kg. Pre-order for the festive season.' },
    ],
  },
  {
    email: 'gemuesehof.frisch@farmshop.com',
    ownerName: 'Peter Frisch',
    name: 'Fresh Fields Produce',
    type: 'produce',
    organic: false,
    region: 'North Rhine-Westphalia',
    city: 'Cologne',
    address: '56 Rhine Valley Road',
    lat: 50.9333,
    lng: 6.9500,
    desc: 'Fresh Fields Produce has been supplying the Cologne region with fresh seasonal vegetables since 1985. Our 45-hectare farm uses integrated pest management and water-saving irrigation technology.',
    products: [
      { name: 'White Asparagus', category: 'produce', price: 8.90, unit: 'kg', stock: 35, status: 'out_of_season', desc: 'Premium white asparagus grown in our sandy soil. Grade A, hand-harvested. 500g bundle. Season: April–June.' },
      { name: 'Red Beet (bunch)', category: 'produce', price: 2.20, unit: 'bunch', stock: 55, desc: 'Fresh beetroot with tops, sold in bunches of 4–5 roots. Sweet and earthy flavor.' },
      { name: 'Savoy Cabbage', category: 'produce', price: 2.80, unit: 'piece', stock: 40, desc: 'Large, frilly savoy cabbage head. Mild and slightly sweet. Great for stuffed cabbage rolls.' },
      { name: 'Leek (bunch)', category: 'produce', price: 1.90, unit: 'bunch', stock: 60, desc: 'Fresh leek stalks, 3 per bunch. Savory and essential for soups and gratins.' },
      { name: 'Celeriac (whole)', category: 'produce', price: 2.50, unit: 'piece', stock: 45, desc: 'Round celeriac root with a strong celery flavor. Excellent roasted, mashed, or raw in remoulade.' },
      { name: 'Hamburg Parsley Root', category: 'produce', price: 3.20, unit: 'bunch', stock: 30, desc: 'Parsley root — milder than celeriac, essential for soups and stocks. 3–4 roots per bunch.' },
      { name: 'Pointed Cabbage', category: 'produce', price: 2.60, unit: 'piece', stock: 50, desc: 'Tender early-season white cabbage with a conical head. Sweeter and more delicate than winter cabbage.' },
      { name: 'Romanesco', category: 'produce', price: 3.80, unit: 'piece', stock: 25, desc: 'Beautiful fractal Romanesco cauliflower, lime green with a nutty flavor. A real showstopper vegetable.' },
      { name: 'Florence Fennel', category: 'produce', price: 2.90, unit: 'piece', stock: 35, desc: 'Crunchy fennel bulb with feathery fronds. Sweet anise flavor, perfect raw in salads or braised.' },
      { name: 'Jerusalem Artichoke', category: 'produce', price: 4.50, unit: 'kg', stock: 20, desc: 'Knobbly, nutty Jerusalem artichokes. Season: autumn and winter. Roast, make soup, or pan-fry.' },
    ],
  },
  {
    email: 'landbaeckerei.kornfeld@farmshop.com',
    ownerName: 'Susanne Kornfeld',
    name: 'Kornfeld Country Bakery',
    type: 'mixed',
    organic: false,
    region: 'Bavaria',
    city: 'Augsburg',
    address: '9 Mill Street',
    lat: 48.3705,
    lng: 10.8978,
    desc: 'We have been baking artisan bread and pastries from regional grain for 30 years. Our sourdough starter has been nurtured for generations, and we even mill part of our flour ourselves on the old farm mill.',
    products: [
      { name: 'Sourdough Bread (800g)', category: 'baked_goods', price: 5.90, unit: 'piece', stock: 30, desc: 'Classic wheat sourdough with a thick crust and moist, chewy crumb. Baked in a stone oven every morning.' },
      { name: 'Dark Rye Bread (1kg)', category: 'baked_goods', price: 6.50, unit: 'piece', stock: 25, desc: 'Dense, moist rye bread with whole rye grains. Made with our 20-year-old starter. Keeps for a long time.' },
      { name: 'Bavarian Pretzels (4 pcs)', category: 'baked_goods', price: 3.20, unit: 'piece', stock: 50, desc: 'Freshly baked lye pretzels with coarse sea salt. Crispy outside, soft and fluffy inside.' },
      { name: 'Apple Strudel', category: 'baked_goods', price: 7.90, unit: 'piece', stock: 15, desc: 'Traditional apple strudel with cinnamon, raisins, and pine nuts. Serve warm with whipped cream.' },
      { name: 'Cinnamon Rolls (6 pcs)', category: 'baked_goods', price: 4.50, unit: 'piece', stock: 20, desc: 'Soft yeasted cinnamon rolls glazed with cream cheese icing. Freshly baked every day.' },
      { name: 'Spelt Farmer Loaf', category: 'baked_goods', price: 5.20, unit: 'piece', stock: 20, desc: 'Hearty spelt loaf with sunflower and pumpkin seeds. Dense crumb with a wonderfully nutty aroma.' },
      { name: 'Bavarian Plum Sheet Cake', category: 'baked_goods', price: 8.90, unit: 'piece', stock: 10, desc: 'Classic Bavarian plum sheet cake topped with Italian plums and vanilla sugar. Available August–October.' },
      { name: 'Butter Croissants (4 pcs)', category: 'baked_goods', price: 4.20, unit: 'piece', stock: 30, desc: 'Flaky, buttery croissants made with real Alpine butter. Crispy layers, soft and airy inside.' },
    ],
  },
  {
    email: 'schaeferei.wolkenfeld@farmshop.com',
    ownerName: 'Andreas Wolke',
    name: 'Wolkenfeld Sheep Farm',
    type: 'livestock',
    organic: true,
    region: 'Thuringia',
    city: 'Erfurt',
    address: "4 Shepherd's Way",
    lat: 50.9847,
    lng: 11.0299,
    desc: 'On our organic sheep farm in the Thuringian countryside we keep a flock of 200 Merino crossbreeds. Our sheep graze exclusively on natural meadows and are raised without antibiotics in full accordance with animal welfare standards.',
    products: [
      { name: 'Lamb Chops', category: 'meat', price: 19.90, unit: 'kg', stock: 20, desc: 'Tender lamb loin chops from our grass-fed Merino flock. 4 chops per 500g pack. Mild and delicate flavor.' },
      { name: 'Leg of Lamb (bone-in)', category: 'meat', price: 16.90, unit: 'kg', stock: 10, desc: 'Whole bone-in leg of lamb, approx. 1.8–2.2 kg. Ideal for slow roasting with herbs.' },
      { name: 'Ground Lamb', category: 'meat', price: 12.50, unit: 'kg', stock: 25, desc: 'Lean minced lamb, 500g pack. Perfect for moussaka, kofta, or lamb burgers.' },
      { name: 'Lamb Merguez Sausage', category: 'meat', price: 9.90, unit: 'piece', stock: 18, desc: 'Spiced lamb sausages with harissa and North African spices. 4 sausages per 400g pack.' },
      { name: 'Sheep Feta-Style Cheese', category: 'dairy', price: 14.90, unit: 'piece', stock: 15, desc: 'Creamy white sheep cheese packed in brine. Sharp and pleasantly salty. 200g block in a jar.' },
      { name: 'Sheep Yogurt (natural)', category: 'dairy', price: 3.80, unit: 'piece', stock: 20, desc: 'Thick, mild sheep milk yogurt. Richer fat content than cow milk yogurt. 300g pot.' },
      { name: 'Fresh Sheep Milk (1L)', category: 'dairy', price: 2.90, unit: 'piece', stock: 25, desc: 'Fresh sheep milk, gently pasteurized. Rich and slightly sweet. 1-liter bottle.' },
    ],
  },
  {
    email: 'erdbeerhof.roetger@farmshop.com',
    ownerName: 'Markus Roetger',
    name: 'Roetger Berry Farm',
    type: 'produce',
    organic: false,
    region: 'North Rhine-Westphalia',
    city: 'Muenster',
    address: '18 Berenbrook Road',
    lat: 51.9607,
    lng: 7.6261,
    desc: 'Roetger Berry Farm specializes in berries and seasonal soft fruit. Alongside classic strawberries, we cultivate heritage fruit varieties and rare berry types across 30 hectares in the Muensterland region.',
    products: [
      { name: 'Garden Strawberries', category: 'produce', price: 5.90, unit: 'kg', stock: 60, desc: 'Sun-ripened strawberries picked at full sweetness. Available June to August. 500g punnet.' },
      { name: 'Raspberries', category: 'produce', price: 7.90, unit: 'kg', stock: 40, desc: 'Fresh raspberries, fragrant and sweet. Picked by hand. 250g punnet. Handle with care.' },
      { name: 'Blueberries', category: 'produce', price: 8.50, unit: 'kg', stock: 35, desc: 'Cultivated blueberries, large and very sweet. 250g punnet. Great for baking and smoothies.' },
      { name: 'Gooseberries', category: 'produce', price: 6.50, unit: 'kg', stock: 30, status: 'out_of_season', desc: 'Tart green gooseberries, excellent for jams and compotes. Available June to July.' },
      { name: 'Blackcurrants', category: 'produce', price: 7.20, unit: 'kg', stock: 25, status: 'out_of_season', desc: 'Rich, dark blackcurrants with an intense aroma. Perfect for juices, jams, and sorbets. 250g punnet.' },
      { name: 'Mixed Berry Jam', category: 'baked_goods', price: 5.90, unit: 'piece', stock: 40, desc: 'Homemade jam from our own berries — strawberry, raspberry, and blackcurrant. 250g jar.' },
      { name: 'Summer Berry Compote (jar)', category: 'baked_goods', price: 4.80, unit: 'piece', stock: 30, desc: 'Summer berry compote in light syrup. A mix of 5 varieties. Serve over yogurt or ice cream. 350g.' },
    ],
  },
  {
    email: 'hofbrennerei.steinbach@farmshop.com',
    ownerName: 'Gerhard Steinbach',
    name: 'Steinbach Orchard House',
    type: 'orchard',
    organic: false,
    region: 'Saxony',
    city: 'Dresden',
    address: '21 Elbe Slope Road',
    lat: 51.0504,
    lng: 13.7373,
    desc: 'Steinbach Orchard House on the Elbe hillsides near Dresden combines traditional fruit growing with modern craftsmanship. We process everything in-house — from the harvest through pressing to jam-making.',
    products: [
      { name: 'Plum Butter (jar)', category: 'baked_goods', price: 5.50, unit: 'piece', stock: 35, desc: 'Intensely flavored plum butter, slow-cooked for hours until thick and smooth. No added sugar. 340g jar.' },
      { name: 'Sour Cherry Jam', category: 'baked_goods', price: 5.90, unit: 'piece', stock: 30, desc: 'Sour cherry jam with real fruit pieces. A perfect balance of sweet and tart. 250g jar.' },
      { name: 'Natural Apple Sauce', category: 'baked_goods', price: 3.90, unit: 'piece', stock: 45, desc: 'Smooth applesauce from mixed dessert apples, no sugar or additives. 350g jar.' },
      { name: 'Pear Nectar (1L)', category: 'produce', price: 3.80, unit: 'piece', stock: 25, desc: 'Freshly pressed pear nectar from Conference and Williams pears. 1-liter glass bottle.' },
      { name: 'Seasonal Fruit Basket (3kg)', category: 'produce', price: 18.90, unit: 'piece', stock: 10, desc: 'Seasonal fruit basket with apples, pears, and plums from our orchard. Approx. 3 kg assortment.' },
      { name: 'Dried Fruit Mix (200g)', category: 'produce', price: 8.90, unit: 'piece', stock: 20, desc: 'Naturally dried mix of apple rings, plums, and pear pieces. No sulfites or added sugar. 200g bag.' },
    ],
  },
  {
    email: 'milchhof.nordkap@farmshop.com',
    ownerName: 'Ingrid Nordmann',
    name: 'North Cape Dairy',
    type: 'dairy',
    organic: true,
    region: 'Mecklenburg-Vorpommern',
    city: 'Rostock',
    address: '3 Meadow Lane',
    lat: 54.0887,
    lng: 12.1404,
    desc: 'On our organic dairy farm on the Baltic Sea coast we keep 80 Holstein-Friesian cows. Fresh sea air and lush coastal meadows give our dairy products their uniquely clean and rich flavor.',
    products: [
      { name: 'Organic Whole Milk (1L)', category: 'dairy', price: 1.90, unit: 'piece', stock: 70, desc: 'Full-fat organic milk from our coastal herd, gently pasteurized and not homogenized. 1 liter.' },
      { name: 'Organic Skimmed Milk (1L)', category: 'dairy', price: 1.70, unit: 'piece', stock: 50, desc: 'Organic low-fat milk, 1.5% fat. Light and fresh, same quality standards as our whole milk.' },
      { name: 'Cream Cheese (natural)', category: 'dairy', price: 3.20, unit: 'piece', stock: 40, desc: 'Fresh, spreadable cream cheese made from organic milk. Mild and slightly tangy. 200g tub.' },
      { name: 'Young Gouda (3 months)', category: 'dairy', price: 11.90, unit: 'kg', stock: 18, desc: 'Mild, buttery young Gouda with a smooth, supple texture. Our dairy signature product. Per 100g.' },
      { name: 'Aged Gouda (12 months)', category: 'dairy', price: 13.90, unit: 'kg', stock: 12, desc: 'Matured Gouda with caramel notes and a slightly crumbly texture. Rich and complex. Per 100g.' },
      { name: 'Organic Buttermilk (500ml)', category: 'dairy', price: 1.50, unit: 'piece', stock: 45, desc: 'Natural buttermilk, a byproduct of our butter churning. Refreshing, slightly sour, and low in fat.' },
      { name: 'Organic Butter (250g)', category: 'dairy', price: 3.80, unit: 'piece', stock: 40, desc: 'Freshly churned unsalted butter from our own cream. Pale golden, rich and creamy.' },
      { name: 'Creme Fraiche (200g)', category: 'dairy', price: 2.50, unit: 'piece', stock: 35, desc: 'Thick, tangy creme fraiche, 30% fat. Ideal for sauces, soups, and desserts.' },
    ],
  },
  {
    email: 'wildkraeuter.berg@farmshop.com',
    ownerName: 'Katharina Berg',
    name: 'Berg Herb Garden',
    type: 'produce',
    organic: true,
    region: 'Baden-Wuerttemberg',
    city: 'Stuttgart',
    address: '14 Herb Trail',
    lat: 48.7758,
    lng: 9.1829,
    desc: 'Katharina Berg has dedicated her entire farm to herb cultivation. Across 8 hectares she grows over 60 varieties of herbs and aromatic plants — from everyday kitchen herbs to rare medicinal plants.',
    products: [
      { name: 'Fresh Chives (bunch)', category: 'produce', price: 1.80, unit: 'bunch', stock: 50, desc: 'Freshly cut chives with a mild onion flavor. 50g bunch. Snip over soups, eggs, or potatoes.' },
      { name: 'Rosemary (bunch)', category: 'produce', price: 1.60, unit: 'bunch', stock: 45, desc: 'Fragrant rosemary, 40g bunch. Ideal for roasting meats, potatoes, and focaccia.' },
      { name: 'Thyme (bunch)', category: 'produce', price: 1.60, unit: 'bunch', stock: 45, desc: 'Aromatic thyme, 40g bunch. Perfect for Mediterranean cooking and roasted vegetables.' },
      { name: 'Culinary Lavender (bunch)', category: 'produce', price: 2.20, unit: 'bunch', stock: 30, desc: 'Culinary lavender for sweet and savory dishes. Also lovely as a dried arrangement. 50g bunch.' },
      { name: 'Spearmint (bunch)', category: 'produce', price: 1.50, unit: 'bunch', stock: 40, desc: 'Fresh spearmint, milder than peppermint. Great for tea, cocktails, and Middle Eastern dishes.' },
      { name: 'Garden Sage (bunch)', category: 'produce', price: 1.70, unit: 'bunch', stock: 35, desc: 'Aromatic sage leaves. Wonderful with pasta, pork, or browned butter. 40g bunch.' },
      { name: 'Soup Herb Mix', category: 'produce', price: 2.80, unit: 'bunch', stock: 30, desc: 'Classic soup herb bundle: parsley, lovage, leek greens, and celery leaves. Pre-bundled fresh.' },
      { name: 'Dried Italian Herb Mix', category: 'produce', price: 4.50, unit: 'piece', stock: 25, desc: 'Dried Italian herb blend: basil, oregano, thyme, rosemary, marjoram. 30g resealable bag.' },
      { name: 'Herb-Infused Olive Oil (250ml)', category: 'produce', price: 8.90, unit: 'piece', stock: 15, desc: 'Cold-pressed olive oil infused with our own rosemary and thyme. 250ml bottle. Excellent on salads.' },
    ],
  },
  {
    email: 'kartoffelhof.scholle@farmshop.com',
    ownerName: 'Werner Scholle',
    name: 'Scholle Potato Farm',
    type: 'produce',
    organic: false,
    region: 'Brandenburg',
    city: 'Cottbus',
    address: '33 Field Path',
    lat: 51.7563,
    lng: 14.3329,
    desc: 'Scholle Potato Farm cultivates 150 hectares of sandy Brandenburg soil — ideal conditions for growing potatoes. With over 15 varieties, ranging from waxy to floury, we have everything the kitchen needs.',
    products: [
      { name: 'Waxy Potatoes (La Ratte)', category: 'produce', price: 1.90, unit: 'kg', stock: 200, desc: 'Firm, waxy La Ratte fingerling potatoes. Perfect for salads and pan-frying. 1kg net.' },
      { name: 'Floury Potatoes (Bintje)', category: 'produce', price: 1.80, unit: 'kg', stock: 180, desc: 'Classic floury Bintje potatoes, ideal for mash, dumplings, and soups. 1kg net.' },
      { name: 'Sweet Potatoes', category: 'produce', price: 2.90, unit: 'kg', stock: 80, desc: 'Orange-fleshed sweet potatoes grown in our sandy soil. Rich in beta-carotene, great roasted or as fries.' },
      { name: 'Yellow Onions (1kg)', category: 'produce', price: 1.50, unit: 'kg', stock: 150, desc: 'Brown-skinned cooking onions, mild and versatile. 1kg net bag. A true kitchen staple.' },
      { name: 'Red Onions', category: 'produce', price: 2.20, unit: 'kg', stock: 100, desc: 'Mild red onions, great raw in salads or roasted until caramelized. 500g net.' },
      { name: 'Garlic (whole head)', category: 'produce', price: 3.90, unit: 'kg', stock: 60, desc: 'Fresh garlic with tight, papery skin. Fragrant and potent. 3–4 heads per 250g.' },
      { name: 'Echalion Shallots', category: 'produce', price: 4.50, unit: 'kg', stock: 40, desc: 'Long banana shallots with a mild, sweet onion-garlic flavor. 500g net. Ideal for sauces.' },
    ],
  },
  {
    email: 'alpenkaeserei.bergblick@farmshop.com',
    ownerName: 'Franz Bergmaier',
    name: 'Alpine View Creamery',
    type: 'dairy',
    organic: true,
    region: 'Bavaria',
    city: 'Garmisch-Partenkirchen',
    address: '1 Alpine Pasture Road',
    lat: 47.4912,
    lng: 11.0959,
    desc: 'Alpine View Creamery sits at 1,100 meters above sea level in the Werdenfels region. Our cows spend summer on the high alpine pastures, grazing on nothing but fresh mountain grass. Short transport routes guarantee maximum freshness.',
    products: [
      { name: 'Mountain Cheese (6 months)', category: 'dairy', price: 16.90, unit: 'kg', stock: 20, desc: 'Classic Bavarian mountain cheese aged 6 months. Supple, mild, and nutty. Per 100g.' },
      { name: 'Mountain Cheese (12 months)', category: 'dairy', price: 19.90, unit: 'kg', stock: 15, desc: 'Aged 12-month mountain cheese with a peppery finish and small crystalline pockets. Per 100g.' },
      { name: 'Camembert Spread (Obatzda)', category: 'dairy', price: 5.90, unit: 'piece', stock: 25, desc: 'Traditional Bavarian camembert spread with butter, cream cheese, paprika, and caraway seeds. 150g.' },
      { name: 'Bavarian Camembert', category: 'dairy', price: 4.90, unit: 'piece', stock: 20, desc: 'Soft-ripened white mold cheese, creamy and rich inside. 125g whole wheel.' },
      { name: 'Alpine Herb Butter', category: 'dairy', price: 5.50, unit: 'piece', stock: 15, desc: 'Churned butter blended with fresh alpine herbs — chives, parsley, and garlic. 200g log.' },
      { name: 'Alpine Milk (1L)', category: 'dairy', price: 2.20, unit: 'piece', stock: 50, desc: 'Fresh whole milk from our high-altitude herd. Grass-fed and naturally higher in fat content.' },
      { name: 'Cheese Selection Board (4 types)', category: 'dairy', price: 24.90, unit: 'piece', stock: 8, desc: 'Curated selection of 4 Alpine cheeses from our range. Approx. 400g total. Comes with a tasting card.' },
      { name: 'Fresh Whey (500ml)', category: 'dairy', price: 1.20, unit: 'piece', stock: 30, desc: 'Fresh sweet whey, a byproduct of our cheese-making process. Mild and refreshing. 500ml bottle.' },
    ],
  },
  {
    email: 'weingut.moselblick@farmshop.com',
    ownerName: 'Karl Mosel',
    name: 'Moselblick Vineyard',
    type: 'orchard',
    organic: false,
    region: 'Rhineland-Palatinate',
    city: 'Cochem',
    address: '8 Vineyard Street',
    lat: 50.1460,
    lng: 7.1660,
    desc: 'Moselblick Vineyard on the steep slopes of the Mosel River has a 200-year history. Alongside our wines, we offer fresh grapes, freshly pressed grape juice, and homemade specialties directly from the estate.',
    products: [
      { name: 'White Grape Juice (1L)', category: 'produce', price: 4.90, unit: 'piece', stock: 40, desc: 'Freshly pressed Riesling grape juice, unfermented. Naturally sweet and aromatic. 1-liter bottle.' },
      { name: 'Red Grape Juice (1L)', category: 'produce', price: 4.90, unit: 'piece', stock: 35, desc: 'Pressed Dornfelder grape juice, deep ruby red. Sweet and full-bodied. 1-liter bottle.' },
      { name: 'Fresh White Grapes', category: 'produce', price: 5.90, unit: 'kg', stock: 30, status: 'out_of_season', desc: 'Fresh Riesling grapes from our terraced vineyards. Available September and October only.' },
      { name: 'Fresh Red Grapes', category: 'produce', price: 6.50, unit: 'kg', stock: 25, status: 'out_of_season', desc: 'Fresh Pinot Noir grapes, sweet and rich. Harvest season: September–October.' },
      { name: 'Grape Jelly', category: 'baked_goods', price: 6.90, unit: 'piece', stock: 20, desc: 'Set grape jelly made from our own Riesling grapes. Clear and jewel-like. Excellent served with cheese.' },
      { name: 'Sun-Dried Raisins', category: 'produce', price: 7.90, unit: 'piece', stock: 22, desc: 'Air-dried Riesling raisins, naturally sweet. No sulfites added. 250g resealable bag.' },
    ],
  },
  {
    email: 'demeterhof.naturpur@farmshop.com',
    ownerName: 'Rita Gruen',
    name: 'Naturpur Biodynamic Farm',
    type: 'produce',
    organic: true,
    region: 'Hesse',
    city: 'Kassel',
    address: '2 Biodynamic Way',
    lat: 51.3127,
    lng: 9.4797,
    desc: 'Naturpur Biodynamic Farm has been certified according to biodynamic principles since 1992. We follow the lunar calendar, compost exclusively with our own farm inputs, and grow old, open-pollinated heritage varieties.',
    products: [
      { name: 'Biodynamic Wheat Flour (1kg)', category: 'produce', price: 3.20, unit: 'kg', stock: 60, desc: 'Freshly stone-milled biodynamic wheat flour, type 550. Perfect for bread and pasta. 1kg bag.' },
      { name: 'Demeter Spelt Flour (1kg)', category: 'produce', price: 3.90, unit: 'kg', stock: 50, desc: 'Stone-milled whole grain spelt flour from our Demeter fields. Nutty, light, and easy to digest.' },
      { name: 'Green Lentils (500g)', category: 'produce', price: 4.50, unit: 'kg', stock: 45, desc: 'Organic Puy-style green lentils. Hold their shape when cooked. Great in soups and salads.' },
      { name: 'Dried Chickpeas (500g)', category: 'produce', price: 3.80, unit: 'kg', stock: 40, desc: 'Organic dried chickpeas. Soak overnight and cook — far better flavor than canned. 500g bag.' },
      { name: 'Sunflower Seeds (500g)', category: 'produce', price: 3.50, unit: 'kg', stock: 55, desc: 'Organic sunflower seeds, raw and hulled. Sprinkle on salads or add to granola. 500g bag.' },
      { name: 'Pumpkin Seeds (250g)', category: 'produce', price: 5.90, unit: 'kg', stock: 35, desc: 'Organic Styrian pumpkin seeds, dark green and intensely flavored. 250g resealable bag.' },
      { name: 'Golden Flaxseeds (500g)', category: 'produce', price: 3.20, unit: 'kg', stock: 50, desc: 'Organic golden flaxseeds, high in omega-3 fatty acids. Grind before use or soak overnight. 500g.' },
      { name: 'Ancient Grain Muesli (500g)', category: 'produce', price: 6.90, unit: 'piece', stock: 25, desc: 'Biodynamic muesli with spelt flakes, emmer, einkorn, and seeds. No added sugar or preservatives.' },
      { name: 'Hemp Hearts (200g)', category: 'produce', price: 5.50, unit: 'piece', stock: 20, desc: 'Hulled organic hemp seeds, rich in protein and healthy fats. Sprinkle on any dish. 200g bag.' },
      { name: 'Kamut Grain (500g)', category: 'produce', price: 5.50, unit: 'kg', stock: 15, desc: 'Ancient Khorasan wheat (Kamut) kernels. Great for grain salads or grinding into flour. 500g bag.' },
      { name: 'Red Quinoa (500g)', category: 'produce', price: 7.50, unit: 'piece', stock: 18, desc: 'Organic red quinoa, nutty and earthy. High in protein, gluten-free. Rinse before cooking. 500g.' },
    ],
  },
  {
    email: 'spargelgut.weiss@farmshop.com',
    ownerName: 'Hans-Dieter Weiss',
    name: 'Weiss Asparagus Farm',
    type: 'produce',
    organic: false,
    region: 'Brandenburg',
    city: 'Beelitz',
    address: '6 Asparagus Lane',
    lat: 52.2384,
    lng: 12.9697,
    desc: 'Weiss Asparagus Farm in Beelitz specializes in the world-famous Beelitz white asparagus. Across 40 hectares of sandy soil we grow white, green, and purple asparagus, supplemented by seasonal vegetables throughout the year.',
    products: [
      { name: 'White Asparagus (Grade A)', category: 'produce', price: 9.90, unit: 'kg', stock: 40, status: 'out_of_season', desc: 'Premium Beelitz white asparagus, hand-harvested and packed same day. 500g bundle. Season: April–June.' },
      { name: 'Green Asparagus', category: 'produce', price: 8.50, unit: 'kg', stock: 35, status: 'out_of_season', desc: 'Tender green asparagus from our sandy fields. No peeling needed. 500g bundle. Season: May–June.' },
      { name: 'Purple Asparagus', category: 'produce', price: 11.90, unit: 'kg', stock: 15, status: 'out_of_season', desc: 'Rare purple asparagus, tender and mildly sweet. Turns green when cooked. 500g bundle.' },
      { name: 'Asparagus Cream Soup (jar)', category: 'produce', price: 4.50, unit: 'piece', stock: 30, desc: 'Homemade cream of asparagus soup from our own Beelitz harvest. Ready to heat and serve. 400ml jar.' },
      { name: 'Kohlrabi', category: 'produce', price: 1.80, unit: 'piece', stock: 60, desc: 'Fresh kohlrabi in green and purple. Crispy raw and sweet when cooked.' },
      { name: 'Spring Onions (bunch)', category: 'produce', price: 1.50, unit: 'bunch', stock: 55, desc: 'Fresh spring onions with long green tops. Mild flavor, excellent in salads and stir-fries.' },
      { name: 'Early Radishes (bunch)', category: 'produce', price: 1.20, unit: 'bunch', stock: 70, desc: 'Crunchy radishes in classic red and white. 10 radishes per bunch. Fresh and peppery.' },
    ],
  },
  {
    email: 'huehnerhof.gluecklich@farmshop.com',
    ownerName: 'Andrea Glueck',
    name: 'Happy Hen Farm',
    type: 'mixed',
    organic: true,
    region: 'North Rhine-Westphalia',
    city: 'Dortmund',
    address: '5 Hen Path',
    lat: 51.5136,
    lng: 7.4653,
    desc: 'Happy Hen Farm keeps over 1,000 chickens, ducks, and turkeys on 12 hectares of outdoor range. Every animal has more than 10 square meters of outdoor space. Our farm is fully certified under the EU Organic Regulation.',
    products: [
      { name: 'Organic Free Range Eggs (10 pcs)', category: 'eggs', price: 4.90, unit: 'piece', stock: 120, desc: 'Certified organic free-range eggs, rich in omega-3 from our grass-fed hens. Grade A, collected daily.' },
      { name: 'Organic Duck Eggs (6 pcs)', category: 'eggs', price: 5.80, unit: 'piece', stock: 45, desc: 'Organic duck eggs, larger and richer than chicken eggs. Excellent for baking and frittata.' },
      { name: 'Organic Turkey Eggs (4 pcs)', category: 'eggs', price: 6.50, unit: 'piece', stock: 20, status: 'out_of_season', desc: 'Rare organic turkey eggs with an intense flavor. Large size. Seasonal availability in spring and summer.' },
      { name: 'Organic Whole Chicken (oven-ready)', category: 'meat', price: 18.90, unit: 'piece', stock: 12, desc: 'Organic whole chicken, oven-ready. Slow-grown for 81 days. Approx. 1.6–2.0 kg. Full of flavor.' },
      { name: 'Organic Chicken Breast', category: 'meat', price: 14.90, unit: 'kg', stock: 20, desc: 'Boneless organic chicken breast, 500g pack. Moist and flavorful from our slow-grown birds.' },
      { name: 'Organic Turkey Leg', category: 'meat', price: 9.90, unit: 'piece', stock: 15, desc: 'Large organic turkey leg, bone-in. Ideal for braising, smoking, or slow roasting. 600–800g.' },
      { name: 'Duck Confit (2 legs, jar)', category: 'meat', price: 12.90, unit: 'piece', stock: 10, desc: 'Slow-cooked duck legs preserved in their own fat. Classic French method. Ready in just 15 minutes.' },
      { name: 'Organic Chicken Liver', category: 'meat', price: 7.50, unit: 'kg', stock: 18, desc: 'Fresh organic chicken livers, 400g pack. Great for pate, risotto, or pan-fried with onions.' },
    ],
  },
  {
    email: 'forellenhof.bachklang@farmshop.com',
    ownerName: 'Stefan Bach',
    name: 'Bachklang Trout Farm',
    type: 'mixed',
    organic: false,
    region: 'Bavaria',
    city: 'Berchtesgaden',
    address: '2 Brook Street',
    lat: 47.6309,
    lng: 13.0022,
    desc: 'Bachklang Trout Farm is situated on a crystal-clear mountain stream in the Berchtesgaden region. In our natural ponds we raise rainbow trout, brook trout, and Arctic char using traditional mountain farming methods.',
    products: [
      { name: 'Fresh Rainbow Trout (whole)', category: 'meat', price: 12.90, unit: 'kg', stock: 25, desc: 'Fresh whole rainbow trout, gutted and ready for the pan. Approx. 350–450g per fish.' },
      { name: 'Smoked Trout Fillets', category: 'meat', price: 18.90, unit: 'kg', stock: 15, desc: 'Hot-smoked trout fillets, vacuum-packed. Rich, smoky flavor. 2 fillets per 200g pack.' },
      { name: 'Brook Trout (whole)', category: 'meat', price: 16.50, unit: 'kg', stock: 12, desc: 'Fresh brook trout from our mountain stream. Delicate flesh with a slightly nutty flavor. Gutted.' },
      { name: 'Arctic Char (whole)', category: 'meat', price: 19.90, unit: 'kg', stock: 8, desc: 'Prized Arctic char from our cold-water pools. Pink flesh, delicate and mildly sweet. Gutted and scaled.' },
      { name: 'Smoked Salmon Fillet', category: 'meat', price: 29.90, unit: 'kg', stock: 10, desc: 'Cold-smoked Atlantic salmon fillet. Velvety texture, mild smoke. 200g pre-sliced pack.' },
      { name: 'Smoked Trout Spread (150g)', category: 'meat', price: 6.90, unit: 'piece', stock: 20, desc: 'Creamy smoked trout spread with cream cheese, lemon, and dill. 150g jar. Perfect on dark rye bread.' },
      { name: 'Homemade Fish Sticks', category: 'meat', price: 9.90, unit: 'piece', stock: 18, desc: 'Handmade fish sticks from our own trout, lightly breaded. 6 per 300g pack. Oven-ready.' },
    ],
  },
]

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  console.log('Seed started')
  const payload = await getPayload({ config })

  // 1. Clear DB — call the db adapter directly to guarantee all docs are removed
  console.log('Clearing database...')
  const db = payload.db as any
  for (const collection of [
    'favorites',
    'orders',
    'reviews',
    'products',
    'farms',
    'users',
    'media',
    'product-categories',
  ]) {
    await db.deleteMany({ collection, where: {}, req: { payload } })
  }
  console.log('Database cleared')

  // 2. Admin
  await payload.create({
    collection: 'users',
    data: { name: 'Admin', email: 'admin@farmshop.com', password: ADMIN_PW, role: 'admin' },
    overrideAccess: true,
  })
  console.log('Admin created')

  // 3. Customers
  const customerDocs: any[] = []
  for (const c of CUSTOMERS) {
    const doc = await payload.create({
      collection: 'users',
      data: { name: c.name, email: c.email, password: CUSTOMER_PW, role: 'customer' },
      overrideAccess: true,
    })
    customerDocs.push(doc)
  }
  console.log(`${CUSTOMERS.length} customers created`)

  // 4. Product categories
  const categoryMap = new Map<string, string>()
  for (const cat of CATEGORIES) {
    const doc = await payload.create({
      collection: 'product-categories',
      data: { name: cat.name } as any,
      overrideAccess: true,
    })
    categoryMap.set(cat.key, doc.id as string)
  }
  console.log('Product categories created')

  // 5. Pre-download category product images
  console.log('Downloading category images (48 photos)...')
  const categoryImagePools: Record<string, string[]> = {}
  const catKeys = ['produce', 'dairy', 'meat', 'eggs', 'honey', 'baked_goods']
  const catSeeds: Record<string, number[]> = {
    produce:     [100, 101, 102, 103, 104, 105, 106, 107],
    dairy:       [110, 111, 112, 113, 114, 115, 116, 117],
    meat:        [120, 121, 122, 123, 124, 125, 126, 127],
    eggs:        [130, 131, 132, 133, 134, 135, 136, 137],
    honey:       [140, 141, 142, 143, 144, 145, 146, 147],
    baked_goods: [150, 151, 152, 153, 154, 155, 156, 157],
  }
  for (const key of catKeys) {
    categoryImagePools[key] = []
    for (const s of catSeeds[key]!) {
      const id = await fetchMedia(payload, s, `${key} product`)
      categoryImagePools[key]!.push(id)
    }
    console.log(`  ${key} images ready`)
  }

  // 6. Farms, products, reviews, orders
  const productImgCounters: Record<string, number> = {}
  for (const k of catKeys) productImgCounters[k] = 0

  for (let fi = 0; fi < FARMS.length; fi++) {
    const f = FARMS[fi]!
    console.log(`\n[${fi + 1}/20] ${f.name}`)

    // Farm cover image
    const coverImgId = await fetchMedia(payload, fi + 1, `${f.name} cover`)

    // Farm user
    const farmUser = await payload.create({
      collection: 'users',
      data: { name: f.ownerName, email: f.email, password: FARM_PW, role: 'farm' },
      overrideAccess: true,
    })

    // Farm
    const farmSlug = toSlug(f.name)
    const farm = await payload.create({
      collection: 'farms',
      data: {
        owner: farmUser.id,
        name: f.name,
        slug: farmSlug,
        description: f.desc,
        type: f.type,
        organic: f.organic,
        region: f.region,
        coverImage: coverImgId,
        location: {
          address: f.address,
          city: f.city,
          latitude: f.lat,
          longitude: f.lng,
        },
      } as any,
      overrideAccess: true,
    })

    // Products
    const productDocs: any[] = []
    for (const p of f.products) {
      const pool = categoryImagePools[p.category] ?? []
      const idx = productImgCounters[p.category]! % pool.length
      const photoId = pool[idx]
      productImgCounters[p.category] = productImgCounters[p.category]! + 1

      const product = await payload.create({
        collection: 'products',
        data: {
          farm: farm.id,
          name: p.name,
          slug: `${farmSlug}-${toSlug(p.name)}`,
          description: p.desc,
          productCategory: categoryMap.get(p.category),
          price: p.price,
          unit: p.unit,
          stock: p.stock,
          status: p.status ?? 'in_season',
          photos: photoId ? [photoId] : [],
        } as any,
        overrideAccess: true,
      })
      productDocs.push(product)
    }
    console.log(`  ${productDocs.length} products created`)

    // Reviews (3-5 per farm)
    const reviewers = pickN(customerDocs, Math.floor(Math.random() * 3) + 3)
    const reviewPool = REVIEWS[f.type]
    let reviewsCreated = 0
    for (const customer of reviewers) {
      try {
        const template = pick(reviewPool)
        const linkedProduct = Math.random() > 0.4 ? pick(productDocs) : null
        await payload.create({
          collection: 'reviews',
          data: {
            customer: customer.id,
            farm: farm.id,
            ...(linkedProduct ? { product: linkedProduct.id } : {}),
            rating: template.rating,
            title: template.title,
            comment: template.comment,
          },
          overrideAccess: true,
        })
        reviewsCreated++
      } catch (err) {
        console.warn(`  Warning: review skipped — ${(err as Error).message}`)
      }
    }
    console.log(`  ${reviewsCreated} reviews created`)

    // Orders (2-3 per farm)
    const orderCount = Math.floor(Math.random() * 2) + 2
    let ordersCreated = 0
    for (let oi = 0; oi < orderCount; oi++) {
      try {
        const customer = pick(customerDocs)
        const items = pickN(productDocs, Math.floor(Math.random() * 3) + 1).map((p: any) => ({
          product: p.id,
          quantity: Math.floor(Math.random() * 3) + 1,
        }))
        await payload.create({
          collection: 'orders',
          data: {
            customer: customer.id,
            farm: farm.id,
            items,
            total: 0,
            status: pick(ORDER_STATUSES),
          } as any,
          overrideAccess: true,
        })
        ordersCreated++
      } catch (err) {
        console.warn(`  Warning: order skipped — ${(err as Error).message}`)
      }
    }
    console.log(`  ${ordersCreated} orders created`)
  }

  console.log('\nSeed complete!')
  console.log(`20 farms | ${FARMS.reduce((s, f) => s + f.products.length, 0)} products | ${CUSTOMERS.length} customers | 1 admin`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
