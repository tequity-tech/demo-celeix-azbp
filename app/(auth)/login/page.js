'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-50)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center">
              <span className="text-white font-bold text-xl">AZ</span>
            </div>
            <div className="text-left">
              <span className="font-bold text-2xl text-[var(--color-neutral-900)]">Black Pages</span>
              <span className="text-sm text-[var(--color-primary-500)] block -mt-1">Arizona</span>
            </div>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
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
              <span className="text-[var(--color-neutral-500)]">Don't have an account? </span>
              <Link href="/register" className="text-[var(--color-primary-500)] font-medium hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-sm text-[var(--color-neutral-400)]">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[var(--color-neutral-600)]">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-[var(--color-neutral-600)]">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
