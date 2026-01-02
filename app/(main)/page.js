import { Hero, FeaturedBusinesses, CategoryShowcase, CTASection } from '@/components/home';
import db from '@/lib/db';

async function getCategories() {
  try {
    const categories = db.prepare(`
      SELECT
        c.*,
        (SELECT COUNT(*) FROM business_categories bc
         JOIN businesses b ON bc.business_id = b.id
         WHERE bc.category_id = c.id AND b.status = 'approved') as business_count
      FROM categories c
      ORDER BY c.display_order, c.name
    `).all();
    return categories;
  } catch {
    return [];
  }
}

async function getFeaturedBusinesses() {
  try {
    const businesses = db.prepare(`
      SELECT
        b.*,
        (SELECT GROUP_CONCAT(c.name, ', ')
         FROM business_categories bc
         JOIN categories c ON bc.category_id = c.id
         WHERE bc.business_id = b.id) as category_names,
        (SELECT url FROM business_images
         WHERE business_id = b.id AND is_logo = 1
         LIMIT 1) as logo_url
      FROM businesses b
      WHERE b.status = 'approved' AND b.is_featured = 1
      ORDER BY b.created_at DESC
      LIMIT 8
    `).all();
    return businesses;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [categories, featuredBusinesses] = await Promise.all([
    getCategories(),
    getFeaturedBusinesses(),
  ]);

  return (
    <>
      <Hero />
      <FeaturedBusinesses businesses={featuredBusinesses} />
      <CategoryShowcase categories={categories} />
      <CTASection />
    </>
  );
}
