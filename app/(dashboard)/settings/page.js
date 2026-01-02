'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Bell, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement profile update API
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement password change API
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

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
        Account Settings
      </h1>
      <p className="text-[var(--color-neutral-500)] mb-8">
        Manage your account preferences
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

      <div className="space-y-6">
        {/* Profile Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-primary-100)]">
                <User className="w-6 h-6 text-[var(--color-primary-600)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Profile</h2>
                <p className="text-sm text-[var(--color-neutral-500)]">Your personal information</p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-5 h-5" />}
              />

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-5 h-5" />}
                disabled
                className="opacity-60"
              />
              <p className="text-xs text-[var(--color-neutral-400)] -mt-2">
                Email cannot be changed
              </p>

              <div className="pt-2">
                <Button type="submit" loading={saving}>
                  Update Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-accent-100)]">
                <Lock className="w-6 h-6 text-[var(--color-accent-600)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Password</h2>
                <p className="text-sm text-[var(--color-neutral-500)]">Change your password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
                placeholder="At least 8 characters"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-5 h-5" />}
              />

              <div className="pt-2">
                <Button type="submit" loading={saving}>
                  Change Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--color-secondary-100)]">
                <Shield className="w-6 h-6 text-[var(--color-secondary-600)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-neutral-900)]">Account</h2>
                <p className="text-sm text-[var(--color-neutral-500)]">Account information</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--color-neutral-100)]">
                <span className="text-[var(--color-neutral-500)]">Account Type</span>
                <span className="text-[var(--color-neutral-900)] font-medium capitalize">
                  {user?.role?.replace('_', ' ') || 'User'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--color-neutral-100)]">
                <span className="text-[var(--color-neutral-500)]">Email Verified</span>
                <span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
