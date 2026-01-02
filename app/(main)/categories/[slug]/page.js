import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Container } from '@/components/layout';
import { BusinessCard } from '@/components/business';
import { Button } from '@/components/ui';
import db from '@/lib/db';

// Category images mapping
const categoryImages = {
  'restaurants': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
  'beauty-wellness': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop',
  'retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
  'professional-services': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=400&fit=crop',
  'health-fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=400&fit=crop',
  'automotive': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=400&fit=crop',
  'home-services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop',
  'entertainment': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=400&fit=crop',
  'education': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=400&fit=crop',
  'real-estate': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop',
  'technology': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
  'arts-culture': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1200&h=400&fit=crop',
  'food-beverage': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
  'travel-hospitality': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=400&fit=crop';

async function getCategory(slug) {
  const category = db.prepare(`
    SELECT * FROM categories WHERE slug = ?
  `).get(slug);

  return category;
}

async function getBusinesses(categoryId) {
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
    JOIN business_categories bc ON b.id = bc.business_id
    WHERE bc.category_id = ? AND b.status = 'approved'
    ORDER BY b.is_featured DESC, b.name
  `).all(categoryId);

  return businesses;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | Arizona Black Pages`,
    description: category.description || `Browse Black-owned ${category.name.toLowerCase()} businesses in Arizona`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const businesses = await getBusinesses(category.id);
  const IconComponent = Icons[category.icon] || Icons.Folder;
  const heroImage = categoryImages[slug] || defaultImage;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[var(--color-hero)] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={category.name}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-hero)] via-[var(--color-hero)]/80 to-transparent" />
        </div>

        <Container>
          <div className="relative py-16 lg:py-24">
            {/* Back Link */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Categories
            </Link>

            <div className="flex items-center gap-6">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm">
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                  {category.name}
                </h1>
                <p className="text-white/70 text-lg">
                  {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'} in this category
                </p>
              </div>
            </div>

            {category.description && (
              <p className="mt-6 text-lg text-white/70 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Businesses Grid */}
      <section className="py-12 lg:py-16 bg-[var(--color-cream-100)]">
        <Container>
          {businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businesses.map((business, index) => (
                <BusinessCard key={business.id} business={business} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--color-neutral-200)]">
              <div className="w-20 h-20 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-10 h-10 text-[var(--color-neutral-400)]" />
              </div>
              <p className="text-[var(--color-neutral-600)] mb-2">
                No businesses in this category yet.
              </p>
              <p className="text-sm text-[var(--color-neutral-400)] mb-6">
                Be the first to list your {category.name.toLowerCase()} business!
              </p>
              <Link href="/register">
                <Button variant="primary">
                  List Your Business
                </Button>
              </Link>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
