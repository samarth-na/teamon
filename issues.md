# Issues & Known Problems

## Auth

- **Sign-out returns 415 without Content-Type** — `POST /api/auth/sign-out` requires `Content-Type: application/json` header. The `nextCookies()` plugin doesn't set it automatically. Needs explicit header on every client request.

- **Middleware deprecated in Next.js 16** — `src/middleware.ts` triggers: *"The 'middleware' file convention is deprecated. Please use 'proxy' instead."* Needs migration to the new `proxy` convention when route protection is needed. No sign-in page exists at `/sign-in` to redirect to.

- **`experimental: { joins: true }` causes server crashes** — Drizzle ORM relations are defined but enabling experimental joins in `auth.ts` causes intermittent `next-server` crashes. Currently disabled (`joins: false`). Needs investigation when better-auth or Drizzle adapter updates.

- **`generateId: false` breaks user creation** — Setting `advanced.database.generateId: false` causes `NOT NULL constraint failed: user.id` because SQLite text PKs need UUIDs from better-auth. Removed as fix.

## Project Structure

- **No tasks/projects database tables** — `src/lib/schema.ts` only defines auth tables (`user`, `session`, `account`, `verification`). No `tasks` or `projects` schema exists.

- **Hardcoded mock data across all 4 views** — `src/components/views/{list,kanban,calendar,timeline}-view.tsx` each have their own copy of mock tasks. No shared data layer or DB connection.

- **`@dnd-kit` installed but not wired** — Package is in dependencies but neither Kanban nor List view use it.

- **No test runner or tests** — Zero test infrastructure. No vitest, playwright, or any test framework.

- **No CI or pre-commit hooks** — No GitHub Actions, husky, Biome pre-commit, or any automation.

## Code Quality

- **Unused `newTaskOpen` state** — `src/app/page.tsx:23` — `newTaskOpen` is set but never read.
- **Unused param in KokonutUI button** — `src/components/kokonutui/particle-button.tsx:75` — `e` parameter unused in `handleClick`.
- **`import * as React` should be `import type`** — `theme-provider.tsx`, `badge.tsx`, `checkbox.tsx` import React as a value but only use types.
- **Biome lint warnings in drizzle config** — `drizzle.config.ts` uses non-null assertions on `process.env`.
- **Import sorting issues** — Multiple files have unsorted imports (Biome auto-fixable).
- **Command palette is custom, not KokonutUI** — Built manually in `src/components/app/command-palette.tsx` instead of using installed `@kokonutui/action-search-bar`.
- **Package.json trailing content** — `"ignoreScripts"` and `"trustedDependencies"` fields at end of `package.json` may be non-standard.

## Dependencies

- **better-auth 1.6.9 on Next.js 16.2.4** — Very new versions. Cookie handling and subpath exports may have compatibility issues (e.g. sign-out content-type requirement, `nextCookies()` hook behavior).
- **Turso dialect in drizzle-kit** — Requires env vars loaded manually when running drizzle commands directly (npm scripts use `--env-file=.env.local` workaround).
