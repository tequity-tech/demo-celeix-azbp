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
      <section className="bg-gradient-to-br from-[#6d4c41] via-[#5d4037] to-[#4e342e] text-white py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Connecting Arizona with
              <span className="text-[#f9d56e] block mt-2">Black Excellence</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Arizona Black Pages is the premier directory for Black-owned businesses in the Grand Canyon State.
              Our mission is to bridge the gap between consumers and the vibrant Black business community.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <Container>
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-[#a67c52]" />
                <p className="text-3xl md:text-4xl font-bold text-[#4e342e]">{stat.number}</p>
                <p className="text-neutral-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">What We Stand For</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Our core values guide everything we do as we work to uplift the Black business community in Arizona.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  value.color === 'primary' ? 'bg-[#f2e8e5]' :
                  value.color === 'secondary' ? 'bg-[#fef9e7]' : 'bg-[#d6ebe2]'
                }`}>
                  <value.icon className={`w-8 h-8 ${
                    value.color === 'primary' ? 'text-[#8b5e3c]' :
                    value.color === 'secondary' ? 'text-[#b8860b]' : 'text-[#2d6a4f]'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
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
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-neutral-900 mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-neutral-600 leading-relaxed">
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
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#a67c52] to-[#6d4c41] p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold">AZ</span>
                    </div>
                    <p className="text-2xl font-bold">Black Pages</p>
                    <p className="text-white/80">Est. 2024</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl bg-[#d4a528] -z-10"></div>
                <div className="absolute -top-4 -left-4 w-16 h-16 rounded-lg bg-[#2d6a4f] -z-10"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#2d6a4f] to-[#1e5640] text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join our growing community of businesses and supporters today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/directory">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-[#2d6a4f]"
                >
                  Explore Directory
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#d4a528] hover:bg-[#b8860b] text-white"
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
