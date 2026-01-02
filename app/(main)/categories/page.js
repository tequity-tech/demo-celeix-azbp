import { Container } from '@/components/layout';
import { CategoryGrid } from '@/components/category';
import db from '@/lib/db';

export const metadata = {
  title: 'Browse Categories | Arizona Black Pages',
  description: 'Explore Black-owned businesses by category across Arizona',
};

async function getCategories() {
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
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="py-12">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-neutral-900)] mb-4">
            Browse by Category
          </h1>
          <p className="text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto">
            Discover Black-owned businesses across Arizona organized by category.
            Find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--color-neutral-500)]">
              No categories available yet. Check back soon!
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
