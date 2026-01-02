'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Store, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

const benefits = [
  'Get discovered by local customers',
  'Manage your business profile',
  'Connect with your community',
  'Free basic listing',
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
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
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--color-secondary-400)] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=1600&fit=crop"
            alt="Business owner"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-[var(--color-hero)]">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-bold">
              AZ<span className="text-[var(--color-hero)]">BP</span><span className="text-[var(--color-hero)]/60">.</span>
            </span>
          </Link>

          <div>
            <h2 className="text-4xl font-bold mb-4">
              Join 500+ businesses growing with us
            </h2>
            <p className="text-[var(--color-hero)]/70 text-lg max-w-md mb-8">
              List your business and connect with customers looking for Black-owned businesses in Arizona.
            </p>

            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-hero)] flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[var(--color-secondary-400)]" />
                  </div>
                  <span className="text-[var(--color-hero)]/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop"
                alt="Restaurant"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop"
                alt="Beauty"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop"
                alt="Retail"
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
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-secondary-100)]">
                <Store className="w-6 h-6 text-[var(--color-secondary-600)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
                  List Your Business
                </h1>
                <p className="text-[var(--color-neutral-500)] text-sm">
                  Join Arizona&apos;s Black business community
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-5 h-5" />}
                required
              />

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
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                required
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                required
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[var(--color-neutral-500)]">Already have an account? </span>
              <Link href="/login" className="text-[var(--color-primary-500)] font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--color-neutral-400)] mb-4">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-[var(--color-neutral-600)]">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-[var(--color-neutral-600)]">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
