import { Container } from '@/components/layout';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { Users, Target, Heart, ArrowRight, MapPin, Store, Star } from 'lucide-react';

export const metadata = {
  title: 'About Us | Arizona Black Pages',
  description: 'Learn about our mission to connect communities with Black-owned businesses across Arizona.',
};

const values = [
  {
    icon: Users,
    title: 'Community First',
    description: 'We believe in the power of community. By supporting Black-owned businesses, we strengthen our neighborhoods and create lasting economic impact.',
    color: 'primary',
  },
  {
    icon: Target,
    title: 'Visibility & Access',
    description: 'We make it easy for consumers to discover and connect with Black-owned businesses, and for business owners to reach their target audience.',
    color: 'secondary',
  },
  {
    icon: Heart,
    title: 'Empowerment',
    description: 'We empower entrepreneurs with the tools and exposure they need to grow their businesses and achieve their dreams.',
    color: 'accent',
  },
];

const stats = [
  { number: '500+', label: 'Businesses Listed', icon: Store },
  { number: '14', label: 'Categories', icon: Star },
  { number: '40+', label: 'Arizona Cities', icon: MapPin },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-[var(--color-hero)] text-white py-20 lg:py-28">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Connecting Arizona with
                <span className="text-[var(--color-secondary-400)] block">Black Excellence</span>
              </h1>
              <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                Arizona Black Pages is the premier directory for Black-owned businesses in the Grand Canyon State.
                Our mission is to bridge the gap between consumers and the vibrant Black business community.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=300&fit=crop"
                    alt="Team collaboration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop"
                    alt="Business owner"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop"
                    alt="Professional"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-[var(--color-neutral-200)]">
        <Container>
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-[var(--color-primary-500)]" />
                <p className="text-3xl md:text-4xl font-bold text-[var(--color-hero)]">{stat.number}</p>
                <p className="text-[var(--color-neutral-500)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[var(--color-cream-100)]">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-neutral-900)] mb-4">What We Stand For</h2>
            <p className="text-lg text-[var(--color-neutral-600)] max-w-2xl mx-auto">
              Our core values guide everything we do as we work to uplift the Black business community in Arizona.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 card-hover"
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  value.color === 'primary' ? 'bg-[var(--color-primary-100)]' :
                  value.color === 'secondary' ? 'bg-[var(--color-secondary-100)]' : 'bg-[var(--color-accent-100)]'
                }`}>
                  <value.icon className={`w-8 h-8 ${
                    value.color === 'primary' ? 'text-[var(--color-primary-500)]' :
                    value.color === 'secondary' ? 'text-[var(--color-secondary-600)]' : 'text-[var(--color-accent-500)]'
                  }`} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-neutral-900)] mb-3">
                  {value.title}
                </h3>
                <p className="text-[var(--color-neutral-600)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--color-neutral-900)] mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-600)] leading-relaxed">
                  <p>
                    Arizona Black Pages was founded with a simple yet powerful vision: to create a comprehensive
                    platform that showcases the incredible diversity and talent of Black-owned businesses across Arizona.
                  </p>
                  <p>
                    From Phoenix to Tucson, from Scottsdale to Flagstaff, Black entrepreneurs are creating
                    innovative products, delivering exceptional services, and building thriving businesses.
                    We&apos;re here to make sure they get the recognition and support they deserve.
                  </p>
                  <p>
                    Whether you&apos;re a consumer looking to support Black-owned businesses or an entrepreneur
                    ready to grow your visibility, Arizona Black Pages is your partner in building a more
                    equitable and connected community.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&h=600&fit=crop"
                    alt="Business meeting"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-[var(--color-secondary-400)] -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-[var(--color-primary-500)] -z-10"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Team/Community Section */}
      <section className="py-20 bg-[var(--color-hero)]">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Our Community</h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Together, we&apos;re building a stronger, more connected Arizona.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=300&fit=crop"
                alt="Community member"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop"
                alt="Community member"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop"
                alt="Community member"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-square">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=300&fit=crop"
                alt="Community member"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--color-secondary-300)]">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-hero)] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-[var(--color-hero)]/70 mb-8">
              Join our growing community of businesses and supporters today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/directory">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[var(--color-hero)] text-[var(--color-hero)] hover:bg-[var(--color-hero)] hover:text-white"
                >
                  Explore Directory
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
