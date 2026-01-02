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
    <section className="py-16 bg-gradient-to-br from-[var(--color-accent-600)] to-[var(--color-accent-700)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-6">
              <Store className="w-4 h-4" />
              <span>For Business Owners</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              List Your Business Today
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join hundreds of Black-owned businesses on Arizona's premier business directory.
              Get visibility, connect with customers, and grow your business.
            </p>
            <Link href="/register">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          <div className="bg-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6">What You Get</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--color-secondary-400)]" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
