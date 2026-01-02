import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, Clock,
  BadgeCheck, Star, Share2, Heart, Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import db from '@/lib/db';

async function getBusiness(slug) {
  const business = db.prepare(`
    SELECT
      b.*,
      u.name as owner_name,
      (SELECT GROUP_CONCAT(c.name, ', ')
       FROM business_categories bc
       JOIN categories c ON bc.category_id = c.id
       WHERE bc.business_id = b.id) as category_names
    FROM businesses b
    LEFT JOIN users u ON b.owner_id = u.id
    WHERE b.slug = ? AND b.status = 'approved'
  `).get(slug);

  if (!business) return null;

  // Get images
  const images = db.prepare(`
    SELECT * FROM business_images WHERE business_id = ? ORDER BY display_order
  `).all(business.id);

  // Get social links
  const socials = db.prepare(`
    SELECT * FROM business_socials WHERE business_id = ?
  `).all(business.id);

  // Get categories
  const categories = db.prepare(`
    SELECT c.* FROM categories c
    JOIN business_categories bc ON c.id = bc.category_id
    WHERE bc.business_id = ?
  `).all(business.id);

  return { ...business, images, socials, categories };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    return { title: 'Business Not Found' };
  }

  return {
    title: `${business.name} | Arizona Black Pages`,
    description: business.short_description || business.description?.slice(0, 160),
  };
}

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

function parseHours(hoursJson) {
  try {
    return JSON.parse(hoursJson);
  } catch {
    return null;
  }
}

export default async function BusinessPage({ params }) {
  const { slug } = await params;
  const business = await getBusiness(slug);

  if (!business) {
    notFound();
  }

  const hours = business.hours_json ? parseHours(business.hours_json) : null;
  const logoImage = business.images?.find(img => img.is_logo);
  const coverImage = business.images?.find(img => img.is_cover);
  const galleryImages = business.images?.filter(img => !img.is_logo && !img.is_cover);

  return (
    <div className="pb-12">
      {/* Hero/Cover Section */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-800)]">
        {coverImage && (
          <Image
            src={coverImage.url}
            alt={business.name}
            fill
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <Container className="relative h-full">
          <Link
            href="/directory"
            className="absolute top-6 left-4 sm:left-6 lg:left-8 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </Container>
      </div>

      <Container>
        {/* Business Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-32 h-32 rounded-xl bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
              {logoImage ? (
                <Image
                  src={logoImage.url}
                  alt={business.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-[var(--color-primary-500)]">
                  {business.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-4">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-[var(--color-neutral-900)]">
                  {business.name}
                </h1>
                {business.is_verified && (
                  <Badge variant="accent" className="mt-1">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    Verified
                  </Badge>
                )}
                {business.is_featured && (
                  <Badge variant="secondary" className="mt-1">
                    Featured
                  </Badge>
                )}
              </div>

              {business.category_names && (
                <p className="text-[var(--color-primary-500)] mb-2">
                  {business.category_names}
                </p>
              )}

              <div className="flex items-center gap-2 text-[var(--color-neutral-500)]">
                <MapPin className="w-4 h-4" />
                <span>{business.city}, {business.state}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">About</h2>
                <p className="text-[var(--color-neutral-600)] whitespace-pre-wrap">
                  {business.description || business.short_description || 'No description available.'}
                </p>
              </CardContent>
            </Card>

            {/* Gallery */}
            {galleryImages && galleryImages.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image.url}
                          alt={image.alt_text || business.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Contact</h2>
                <div className="space-y-4">
                  {business.phone && (
                    <a
                      href={`tel:${business.phone}`}
                      className="flex items-center gap-3 text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)]"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{business.phone}</span>
                    </a>
                  )}
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="flex items-center gap-3 text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)]"
                    >
                      <Mail className="w-5 h-5" />
                      <span>{business.email}</span>
                    </a>
                  )}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)]"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Visit Website</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                {business.socials && business.socials.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[var(--color-neutral-200)]">
                    <p className="text-sm font-medium text-[var(--color-neutral-700)] mb-3">Follow Us</p>
                    <div className="flex gap-2">
                      {business.socials.map((social) => {
                        const Icon = socialIcons[social.platform] || Globe;
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[var(--color-neutral-100)] hover:bg-[var(--color-primary-100)] transition-colors"
                          >
                            <Icon className="w-5 h-5 text-[var(--color-neutral-600)]" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location */}
            {(business.address_line1 || business.city) && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Location</h2>
                  <div className="flex items-start gap-3 text-[var(--color-neutral-600)]">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      {business.address_line1 && <p>{business.address_line1}</p>}
                      {business.address_line2 && <p>{business.address_line2}</p>}
                      <p>{business.city}, {business.state} {business.zip_code}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hours */}
            {hours && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">
                    <Clock className="w-5 h-5 inline mr-2" />
                    Business Hours
                  </h2>
                  <div className="space-y-2 text-sm">
                    {Object.entries(hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-[var(--color-neutral-600)] capitalize">{day}</span>
                        <span className="text-[var(--color-neutral-900)]">{time || 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
