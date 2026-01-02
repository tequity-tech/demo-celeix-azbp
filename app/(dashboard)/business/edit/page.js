'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Store, MapPin, Phone, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Card, CardContent, Spinner } from '@/components/ui';
import { ARIZONA_CITIES } from '@/lib/constants/arizona-cities';

const businessSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  shortDescription: z.string().max(200, 'Keep it under 200 characters').optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export default function EditBusinessPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [business, setBusiness] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(businessSchema),
  });

  useEffect(() => {
    fetchCategories();
    fetchBusiness();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBusiness = async () => {
    try {
      const res = await fetch('/api/businesses?owner=me&limit=1');
      const data = await res.json();
      if (data.businesses && data.businesses.length > 0) {
        const biz = data.businesses[0];
        setBusiness(biz);

        // Get the primary category
        const categoryRes = await fetch(`/api/categories`);
        const categoryData = await categoryRes.json();
        const allCategories = categoryData.categories || [];

        // Find the category that matches
        const primaryCategory = allCategories.find(c =>
          biz.category_names?.includes(c.name)
        );

        reset({
          name: biz.name || '',
          shortDescription: biz.short_description || '',
          description: biz.description || '',
          categoryId: primaryCategory?.id || '',
          city: biz.city || '',
          zipCode: biz.zip_code || '',
          phone: biz.phone || '',
          email: biz.email || '',
          website: biz.website || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch business:', error);
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/businesses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: business.id,
          name: data.name,
          shortDescription: data.shortDescription,
          description: data.description,
          city: data.city,
          zipCode: data.zipCode,
          phone: data.phone,
          email: data.email,
          website: data.website,
          categoryIds: [data.categoryId],
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update business');
      }

      setSuccess('Business updated successfully!');
      // Navigate back to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard?success=updated');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cityOptions = ARIZONA_CITIES.map(city => ({ value: city, label: city }));
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <Store className="w-12 h-12 text-[var(--color-neutral-400)] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[var(--color-neutral-900)] mb-2">
              No Business Found
            </h2>
            <p className="text-[var(--color-neutral-500)] mb-6">
              You haven't created a business listing yet.
            </p>
            <Link href="/business/new">
              <Button>Create Your Listing</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-[var(--color-neutral-500)] hover:text-[var(--color-primary-500)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-2">
        Edit Your Business
      </h1>
      <p className="text-[var(--color-neutral-500)] mb-8">
        Update your business information
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-primary-100)]">
                <Store className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Basic Information</h2>
                <p className="text-sm text-[var(--color-neutral-500)]">Your business details</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Business Name *"
                placeholder="Your business name"
                error={errors.name?.message}
                {...register('name')}
              />

              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
                  Category *
                </label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.categoryId ? 'border-red-500' : 'border-[var(--color-neutral-300)]'
                  } focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]`}
                  {...register('categoryId')}
                >
                  <option value="">Select a category</option>
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
                  Short Description
                </label>
                <textarea
                  placeholder="Brief description of your business (200 chars max)"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  {...register('shortDescription')}
                />
                {errors.shortDescription && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.shortDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
                  Full Description
                </label>
                <textarea
                  placeholder="Tell customers more about your business, services, history..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  {...register('description')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-accent-100)]">
                <MapPin className="w-6 h-6 text-[var(--color-accent-600)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Location</h2>
                <p className="text-sm text-[var(--color-neutral-500)]">Where is your business located?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-1.5">
                  City *
                </label>
                <select
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    errors.city ? 'border-red-500' : 'border-[var(--color-neutral-300)]'
                  } focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]`}
                  {...register('city')}
                >
                  <option value="">Select a city</option>
                  {cityOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <Input
                label="ZIP Code"
                placeholder="85001"
                {...register('zipCode')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-secondary-100)]">
                <Phone className="w-6 h-6 text-[var(--color-secondary-600)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Contact Information</h2>
                <p className="text-sm text-[var(--color-neutral-500)]">How can customers reach you?</p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Phone Number"
                placeholder="(602) 555-0123"
                leftIcon={<Phone className="w-5 h-5" />}
                {...register('phone')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="hello@yourbusiness.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Website"
                placeholder="https://yourbusiness.com"
                leftIcon={<Globe className="w-5 h-5" />}
                error={errors.website?.message}
                {...register('website')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={saving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
