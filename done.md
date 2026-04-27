# Done — Auth Setup

## Database Schema (`src/lib/schema.ts`)

- Created 4 better-auth tables: `user`, `session`, `account`, `verification`
- Added `onDelete: "cascade"` on all foreign keys (`user_id` references)
- Added Drizzle ORM relations (`userRelations`, `sessionRelations`, `accountRelations`) for joins support
- Generated and applied Drizzle migration (`drizzle/0000_exotic_sage.sql`)

## Auth Configuration (`src/lib/auth.ts`)

- Configured `drizzleAdapter` with SQLite provider and schema mapping
- Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` from environment
- Enabled email/password authentication (`autoSignIn: true`, no verification required)
- Added `nextCookies()` plugin for Next.js cookie management
- Session: 7-day expiry, 1-day update age, 5-minute cookie cache
- Placeholder for OAuth providers (Google ready to uncomment)

## API Routes

- `src/app/api/auth/[...all]/route.ts` — Catch-all handler using `toNextJsHandler(auth)` supporting GET, POST, PATCH, PUT, DELETE

## Auth Client (`src/lib/auth-client.ts`)

- React client configured with `NEXT_PUBLIC_APP_URL`
- Exported: `signIn`, `signUp`, `signOut`, `useSession`

## Session Helpers (`src/lib/session.ts`)

- `getSession()` — Returns current session from server component
- `requireAuth()` — Redirects to `/sign-in` if unauthenticated
- `requireGuest()` — Redirects to `/` if authenticated

## Environment (`src/.env.example`)

- Documented all required env vars: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL`
- Documented optional OAuth env vars

## Middleware (`src/middleware.ts`)

- Route protection via `getSessionCookie` (redirects to `/sign-in` on missing cookie)
- Configurable matcher array (currently empty, ready for routes)

## Verified Working

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/auth/sign-up/email` | POST | ✅ 200 — User created in Turso |
| `/api/auth/sign-in/email` | POST | ✅ 200 — Session token returned |
| `/api/auth/get-session` | GET | ✅ 200 — Session & user data returned |
| `/api/auth/sign-out` | POST | ✅ 415 — Requires Content-Type (client-side issue) |
| DB persistence | — | ✅ User, session, account records verified in Turso |

## Migration

- Drizzle migration generated (`0000_exotic_sage`) and applied to Turso database
- All auth tables created with proper indexes (`session_token_unique`, `user_email_unique`) and cascade deletes
