import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, Clock,
  BadgeCheck, Share2, Heart, Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';
import { Container } from '@/components/layout';
import { Button, Badge, Card, CardContent } from '@/components/ui';
import db from '@/lib/db';

// Placeholder images for businesses without uploaded images
const placeholderCovers = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
];

const placeholderLogos = [
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200&h=200&fit=crop',
];

const placeholderGallery = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
];

/**
 * Simple hash function to convert string to number
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getPlaceholderImage(array, id) {
  const index = id ? (hashString(id) % array.length) : 0;
  return array[index];
}

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

/**
 * Sanitizes a URL to prevent XSS - only allows http/https
 * Returns the URL if safe, or null if potentially dangerous
 */
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (['http:', 'https:'].includes(parsed.protocol)) {
      return url;
    }
    return null;
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

  // Get placeholder images based on business ID for consistency
  const placeholderCover = getPlaceholderImage(placeholderCovers, business.id);
  const placeholderLogo = getPlaceholderImage(placeholderLogos, business.id);

  return (
    <div className="min-h-screen bg-[var(--color-cream-100)]">
      {/* Hero/Cover Section */}
      <div className="relative h-64 md:h-80 bg-[var(--color-hero)]">
        <img
          src={coverImage?.url || placeholderCover}
          alt={business.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0">
          <Container>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors bg-black/30 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Directory
            </Link>
          </Container>
        </div>
      </div>

      <Container>
        {/* Business Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-32 h-32 rounded-xl bg-white shadow-lg border-4 border-white overflow-hidden flex items-center justify-center">
              {logoImage ? (
                <img
                  src={logoImage.url}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={placeholderLogo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
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

              <div className="flex items-center gap-2 text-[var(--color-neutral-600)]">
                <MapPin className="w-4 h-4 text-[var(--color-neutral-500)]" />
                <span>{business.city}, {business.state}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 text-[var(--color-neutral-600)]" />
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 text-[var(--color-neutral-600)]" />
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

            {/* Gallery - Show placeholder if no gallery images */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages && galleryImages.length > 0 ? (
                    galleryImages.map((image) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.alt_text || business.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))
                  ) : (
                    // Show placeholder gallery images
                    placeholderGallery.slice(0, 6).map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`${business.name} gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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
                      className="flex items-center gap-3 text-[var(--color-neutral-700)] hover:text-[var(--color-primary-500)] transition-colors"
                    >
                      <Phone className="w-5 h-5 text-[var(--color-primary-500)]" />
                      <span>{business.phone}</span>
                    </a>
                  )}
                  {business.email && (
                    <a
                      href={`mailto:${business.email}`}
                      className="flex items-center gap-3 text-[var(--color-neutral-700)] hover:text-[var(--color-primary-500)] transition-colors"
                    >
                      <Mail className="w-5 h-5 text-[var(--color-primary-500)]" />
                      <span>{business.email}</span>
                    </a>
                  )}
                  {sanitizeUrl(business.website) && (
                    <a
                      href={sanitizeUrl(business.website)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--color-neutral-700)] hover:text-[var(--color-primary-500)] transition-colors"
                    >
                      <Globe className="w-5 h-5 text-[var(--color-primary-500)]" />
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
                        const safeUrl = sanitizeUrl(social.url);
                        if (!safeUrl) return null;
                        return (
                          <a
                            key={social.id}
                            href={safeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-lg bg-[var(--color-neutral-100)] hover:bg-[var(--color-primary-100)] transition-colors"
                          >
                            <Icon className="w-5 h-5 text-[var(--color-neutral-700)]" />
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
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-[var(--color-primary-500)]" />
                    <div className="text-[var(--color-neutral-700)]">
                      {business.address_line1 && <p>{business.address_line1}</p>}
                      {business.address_line2 && <p>{business.address_line2}</p>}
                      <p>{business.city}, {business.state} {business.zip_code}</p>
                    </div>
                  </div>
                  {/* Map placeholder */}
                  <div className="mt-4 rounded-lg overflow-hidden border border-[var(--color-neutral-200)]">
                    <img
                      src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop`}
                      alt="Map location"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hours */}
            {hours && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--color-primary-500)]" />
                    Business Hours
                  </h2>
                  <div className="space-y-2 text-sm">
                    {Object.entries(hours).map(([day, time]) => (
                      <div key={day} className="flex justify-between py-1">
                        <span className="text-[var(--color-neutral-600)] capitalize font-medium">{day}</span>
                        <span className="text-[var(--color-neutral-800)]">{time || 'Closed'}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>

      {/* Bottom spacing */}
      <div className="h-12" />
    </div>
  );
}
