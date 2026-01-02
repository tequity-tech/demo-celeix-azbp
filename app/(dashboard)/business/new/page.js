'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Check, Store, MapPin, Phone, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Select, Card, CardContent, Spinner } from '@/components/ui';
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

export default function NewBusinessPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      city: '',
      zipCode: '',
      phone: '',
      email: '',
      website: '',
    },
  });

  useEffect(() => {
    fetchCategories();
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

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['name', 'shortDescription', 'categoryId'];
    if (step === 2) fieldsToValidate = ['city'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        throw new Error(result.error || 'Failed to create business');
      }

      router.push('/dashboard?success=created');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cityOptions = ARIZONA_CITIES.map(city => ({ value: city, label: city }));
  const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Location' },
    { number: 3, title: 'Contact' },
  ];

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
        List Your Business
      </h1>
      <p className="text-[var(--color-neutral-500)] mb-8">
        Create your free business listing in just a few steps
      </p>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step > s.number
                    ? 'bg-[var(--color-accent-500)] text-white'
                    : step === s.number
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--color-neutral-200)] text-[var(--color-neutral-500)]'
                }`}
              >
                {step > s.number ? <Check className="w-5 h-5" /> : s.number}
              </div>
              <span className="ml-2 text-sm font-medium text-[var(--color-neutral-600)] hidden sm:block">
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-12 sm:w-24 h-1 mx-2 bg-[var(--color-neutral-200)] rounded">
                <div
                  className={`h-full rounded transition-all ${
                    step > s.number ? 'bg-[var(--color-accent-500)] w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[var(--color-primary-100)]">
                    <Store className="w-6 h-6 text-[var(--color-primary-600)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <p className="text-sm text-[var(--color-neutral-500)]">Tell us about your business</p>
                  </div>
                </div>

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
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[var(--color-accent-100)]">
                    <MapPin className="w-6 h-6 text-[var(--color-accent-600)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Location</h2>
                    <p className="text-sm text-[var(--color-neutral-500)]">Where is your business located?</p>
                  </div>
                </div>

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
            )}

            {/* Step 3: Contact */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-[var(--color-secondary-100)]">
                    <Phone className="w-6 h-6 text-[var(--color-secondary-600)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    <p className="text-sm text-[var(--color-neutral-500)]">How can customers reach you?</p>
                  </div>
                </div>

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
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-neutral-200)]">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" loading={loading}>
                  Create Listing
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
