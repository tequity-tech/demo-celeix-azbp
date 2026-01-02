import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'data', 'azbp.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
console.log('Initializing database schema...');
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'business_owner', 'admin')),
    email_verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Magic link tokens
  CREATE TABLE IF NOT EXISTS magic_links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Sessions table
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Categories (hierarchical)
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id TEXT REFERENCES categories(id),
    icon TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Businesses
  CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT DEFAULT 'AZ',
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    year_established INTEGER,
    employee_count TEXT,
    hours_json TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    is_verified INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'premium', 'enterprise')),
    meta_title TEXT,
    meta_description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Business to Category junction (many-to-many)
  CREATE TABLE IF NOT EXISTS business_categories (
    business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary INTEGER DEFAULT 0,
    PRIMARY KEY (business_id, category_id)
  );

  -- Business images
  CREATE TABLE IF NOT EXISTS business_images (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_logo INTEGER DEFAULT 0,
    is_cover INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Business social links
  CREATE TABLE IF NOT EXISTS business_socials (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Amenities/features
  CREATE TABLE IF NOT EXISTS amenities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT
  );

  CREATE TABLE IF NOT EXISTS business_amenities (
    business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    amenity_id TEXT NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (business_id, amenity_id)
  );

  -- Contact/Lead submissions
  CREATE TABLE IF NOT EXISTS business_inquiries (
    id TEXT PRIMARY KEY,
    business_id TEXT NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Search logs
  CREATE TABLE IF NOT EXISTS search_logs (
    id TEXT PRIMARY KEY,
    query TEXT,
    category_id TEXT,
    city TEXT,
    results_count INTEGER,
    user_id TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- Indexes for performance
  CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
  CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
  CREATE INDEX IF NOT EXISTS idx_businesses_slug ON businesses(slug);
  CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
  CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
  CREATE INDEX IF NOT EXISTS idx_business_categories_category ON business_categories(category_id);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
`);

// Create FTS virtual table
try {
  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS businesses_fts USING fts5(
      name,
      description,
      short_description,
      city,
      content='businesses',
      content_rowid='rowid'
    );
  `);
} catch (e) {
  // FTS table might already exist
}

// Categories to seed
const categories = [
  { name: 'Restaurants & Food', slug: 'restaurants', icon: 'Utensils', description: 'Dining, catering, food trucks, bakeries, and more' },
  { name: 'Beauty & Wellness', slug: 'beauty-wellness', icon: 'Sparkles', description: 'Salons, spas, barbershops, wellness centers' },
  { name: 'Professional Services', slug: 'professional-services', icon: 'Briefcase', description: 'Legal, consulting, accounting, marketing' },
  { name: 'Retail & Shopping', slug: 'retail', icon: 'ShoppingBag', description: 'Clothing, gifts, specialty shops, boutiques' },
  { name: 'Health & Medical', slug: 'health-medical', icon: 'HeartPulse', description: 'Doctors, dentists, clinics, therapists' },
  { name: 'Home Services', slug: 'home-services', icon: 'Home', description: 'Cleaning, repairs, landscaping, contractors' },
  { name: 'Automotive', slug: 'automotive', icon: 'Car', description: 'Repair shops, detailing, dealerships' },
  { name: 'Entertainment', slug: 'entertainment', icon: 'Music', description: 'Events, music, arts, recreation' },
  { name: 'Education & Training', slug: 'education', icon: 'GraduationCap', description: 'Tutoring, schools, coaching, workshops' },
  { name: 'Real Estate', slug: 'real-estate', icon: 'Building', description: 'Agents, property management, development' },
  { name: 'Financial Services', slug: 'financial', icon: 'Landmark', description: 'Banking, insurance, investments, tax prep' },
  { name: 'Technology', slug: 'technology', icon: 'Laptop', description: 'IT services, software, web development' },
  { name: 'Arts & Culture', slug: 'arts-culture', icon: 'Palette', description: 'Galleries, artists, cultural organizations' },
  { name: 'Nonprofit & Community', slug: 'nonprofit', icon: 'HeartHandshake', description: 'Charities, community organizations, advocacy' },
];

// Sample businesses
const sampleBusinesses = [
  {
    name: 'Soul Food Kitchen',
    description: 'Authentic Southern soul food with a modern twist. Family recipes passed down through generations. We serve comfort food that warms your heart and fills your soul.',
    shortDescription: 'Authentic Southern soul food with a modern twist',
    city: 'Phoenix',
    zipCode: '85003',
    lat: 33.4484,
    lng: -112.0740,
    category: 'restaurants',
    phone: '(602) 555-0123',
    email: 'hello@soulfoodkitchen.com',
    website: 'https://soulfoodkitchen.com',
    featured: true,
    verified: true,
  },
  {
    name: 'Crown & Glory Barbershop',
    description: 'Premium barbershop experience. Expert fades, beard grooming, and a welcoming atmosphere. Where kings come to be crowned.',
    shortDescription: 'Premium barbershop experience with expert fades',
    city: 'Phoenix',
    zipCode: '85004',
    lat: 33.4505,
    lng: -112.0683,
    category: 'beauty-wellness',
    phone: '(602) 555-0234',
    featured: true,
    verified: true,
  },
  {
    name: 'Heritage Law Group',
    description: 'Full-service law firm specializing in business law, real estate, and family matters. Serving the Arizona community with integrity and excellence.',
    shortDescription: 'Full-service law firm for business and family',
    city: 'Scottsdale',
    zipCode: '85251',
    lat: 33.4942,
    lng: -111.9261,
    category: 'professional-services',
    phone: '(480) 555-0345',
    email: 'info@heritagelawgroup.com',
    website: 'https://heritagelawgroup.com',
    featured: true,
  },
  {
    name: 'African Threads Boutique',
    description: 'Celebrating African fashion and culture. Unique clothing, accessories, and home decor inspired by the African diaspora.',
    shortDescription: 'African-inspired fashion and accessories',
    city: 'Tempe',
    zipCode: '85281',
    lat: 33.4255,
    lng: -111.9400,
    category: 'retail',
    phone: '(480) 555-0456',
    verified: true,
  },
  {
    name: 'Wellness Within Clinic',
    description: 'Holistic health and wellness center. Specializing in integrative medicine, mental health counseling, and preventive care.',
    shortDescription: 'Holistic health and integrative medicine',
    city: 'Chandler',
    zipCode: '85224',
    lat: 33.3062,
    lng: -111.8413,
    category: 'health-medical',
    phone: '(480) 555-0567',
    email: 'care@wellnesswithin.com',
    featured: true,
    verified: true,
  },
  {
    name: 'Elite Home Solutions',
    description: 'Professional home improvement and repair services. From small fixes to complete renovations, we do it all with quality and care.',
    shortDescription: 'Professional home improvement services',
    city: 'Mesa',
    zipCode: '85201',
    lat: 33.4152,
    lng: -111.8315,
    category: 'home-services',
    phone: '(480) 555-0678',
  },
  {
    name: 'Precision Auto Care',
    description: 'Complete auto repair and maintenance. ASE-certified mechanics, honest service, and competitive prices. Your car is in good hands.',
    shortDescription: 'Complete auto repair by ASE-certified mechanics',
    city: 'Glendale',
    zipCode: '85301',
    lat: 33.5387,
    lng: -112.1860,
    category: 'automotive',
    phone: '(623) 555-0789',
    verified: true,
  },
  {
    name: 'Rhythm & Roots Events',
    description: 'Full-service event planning and entertainment. Weddings, corporate events, concerts, and more. Making your vision a reality.',
    shortDescription: 'Full-service event planning and entertainment',
    city: 'Phoenix',
    zipCode: '85008',
    lat: 33.4533,
    lng: -112.0259,
    category: 'entertainment',
    phone: '(602) 555-0890',
    email: 'events@rhythmroots.com',
    website: 'https://rhythmroots.com',
    featured: true,
  },
  {
    name: 'Excel Learning Center',
    description: 'Academic tutoring and test preparation for students of all ages. Helping students achieve their full potential through personalized instruction.',
    shortDescription: 'Academic tutoring and test preparation',
    city: 'Gilbert',
    zipCode: '85234',
    lat: 33.3528,
    lng: -111.7890,
    category: 'education',
    phone: '(480) 555-0901',
    email: 'learn@excellearning.com',
  },
  {
    name: 'Keys to the City Realty',
    description: 'Full-service real estate agency. Helping families find their dream homes and investors build their portfolios across Arizona.',
    shortDescription: 'Full-service real estate for home and investment',
    city: 'Scottsdale',
    zipCode: '85254',
    lat: 33.5387,
    lng: -111.9261,
    category: 'real-estate',
    phone: '(480) 555-1012',
    email: 'homes@keystothecity.com',
    website: 'https://keystothecityrealty.com',
    verified: true,
  },
  {
    name: 'Prosperity Financial Group',
    description: 'Comprehensive financial planning and wealth management. Building generational wealth through smart strategies and personalized guidance.',
    shortDescription: 'Financial planning and wealth management',
    city: 'Phoenix',
    zipCode: '85012',
    lat: 33.5094,
    lng: -112.0703,
    category: 'financial',
    phone: '(602) 555-1123',
    email: 'plan@prosperityfinancial.com',
    featured: true,
  },
  {
    name: 'TechBridge Solutions',
    description: 'IT consulting and software development. Helping businesses leverage technology to grow and succeed in the digital age.',
    shortDescription: 'IT consulting and software development',
    city: 'Tempe',
    zipCode: '85281',
    lat: 33.4255,
    lng: -111.9400,
    category: 'technology',
    phone: '(480) 555-1234',
    email: 'hello@techbridge.io',
    website: 'https://techbridge.io',
    verified: true,
  },
  {
    name: 'Sankofa Art Gallery',
    description: 'Contemporary African and African-American art gallery. Showcasing emerging and established artists. Cultural events and workshops.',
    shortDescription: 'Contemporary African and African-American art',
    city: 'Phoenix',
    zipCode: '85004',
    lat: 33.4539,
    lng: -112.0739,
    category: 'arts-culture',
    phone: '(602) 555-1345',
    email: 'gallery@sankofaart.com',
    website: 'https://sankofaart.com',
    featured: true,
    verified: true,
  },
  {
    name: 'Community Uplift Foundation',
    description: 'Nonprofit organization dedicated to youth development, education equity, and community empowerment in underserved Arizona neighborhoods.',
    shortDescription: 'Youth development and community empowerment',
    city: 'Phoenix',
    zipCode: '85007',
    lat: 33.4372,
    lng: -112.0917,
    category: 'nonprofit',
    phone: '(602) 555-1456',
    email: 'info@communityuplift.org',
    website: 'https://communityuplift.org',
    verified: true,
  },
  {
    name: 'Taste of the Caribbean',
    description: 'Authentic Caribbean cuisine featuring Jamaican jerk, Trinidad doubles, and island favorites. Bringing the islands to Arizona.',
    shortDescription: 'Authentic Caribbean and Jamaican cuisine',
    city: 'Tucson',
    zipCode: '85701',
    lat: 32.2226,
    lng: -110.9747,
    category: 'restaurants',
    phone: '(520) 555-0123',
    verified: true,
  },
  {
    name: 'Natural Beauty Studio',
    description: 'Natural hair care specialists. Locs, braids, twists, and protective styles. Celebrating the beauty of natural hair.',
    shortDescription: 'Natural hair care and protective styles',
    city: 'Phoenix',
    zipCode: '85018',
    lat: 33.4887,
    lng: -111.9926,
    category: 'beauty-wellness',
    phone: '(602) 555-2345',
    featured: true,
  },
];

async function seed() {
  console.log('Starting database seed...');

  // Create admin user
  const adminId = nanoid();
  const adminPasswordHash = await bcrypt.hash('admin123', 12);

  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, password_hash, name, role, email_verified)
    VALUES (?, ?, ?, ?, 'admin', 1)
  `).run(adminId, 'admin@azbp.com', adminPasswordHash, 'Admin User');
  console.log('Created admin user: admin@azbp.com / admin123');

  // Seed categories
  console.log('Seeding categories...');
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, slug, icon, description, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const categoryMap = {};
  categories.forEach((cat, index) => {
    const id = nanoid();
    insertCategory.run(id, cat.name, cat.slug, cat.icon, cat.description, index);
    categoryMap[cat.slug] = id;
  });

  // Get category IDs from database (in case they already exist)
  const dbCategories = db.prepare('SELECT id, slug FROM categories').all();
  dbCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  console.log(`Seeded ${categories.length} categories`);

  // Seed sample businesses
  console.log('Seeding sample businesses...');
  const insertBusiness = db.prepare(`
    INSERT INTO businesses (
      id, owner_id, name, slug, description, short_description,
      email, phone, website, city, state, zip_code,
      latitude, longitude, status, is_verified, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AZ', ?, ?, ?, 'approved', ?, ?)
  `);

  const insertBusinessCategory = db.prepare(`
    INSERT OR IGNORE INTO business_categories (business_id, category_id, is_primary)
    VALUES (?, ?, 1)
  `);

  for (const biz of sampleBusinesses) {
    const id = nanoid();
    let slug = slugify(biz.name, { lower: true, strict: true });

    // Check for duplicate slug
    const existing = db.prepare('SELECT id FROM businesses WHERE slug = ?').get(slug);
    if (existing) {
      slug = `${slug}-${nanoid(6)}`;
    }

    try {
      insertBusiness.run(
        id,
        adminId,
        biz.name,
        slug,
        biz.description,
        biz.shortDescription,
        biz.email || null,
        biz.phone || null,
        biz.website || null,
        biz.city,
        biz.zipCode,
        biz.lat,
        biz.lng,
        biz.verified ? 1 : 0,
        biz.featured ? 1 : 0
      );

      // Link to category
      const categoryId = categoryMap[biz.category];
      if (categoryId) {
        insertBusinessCategory.run(id, categoryId);
      }
    } catch (err) {
      console.log(`Skipping ${biz.name}: ${err.message}`);
    }
  }

  console.log(`Seeded ${sampleBusinesses.length} businesses`);

  // Rebuild FTS index
  console.log('Rebuilding full-text search index...');
  try {
    db.exec(`
      DELETE FROM businesses_fts;
      INSERT INTO businesses_fts(rowid, name, description, short_description, city)
      SELECT rowid, name, description, short_description, city FROM businesses;
    `);
  } catch (err) {
    console.log('FTS rebuild skipped:', err.message);
  }

  console.log('Database seeding complete!');
  console.log('\nYou can now run: npm run dev');
  console.log('Login with: admin@azbp.com / admin123');
}

seed().catch(console.error);
