'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Directory', href: '/directory' },
  { name: 'Categories', href: '/categories' },
  { name: 'Map', href: '/map' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-[var(--color-hero)] sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                AZ<span className="text-[var(--color-secondary-400)]">BP</span><span className="text-white/60">.</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white/80 hover:text-white font-medium transition-colors text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="ghost-dark" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost-dark" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" rounded>
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
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
            'lg:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
          )}
        >
          <div className="pt-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-2 px-4">
                <Link href="/dashboard" className="block">
                  <Button variant="outline-dark" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost-dark" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Link href="/login" className="block">
                  <Button variant="outline-dark" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button variant="primary" className="w-full">
                    Sign Up
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
