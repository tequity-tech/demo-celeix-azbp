import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Check if running on Vercel (serverless, read-only filesystem)
const isVercel = process.env.VERCEL === '1';

// On Vercel, copy db to /tmp for write access
let dbPath;
if (isVercel) {
  const srcDb = path.join(process.cwd(), 'data', 'azbp.db');
  dbPath = '/tmp/azbp.db';

  // Copy database to /tmp if it doesn't exist or is older
  if (!fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(srcDb, dbPath);
    } catch (e) {
      console.error('Failed to copy database to /tmp:', e);
    }
  }
} else {
  dbPath = path.join(process.cwd(), 'data', 'azbp.db');

  // Ensure data directory exists (local dev only)
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

const db = new Database(dbPath, {
  readonly: false,
  fileMustExist: isVercel // On Vercel, file must exist (copied from source)
});

// Use DELETE journal mode on Vercel (WAL requires shared memory files)
// WAL mode works better for local development
if (isVercel) {
  db.pragma('journal_mode = DELETE');
} else {
  db.pragma('journal_mode = WAL');
}
db.pragma('foreign_keys = ON');

// Initialize schema if tables don't exist
const initSchema = () => {
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

    -- Analytics: Page views and events
    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL, -- 'page_view', 'business_view', 'website_click', 'phone_click', 'search'
      page_path TEXT,
      business_id TEXT REFERENCES businesses(id) ON DELETE SET NULL,
      session_id TEXT,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      referrer TEXT,
      user_agent TEXT,
      ip_hash TEXT, -- hashed for privacy
      city TEXT,
      state TEXT,
      metadata TEXT, -- JSON for additional data
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Analytics: Daily aggregates for faster queries
    CREATE TABLE IF NOT EXISTS analytics_daily (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL, -- YYYY-MM-DD
      metric TEXT NOT NULL, -- 'page_views', 'unique_visitors', 'searches', 'business_views'
      value INTEGER DEFAULT 0,
      dimension TEXT, -- optional: category, city, business_id
      dimension_value TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(date, metric, dimension, dimension_value)
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
    CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_business ON analytics_events(business_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_daily_date ON analytics_daily(date);
    CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at);
  `);

  // Create FTS virtual table if it doesn't exist
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

    // Rebuild FTS index to ensure it's in sync with content table
    db.exec(`INSERT INTO businesses_fts(businesses_fts) VALUES('rebuild');`);
  } catch (e) {
    // FTS table might already exist or rebuild failed
    console.debug('FTS setup:', e.message);
  }
};

// Initialize schema on first import
initSchema();

export default db;
