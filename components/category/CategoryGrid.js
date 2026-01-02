'use client';

import { CategoryCard } from './CategoryCard';

export function CategoryGrid({ categories, variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}
