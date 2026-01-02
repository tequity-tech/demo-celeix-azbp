'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Directory', href: '/directory' },
  { name: 'Categories', href: '/categories' },
  { name: 'Map', href: '/map' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-[var(--color-neutral-200)] sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)] flex items-center justify-center">
                <span className="text-white font-bold text-lg">AZ</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-[var(--color-neutral-900)]">Black Pages</span>
                <span className="text-xs text-[var(--color-primary-500)] block -mt-1">Arizona</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[var(--color-neutral-600)] hover:text-[var(--color-primary-500)] font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 rounded-lg hover:bg-[var(--color-neutral-100)] transition-colors"
            >
              <Search className="w-5 h-5 text-[var(--color-neutral-500)]" />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-[var(--color-neutral-500)] hover:text-[var(--color-neutral-700)]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    List Your Business
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--color-neutral-100)]"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            mobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-100)] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-[var(--color-neutral-200)]">
            {user ? (
              <div className="space-y-2 px-3">
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2 px-3">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button variant="primary" className="w-full">
                    List Your Business
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
