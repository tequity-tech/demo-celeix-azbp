import { Container } from '@/components/layout';
import { CategoryCard } from '@/components/category';
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
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--color-hero)] text-white py-16 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Browse by Category
              </h1>
              <p className="text-lg text-white/70 max-w-lg">
                Discover Black-owned businesses across Arizona organized by category.
                Find exactly what you&apos;re looking for.
              </p>
            </div>
            <div className="hidden lg:flex gap-3 justify-end">
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop"
                  alt="Restaurant"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-32 rounded-2xl overflow-hidden mt-8">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop"
                  alt="Beauty"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-32 h-32 rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop"
                  alt="Retail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Grid */}
      <section className="py-12 lg:py-16 bg-[var(--color-cream-100)]">
        <Container>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[var(--color-neutral-500)]">
                No categories available yet. Check back soon!
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
