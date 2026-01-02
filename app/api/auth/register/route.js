import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import db from '@/lib/db';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const userId = nanoid();

    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role, email_verified)
      VALUES (?, ?, ?, ?, 'user', 1)
    `).run(userId, email, passwordHash, name);

    // Create session and set cookie
    const { token, expiresAt } = await createSession(userId);
    await setSessionCookie(token, expiresAt);

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        name,
        role: 'user',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
