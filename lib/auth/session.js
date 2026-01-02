import { nanoid } from 'nanoid';
import { cookies } from 'next/headers';
import db from '@/lib/db';

const SESSION_COOKIE_NAME = 'azbp_session';
const SESSION_DURATION_DAYS = 7;

export function generateSessionToken() {
  return nanoid(32);
}

export async function createSession(userId) {
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const id = nanoid();

  db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(id, userId, token, expiresAt.toISOString());

  return { token, expiresAt };
}

export async function setSessionCookie(token, expiresAt) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function validateSession(token) {
  const session = db.prepare(`
    SELECT s.*, u.id as user_id, u.email, u.name, u.role, u.email_verified
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token);

  if (!session) {
    return null;
  }

  return {
    sessionId: session.id,
    user: {
      id: session.user_id,
      email: session.email,
      name: session.name,
      role: session.role,
      emailVerified: Boolean(session.email_verified),
    },
  };
}

export function deleteSession(token) {
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function deleteUserSessions(userId) {
  db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
}

export async function getCurrentUser() {
  const token = await getSessionToken();
  if (!token) return null;

  const session = validateSession(token);
  return session?.user || null;
}
