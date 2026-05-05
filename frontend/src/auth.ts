import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password:   { label: 'Password',          type: 'password' },
      },
      async authorize(credentials, request) {
        // ── Rate limit per IP ─────────────────────────────────────────────
        const ip =
          request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
          request.headers.get('x-real-ip') ??
          '127.0.0.1';

        if (checkRateLimit(ip).blocked) return null;

        const identifier = (credentials?.identifier as string | undefined)?.trim();
        const password   = credentials?.password as string | undefined;

        if (!identifier || !password) return null;

        // ── Delegate to Strapi's auth endpoint ────────────────────────────
        try {
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ identifier, password }),
          });

          if (!res.ok) return null;

          const data = await res.json();
          if (!data.jwt || !data.user) return null;

          resetRateLimit(ip);

          return {
            id:          String(data.user.id),
            name:        data.user.username ?? identifier,
            email:       data.user.email,
            strapiToken: data.jwt,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: { signIn: '/admin/login' },

  session: {
    strategy: 'jwt',
    maxAge:   8 * 60 * 60, // 8 hours
  },

  cookies: {
    sessionToken: {
      name: 'admin-session',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path:     '/',
        secure:   process.env.NODE_ENV === 'production',
      },
    },
  },

  callbacks: {
    // Persist strapiToken inside the encrypted JWT cookie
    jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.name        = user.name;
        token.email       = user.email;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.strapiToken = (user as any).strapiToken;
      }
      return token;
    },
    // Expose strapiToken on the session object for API routes
    session({ session, token }) {
      if (session.user) {
        session.user.id    = token.id as string;
        session.user.name  = token.name as string;
        session.user.email = token.email as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).strapiToken = token.strapiToken;
      }
      return session;
    },
  },
});
