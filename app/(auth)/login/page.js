'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-hero)] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=1600&fit=crop"
            alt="Business community"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold">
              AZ<span className="text-[var(--color-secondary-400)]">BP</span><span className="text-white/60">.</span>
            </span>
          </Link>

          <div>
            <h2 className="text-4xl font-bold mb-4">
              Welcome back to the community
            </h2>
            <p className="text-white/70 text-lg max-w-md">
              Connect with Black-owned businesses across Arizona and manage your listing.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop"
                alt="Business"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop"
                alt="Business"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
                alt="Business"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[var(--color-cream-100)]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-[var(--color-hero)]">
                AZ<span className="text-[var(--color-secondary-500)]">BP</span><span className="text-[var(--color-neutral-400)]">.</span>
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--color-neutral-200)]">
            <h1 className="text-2xl font-bold text-[var(--color-neutral-900)] mb-2">
              Welcome back
            </h1>
            <p className="text-[var(--color-neutral-500)] mb-6">
              Sign in to manage your business listing
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-[var(--color-neutral-300)]" />
                  <span className="text-sm text-[var(--color-neutral-600)]">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-[var(--color-primary-500)] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[var(--color-neutral-500)]">Don&apos;t have an account? </span>
              <Link href="/register" className="text-[var(--color-primary-500)] font-medium hover:underline">
                Create one
              </Link>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-[var(--color-neutral-400)]">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-[var(--color-neutral-600)]">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-[var(--color-neutral-600)]">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
