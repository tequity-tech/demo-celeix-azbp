import Link from 'next/link';
import { Store, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';

const benefits = [
  'Free basic listing',
  'Get discovered by local customers',
  'Manage your business profile',
  'Connect with your community',
];

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-cream-100)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=500&fit=crop"
                alt="Business owner"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-[var(--color-hero)] rounded-2xl p-6 shadow-xl max-w-[200px] hidden sm:block">
              <div className="w-12 h-12 rounded-full bg-[var(--color-secondary-400)] flex items-center justify-center mb-3">
                <Store className="w-6 h-6 text-[var(--color-hero)]" />
              </div>
              <p className="text-white font-bold">Join 500+ Businesses</p>
              <p className="text-white/60 text-sm">Growing together</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-xl bg-[var(--color-secondary-400)] -z-10" />
            <div className="absolute -bottom-4 left-1/4 w-12 h-12 rounded-lg bg-[var(--color-primary-500)] -z-10" />
          </div>

          {/* Right - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-secondary-200)] text-sm font-medium text-[var(--color-hero)] mb-6">
              <Store className="w-4 h-4" />
              <span>For Business Owners</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-neutral-900)] mb-4">
              List Your Business Today
            </h2>
            <p className="text-[var(--color-neutral-600)] text-lg mb-8">
              Join hundreds of Black-owned businesses on Arizona&apos;s premier business directory.
              Get visibility, connect with customers, and grow your business.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-accent-100)] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[var(--color-accent-500)]" />
                  </div>
                  <span className="text-[var(--color-neutral-700)]">{benefit}</span>
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button
                variant="dark"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
