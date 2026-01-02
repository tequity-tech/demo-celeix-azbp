'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Store } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-50)] px-4 py-12">
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
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-secondary-100)]">
                <Store className="w-6 h-6 text-[var(--color-secondary-600)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-neutral-900)]">
                  List Your Business
                </h1>
                <p className="text-[var(--color-neutral-500)] text-sm">
                  Join Arizona's Black business community
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
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--color-neutral-400)] mb-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-[var(--color-neutral-600)]">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-[var(--color-neutral-600)]">Privacy Policy</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-accent-600)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-500)]"></span>
            <span>Free to list your business</span>
          </div>
        </div>
      </div>
    </div>
  );
}
