import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Container } from '@/components/layout';
import { BusinessGrid } from '@/components/business';
import { Button } from '@/components/ui';
import db from '@/lib/db';

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

  return (
    <div className="py-12">
      <Container>
        {/* Back Link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Categories
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-50)]">
            <IconComponent className="w-10 h-10 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-neutral-900)]">
              {category.name}
            </h1>
            <p className="text-[var(--color-neutral-500)]">
              {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
            </p>
          </div>
        </div>

        {category.description && (
          <p className="text-lg text-[var(--color-neutral-600)] mb-8 max-w-3xl">
            {category.description}
          </p>
        )}

        {/* Businesses */}
        {businesses.length > 0 ? (
          <BusinessGrid businesses={businesses} />
        ) : (
          <div className="text-center py-16 bg-[var(--color-neutral-50)] rounded-xl">
            <p className="text-[var(--color-neutral-600)] mb-4">
              No businesses in this category yet.
            </p>
            <Link href="/register">
              <Button variant="primary">
                Be the first to list your business
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
