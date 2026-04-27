# Agent Instructions — Teamon

Next.js 16.2.4 personal task manager (App Router, `src/app/`). One tasks table powers four views (List, Kanban, Calendar, Timeline).

## Commands

```bash
bun run dev        # Turbopack dev server
bun run build      # Production build
bun run lint       # Biome check (NOT ESLint)
bun run format     # Biome format --write

# Database commands REQUIRE .env.local — they hardcode --env-file=.env.local
bun run db:push    # Push schema (dev shortcut)
bun run db:generate
bun run db:migrate
bun run db:studio
```

**Do not run `drizzle-kit` directly** unless you load `.env.local` yourself; the scripts wrap it with `node --env-file=.env.local`.

## Environment

Required in `.env.local` (copied from `.env.example`):
- `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`
- `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`

Optional OAuth: uncomment in `src/lib/auth.ts` and add `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## Tech Stack Quirks

- **Lint/Format:** Biome 2.2.0 (`biome.json`). No ESLint or Prettier.
- **Tailwind v4:** CSS-based config in `src/app/globals.css` via `@theme inline`. **There is no `tailwind.config.js`.**
- **React Compiler:** Enabled in `next.config.ts`.
- **shadcn/ui:** `radix-nova` style. Registry in `components.json`. Alias `@/*` → `./src/*`.
- **KokonutUI:** Registry `@kokonutui` configured. Add via `npx shadcn@latest add @kokonutui/<name>`.
- **No test runner or tests yet.**

## Architecture

- **Entry:** `src/app/layout.tsx` (root layout, Geist fonts, TooltipProvider) → `src/app/page.tsx` (client shell: sidebar + top bar + view router + keyboard shortcuts).
- **Views:** `src/components/views/{list,kanban,calendar,timeline}-view.tsx`. Each is imported into `page.tsx`.
- **Keyboard shortcuts:** Hardcoded in `page.tsx` (`Cmd/Ctrl+K`, `C`, `1-4`).
- **ThemeProvider:** Lives in `page.tsx` (client component), not `layout.tsx`. `layout.tsx` sets `suppressHydrationWarning`.
- **Path alias:** `@/*` maps to `./src/*`.

## Database & Auth

- **DB:** Turso (libsql/SQLite) via Drizzle ORM. Client: `src/lib/db.ts`. Config: `drizzle.config.ts`.
- **Schema:** `src/lib/schema.ts` currently defines **only better-auth tables** (`user`, `session`, `account`, `verification`). **No `tasks` or `projects` tables exist yet.**
- **Auth:** `better-auth` with Drizzle adapter (`src/lib/auth.ts`). Catch-all API route: `src/app/api/auth/[...all]/route.ts`.
- **Session helpers:** `src/lib/session.ts` (`getSession`, `requireAuth`, `requireGuest`).
- **Auth client:** `src/lib/auth-client.ts` (uses `NEXT_PUBLIC_APP_URL`).

## Component Policy

1. **KokonutUI first** — `src/components/kokonutui/`
2. **shadcn/ui second** — `src/components/ui/`
3. **Custom last**

Installed KokonutUI: `spotlight-cards`, `smooth-tab`, `action-search-bar`, `particle-button`, `type-writer`.

## Style Conventions

- **Colors:** OKLCH (not HSL). Tokens in `src/app/globals.css`.
- **Light mode:** Notion-like warm off-white. **Dark mode:** Linear-like deep blacks.
- **ButtonProps:** Manually exported in `src/components/ui/button.tsx` for KokonutUI compatibility.
- **KokonutUI lint warnings:** Third-party components (e.g. `action-search-bar`, `particle-button`) may have Biome warnings. Do not fix unless broken.

## Gotchas

- Views still use **hardcoded mock data** duplicated per file. No shared data layer or DB connection yet.
- `@dnd-kit` is installed but **not wired** to Kanban or List.
- The command palette is a **custom dialog** (not KokonutUI `action-search-bar`), defined in `src/components/app/command-palette.tsx`.
- No CI, pre-commit hooks, or additional agent instruction files exist in this repo.
