# Teamon — Personal Task Manager

## Minor Project Report

---

## 1. Abstract

Teamon is a personal task manager built with **Next.js 16.2.4** (App Router), **React 19**, **Tailwind CSS v4**, **Drizzle ORM**, **Turso (libsql/SQLite)**, and **better-auth**. It provides four distinct views on work — List, Kanban, Calendar, and Timeline — all powered by a single tasks table connected to an edge-distributed SQLite database. The application targets individual knowledge workers who need to capture, organize, and triage tasks across different perspectives without switching tools. Teamon is currently in active development with approximately 4,500+ lines of TypeScript/CSS across 48 source files.

---

## 2. Inspiration & Problem Statement

### 2.1 The Problem

Individual knowledge workers — developers, writers, designers — interact with their tasks through different lenses depending on context:

- **"What must I do today?"** → A simple ordered list
- **"Where is this stuck?"** → A kanban board showing workflow stages
- **"When is this due?"** → A calendar showing deadlines
- **"How long will this take?"** → A timeline showing duration and sequencing

Most task management tools force users into a single paradigm. Tools like Todoist excel at lists but lack visual planning. Tools like Trello are great for kanban but poor for deadlines. Tools like Linear are powerful but team-oriented and complex for personal use. Jira and bloated PM tools add too many fields, too much chrome, and feel like filling out forms rather than getting work done.

### 2.2 The Vision

Teamon was conceived as a single tool that gives the user four lenses on their work without switching contexts. The core insight: the *same* task data can be rendered differently depending on the question the user is asking. A task's title, status, priority, due date, project, and duration are all the database needs to know — the view is just a different projection of that data.

The product philosophy, documented in `PRODUCT.md`, defines success as: *"the user captures a thought and finds it again in the right view, fast. The tool should feel like an extension of their working memory, not a database they have to maintain."*

### 2.3 Brand Personality

Clean, calm, focused. The tool recedes into the task. It's confident without being loud — **Linear's precision meets Notion's warmth**. No personality injected for personality's sake. The delight is in speed, clarity, and the feeling that the tool understands what you meant.

### 2.4 Anti-References

- Jira and bloated PM tools — too many fields, too much chrome
- Over-decorated SaaS dashboards with gradient cards and hero metrics
- "Fun" productivity tools that inject gamification where none is needed
- Any interface where chrome competes with content for attention

---

## 3. Product Vision & Design Philosophy

### 3.1 Target Users

Individual knowledge workers managing their own tasks. They're in flow — coding, writing, designing — and need to capture, organize, and triage work without leaving their context. They use the tool in short bursts (checking what's next, moving a card) and longer sessions (planning, reviewing). They switch views fluidly depending on the question they need to answer.

### 3.2 Design Principles

The design system, documented in `DESIGN.md`, is governed by five principles:

1. **Speed over spectacle** — Every animation, click, and transition serves the user's flow or it doesn't exist. No decorative motion. Durations are kept to 150-200ms with ease-out easing.

2. **Consistency is the affordance** — Same button shape, same form vocabulary, same icon style across all four views. The user should predict what things do before they interact.

3. **Content first, chrome second** — The tasks are the interface. Navigation, headers, and framing exist only to get out of the way.

4. **Calm over stimulation** — Low-contrast surfaces, restrained color, no blinking or pulsing. The tool should feel restful to look at.

5. **One action, one way** — Creating a task, changing its status, assigning a project — each action has exactly one interaction pattern across all views.

### 3.3 Accessibility

- Keyboard-navigable throughout (Tab, Enter, Escape, shortcuts)
- Focus indicators visible on all interactive elements
- Respects `prefers-reduced-motion` (all animations disabled or reduced)
- Touch targets minimum 44x44px on all interactive elements
- Color is never the sole indicator of meaning (priority, status have icons + text)

---

## 4. Technology Stack Overview

### 4.1 Core Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2.4 | App Router, server components, proxy-based route protection |
| UI Library | React | 19.2.4 | Server & client components, hooks, `useActionState` |
| Language | TypeScript | ^5 | Type safety across all layers |
| Styling | Tailwind CSS | v4 | Utility-first CSS with `@theme inline` CSS-based config |
| Bundler | Turbopack | Next.js built-in | Dev server with fast HMR |
| Compiler | React Compiler | 1.0.0 | Automatic memoization (enabled in `next.config.ts`) |
| Linting | Biome | 2.2.0 | Linting + formatting (no ESLint or Prettier) |

### 4.2 Database Layer

| Technology | Version | Purpose |
|-----------|---------|---------|
| Turso (libsql) | 0.17.3 | Edge-distributed SQLite database |
| Drizzle ORM | 0.45.2 | Type-safe SQL query builder + schema definition |
| Drizzle Kit | 0.31.10 | Migration generation and push |
| `@tursodatabase/serverless` | bundled | Serverless Turso client |

### 4.3 Authentication

| Technology | Version | Purpose |
|-----------|---------|---------|
| better-auth | 1.6.9 | Full auth suite: email/password, sessions, OAuth |
| Drizzle Adapter | built-in | Maps better-auth to Drizzle schema |
| `nextCookies()` plugin | built-in | Server-side cookie-based session access |

### 4.4 UI Component Libraries

| Library | Purpose | Status |
|---------|---------|--------|
| shadcn/ui v4 (radix-nova) | 14 production UI components | Active |
| KokonutUI registry | 5 decorative components (spotlight-card, particle-button, etc.) | Installed, unused |
| Lucide React | Icon library (16px standard, 14px compact, 12px inline) | Active |
| date-fns v4 | Date manipulation | Active |
| react-day-picker v9 | Calendar date picker | Active |
| @dnd-kit | Drag-and-drop (core + sortable + utilities) | Active (Kanban), not wired for List |

### 4.5 Why This Stack?

The stack was chosen for a personal project with specific constraints:

- **Next.js 16** provides the App Router paradigm with server components, server actions, and the new proxy-based route protection. It's modern, well-supported, and offers excellent DX with Turbopack.
- **Turso/SQLite** over PostgreSQL: for a personal task manager, the zero-provisioning, zero-operations overhead of SQLite is ideal. Turso adds edge replication and a hosted endpoint, making it production-ready without DB server management.
- **Drizzle ORM** over Prisma: lighter weight, SQL-like syntax, no code generation step, excellent SQLite support, and experimental joins.
- **Tailwind v4** over CSS modules or styled-components: the new CSS-based config (`@theme inline`) removes the need for `tailwind.config.js`, making it simpler while providing the utility-first workflow.
- **better-auth** over NextAuth/Auth.js: modern, well-typed, first-class Drizzle adapter, built-in session management with cookie caching.
- **Biome** over ESLint: faster, single binary, handles both linting and formatting, React + Next.js recommended rulesets.

---

## 5. Database Design & Schema

### 5.1 Design Philosophy

The database is designed around a single core entity — the **task** — with supporting entities for auth, organization, and identity. The schema is deliberately minimal: every field serves at least one view's requirements.

### 5.2 Entity-Relationship Diagram

```
user (1) ──< (N) session
  │
  ├──< (N) account
  │
  ├──< (N) project (1) ──< (N) task
  │
  └──< (N) task

verification (standalone, no FK)
```

### 5.3 Table Definitions

#### `user` — Core Identity

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | UUID generated by better-auth |
| name | text | NOT NULL | Display name |
| email | text | NOT NULL, UNIQUE | Login identifier |
| emailVerified | integer (boolean) | NOT NULL | Whether email is confirmed |
| image | text | nullable | Avatar URL |
| createdAt | integer (timestamp) | NOT NULL | Unix epoch ms |
| updatedAt | integer (timestamp) | NOT NULL | Unix epoch ms |

#### `session` — Auth Sessions

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | UUID |
| expiresAt | integer (timestamp) | NOT NULL | Session expiry |
| token | text | NOT NULL, UNIQUE | Session token for cookie |
| ipAddress | text | nullable | Client IP on creation |
| userAgent | text | nullable | Client UA on creation |
| userId | text | FK → user.id, CASCADE | Owner |
| createdAt | integer (timestamp) | NOT NULL | |
| updatedAt | integer (timestamp) | NOT NULL | |

#### `account` — Provider Accounts

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | |
| accountId | text | NOT NULL | Provider-specific account ID |
| providerId | text | NOT NULL | e.g. "email", "google" |
| userId | text | FK → user.id, CASCADE | Owner |
| accessToken | text | nullable | OAuth access token |
| refreshToken | text | nullable | OAuth refresh token |
| idToken | text | nullable | OAuth ID token |
| accessTokenExpiresAt | integer | nullable | |
| refreshTokenExpiresAt | integer | nullable | |
| scope | text | nullable | OAuth scopes |
| password | text | nullable | Hashed password (email provider) |
| createdAt | integer | NOT NULL | |
| updatedAt | integer | NOT NULL | |

#### `verification` — Email Verification

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | |
| identifier | text | NOT NULL | Email address |
| value | text | NOT NULL | Verification code |
| expiresAt | integer (timestamp) | NOT NULL | |
| createdAt | integer | nullable | |
| updatedAt | integer | nullable | |

#### `project` — Organizational Groups

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | UUID |
| name | text | NOT NULL | Project display name |
| color | text | NOT NULL, DEFAULT '#4f46e5' | Hex color for badges/filters |
| userId | text | FK → user.id, CASCADE | Owner |
| createdAt | integer (timestamp) | NOT NULL | |
| updatedAt | integer (timestamp) | NOT NULL | |

#### `task` — Core Entity

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | text | PK | UUID (crypto.randomUUID()) |
| title | text | NOT NULL | Task name |
| description | text | nullable | Detailed notes |
| status | text | NOT NULL, DEFAULT 'backlog' | Enum: backlog, todo, in_progress, review, done, cancelled |
| priority | text | NOT NULL, DEFAULT 'medium' | Enum: low, medium, high, urgent |
| dueDate | integer (timestamp) | nullable | Calendar view deadline |
| startDate | integer (timestamp) | nullable | Timeline view start |
| durationMinutes | integer | nullable | Timeline view bar width |
| orderIndex | integer | NOT NULL, DEFAULT 0 | Custom ordering within columns |
| userId | text | FK → user.id, CASCADE | Owner |
| projectId | text | FK → project.id, SET NULL | Project grouping |
| completedAt | integer | nullable | Time of completion |
| createdAt | integer (timestamp) | NOT NULL | |
| updatedAt | integer (timestamp) | NOT NULL | |

### 5.4 Status Workflow

```
backlog → todo → in_progress → review → done
                                    ↘ cancelled
```

The six-status workflow covers the full task lifecycle from ideation (backlog) through active work (todo → in_progress) to validation (review) and resolution (done/cancelled).

### 5.5 Key Design Decisions

- **SQLite over PostgreSQL:** For a personal tool with a single user's data, SQLite's simplicity outweighs PostgreSQL's scalability. Turso provides edge distribution for low-latency reads globally.
- **Integer timestamps (epoch ms):** SQLite has no native datetime type. Using integers with `{ mode: "timestamp" }` in Drizzle gives type-safe Date objects in TypeScript while storing portable integers.
- **`SET NULL` on project delete:** Deleting a project should not cascade-delete its tasks — tasks can exist independently.
- **`CASCADE` on user delete:** When a user deletes their account, all their data is removed.
- **`orderIndex` custom sorting:** Rather than relying on creation date, explicit ordering allows drag-and-drop reordering across all views.
- **`startDate` + `durationMinutes`:** These exist solely for the Timeline/Gantt view, demonstrating the "single data source, multiple projections" philosophy.

### 5.6 Migration Strategy

Migrations are managed via Drizzle Kit with a manual two-step workflow:

1. `bun run db:generate` — Reads schema diff, generates SQL migration in `drizzle/`
2. `bun run db:migrate` — Applies pending migrations to the database

Both commands use `node --env-file=.env.local` to load environment variables (required by Turso dialect). Two migrations exist:

- **Migration 0000:** Creates auth tables (user, session, account, verification) with indexes
- **Migration 0001:** Creates project and task tables with foreign keys

---

## 6. Authentication & Authorization

### 6.1 Architecture

Teamon uses **better-auth** — a modern TypeScript authentication library — configured with Drizzle ORM adapter for SQLite, email/password provider, and `nextCookies()` plugin for server-side session access.

The auth architecture follows a three-layer pattern:

```
Client (browser)    API Route (server)    Database
      │                    │                  │
      │── signIn() ──────► │                  │
      │                    ├── verify ──────► │
      │◄── set-cookie ──── │◄── session ───── │
      │                    │                  │
      │── useSession() ──► │                  │
      │                    ├── validate ────► │
      │◄── user data ───── │◄── session ───── │
```

### 6.2 Server Configuration (`src/lib/auth.ts`)

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [nextCookies()],
  emailAndPassword: { enabled: true },
  socialProviders: { /* google: stubbed */ },
  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 days
    updateAge: 60 * 60 * 24,        // Refresh every 24h
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // 5 min cache
  },
  experimental: { joins: false },  // Avoids Drizzle crash
});
```

Key configuration details:
- **7-day session** with 24-hour sliding refresh
- **Cookie caching** (5 min TTL) reduces DB reads on every request
- **`joins: false`** — a workaround for a known Drizzle adapter crash with experimental joins enabled
- **OAuth stubbed** — Google provider configuration is commented out, ready to enable

### 6.3 Client Configuration (`src/lib/auth-client.ts`)

```typescript
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});
export const { signIn, signUp, signOut, useSession } = authClient;
```

The client uses `NEXT_PUBLIC_APP_URL` as the base URL, with four exported hooks/methods.

### 6.4 Session Helpers (`src/lib/session.ts`)

Three server-side helper functions:

| Function | Behavior |
|----------|----------|
| `getSession()` | Returns `session.user` or `null` if unauthenticated |
| `requireAuth()` | Redirects to `/sign-in` if no session |
| `requireGuest()` | Redirects to `/` if session exists (for auth pages) |

### 6.5 Route Protection (`src/proxy.ts`)

Next.js 16 introduces a `proxy.ts` convention (replacing the deprecated `middleware.ts`). The proxy:

1. Allows public paths through unauthenticated: `/sign-in`, `/sign-up`, `/api/*`, `/_next/*`, `/favicon.ico`
2. Redirects authenticated users away from `/sign-in` and `/sign-up`
3. Redirects unauthenticated users from `/` to `/sign-in`
4. Uses the `better-auth.session_token` cookie for session detection

### 6.6 API Route (`src/app/api/auth/[...all]/route.ts`)

```typescript
export const { GET, POST } = toNextJsHandler(auth);
```

A single catch-all route handling all better-auth endpoints (sign-in, sign-up, sign-out, session, etc.).

### 6.7 Data Authorization

All server actions implement ownership checks:

```typescript
const session = await getSession();
if (!session?.user?.id) throw new Error("Unauthorized");
// All queries include: eq(task.userId, session.user.id)
```

This ensures users can only read/write their own data. The pattern is enforced in all five CRUD server actions.

---

## 7. Application Architecture

### 7.1 Component Tree

```
layout.tsx (root, Geist fonts, TooltipProvider)
└── sign-in/page.tsx (server, requireGuest)
│   └── sign-in-form.tsx (client, email + password)
│
└── sign-up/page.tsx (server, requireGuest)
│   └── sign-up-form.tsx (client, name + email + password)
│
└── page.tsx (server, requireAuth, fetches data)
    └── app-shell.tsx (client, ThemeProvider, view router)
        ├── sidebar.tsx (navigation, projects, theme toggle, user menu)
        ├── top-bar.tsx (current view title)
        ├── command-palette.tsx (Cmd+K search dialog)
        ├── new-task-dialog.tsx (task creation form)
        └── active view (one of):
            ├── list-view.tsx
            ├── kanban-view.tsx
            ├── calendar-view.tsx
            └── timeline-view.tsx
```

### 7.2 Data Flow

```
1. Server component (page.tsx) fetches data:
   └── requireAuth() → get DB session
   └── db.query.tasks.findMany({ ...left join projects })
   └── Serialize Date objects → ISO strings
   └── Pass serialized data as props to AppShell

2. Client component (app-shell.tsx) receives data:
   └── Passes to active view component
   └── Each view renders based on its projection

3. User interaction triggers server action:
   └── Client calls server action (e.g., toggleTaskStatus)
   └── Action validates session, mutates DB
   └── Action calls revalidatePath("/")
   └── Server component re-renders with fresh data
   └── Client receives updated props
```

**Key architectural decision:** There is no global state store (Redux, Zustand, etc.). Data flows server → client via props. Mutations happen via server actions. Revalidation triggers a fresh server render. This is the Next.js App Router "server-centric" paradigm — the server is the source of truth.

### 7.3 Server Actions (src/lib/actions.ts)

Five server actions encapsulate all write operations:

| Action | Parameters | DB Operations | Notes |
|--------|-----------|---------------|-------|
| `createTask` | FormData (from dialog) | INSERT | Validates title required, generates UUID |
| `toggleTaskStatus` | taskId | SELECT + UPDATE | Toggles done↔todo, sets completedAt |
| `updateTaskStatus` | taskId, newStatus | SELECT + UPDATE | Direct status set, handles completedAt |
| `updateTask` | taskId, partial data | SELECT + UPDATE | Only updates provided fields |
| `deleteTask` | taskId | SELECT + DELETE | Full ownership check |

All actions:
- Validate session ownership (`eq(task.userId, session.user.id)`)
- Use `revalidatePath("/")` to trigger fresh server render
- Throw on unauthorized access or missing task

### 7.4 Type System (`src/lib/types.ts`)

Drizzle's `InferSelectModel` and `InferInsertModel` are used to derive TypeScript types from the schema:

```typescript
type Task = InferSelectModel<typeof task>;          // Raw DB type (Date objects)
type NewTask = InferInsertModel<typeof task>;         // Insert type
type Project = InferSelectModel<typeof project>;

// Serializable versions for server→client props:
type SerializableTask = {
  id: string; title: string; description: string | null;
  status: string; priority: string;
  dueDate: string | null; startDate: string | null;
  durationMinutes: number | null; orderIndex: number;
  userId: string; projectId: string | null;
  projectName: string | null; projectColor: string | null;
};
```

`SerializableTask` exists because Drizzle's `{ mode: "timestamp" }` returns `Date` objects, which cannot be passed directly from server to client components — they must be serialized to ISO strings.

---

## 8. View Architecture

The four views are the core differentiator of Teamon. Each renders the same underlying task data through a different projection. This section details the implementation of each view.

### 8.1 List View (`list-view.tsx`, 164 lines)

**Purpose:** Quick scanning and triage — "what must I do today?"

**Implementation:**
- Groups tasks into two sections: **Active** (all non-done statuses) and **Done**
- Each row displays: grip handle (for future drag-to-reorder), checkbox, title, project badge (colored), priority indicator (colored dot), and due date
- Checkbox toggle calls `toggleTaskStatus` server action with optimistic UI
- Priority colors: urgent → red, high → amber, medium → blue, low → slate

**Data projection:**
```
task.title | task.status | task.priority | task.dueDate | project.name | project.color
```

**Key UX decisions:**
- Two-section layout minimizes cognitive load — only "active" and "done"
- Priority and project shown as compact visual indicators (dots + badges)
- No inline editing — click navigates to task detail dialog

### 8.2 Kanban View (`kanban-view.tsx`, 470 lines + supporting components)

**Purpose:** Workflow visualization — "where is this stuck?"

This is the most complex view in the application.

**Implementation:**
- Five columns: Backlog → Todo → In Progress → Done → Cancelled
- Uses `@dnd-kit/core` + `@dnd-kit/sortable` for drag-and-drop
- Drag within columns for reorder, across columns for status change
- Drag overlay with `TaskCardPreview` showing the card while dragging
- Droppable columns with visual feedback (ring highlight on hover)
- Each card shows: grip handle, title, project badge, priority indicator, due date

**Sub-components:**

- **`kanban-inline-add.tsx`** (116 lines): Expandable inline form at the bottom of each column. Title input + priority selector. Enter to submit, Escape to cancel.

- **`kanban-task-dialog.tsx`** (273 lines): Full task detail/edit dialog with title, description (textarea), status, priority, project (select), and due date. Save/Cancel with change detection. Delete with confirmation flow.

**State management:**
- Parent Kanban component holds tasks in local state for instant UI updates
- Drag operations optimistically update local state
- Server action is called on drop, with rollback on error
- Kanban task dialog edits are saved optimistically to local state, then synced

**Data projection:**
```
task.title | task.status | task.priority | task.dueDate | project.name | project.color
[grouped by task.status into columns]
```

### 8.3 Calendar View (`calendar-view.tsx`, 134 lines)

**Purpose:** Deadline awareness — "when is this due?"

**Implementation:**
- Month grid using CSS Grid (7 columns for days of the week)
- Previous/next month navigation buttons
- Tasks rendered per day, filtered to those with `dueDate` in the current month
- Each task shown as a compact badge colored by its project color
- Today's date highlighted
- Empty cells before the first day of the month for alignment

**Data projection:**
```
task.title | task.dueDate | project.color
[filtered by dueDate in current month, grouped by day]
```

**Key UX decisions:**
- Only tasks with due dates appear (tasks without due dates are irrelevant to "when")
- Project color tinting provides visual grouping without text
- Month view only — no week/day drill-down (scope constraint)

### 8.4 Timeline View (`timeline-view.tsx`, 175 lines)

**Purpose:** Duration and sequencing — "how long will this take?"

This is a simplified Gantt-chart view.

**Implementation:**
- 30-day window: 14 days in the past to 16 days in the future (relative to today)
- Tasks grouped by project, with an "Unassigned" section at the end
- Each task rendered as a horizontal bar:
  - Position determined by `startDate` relative to the window start
  - Width determined by `durationMinutes` (defaults to 1 day if not set)
  - Color from project color (or neutral gray for unassigned)
  - Shows task title as a label
- Weekend columns highlighted with a subtle background tint
- Minimum 800px width with horizontal scroll for the chart area
- Column headers show dates with month transitions

**Data projection:**
```
task.title | task.startDate | task.durationMinutes | project.name | project.color
[filtered by startDate in window, grouped by project, positioned by date]
```

**Key UX decisions:**
- Start date + duration allows tasks to be placed on a continuous timeline
- Project grouping gives a "program" view — seeing all work within a project
- The 30-day window balances context (past) with planning (future)
- Tasks without start dates are excluded (irrelevant to "how long")

---

## 9. UI/UX Design System

### 9.1 Color System (OKLCH)

Teamon uses the **OKLCH** color space — modern, perceptually uniform, wide gamut. Colors are defined as CSS variables in `globals.css` using Tailwind v4's `@theme inline` directive.

**Light Mode** — Notion-like warm off-white:
| Token | Value | Usage |
|-------|-------|-------|
| background | `oklch(1 0 0)` | Page background |
| foreground | `oklch(0.28 0.01 95)` | Body text |
| primary | `oklch(0.55 0.18 255)` | Primary actions |
| muted | `oklch(0.96 0.005 95)` | Subtle backgrounds |
| border | `oklch(0.9 0.005 95)` | Borders, dividers |
| sidebar | `oklch(0.97 0.005 95)` | Sidebar background |

**Dark Mode** — Linear-like deep blacks:
| Token | Value | Usage |
|-------|-------|-------|
| background | `oklch(0.12 0 0)` | Page background |
| foreground | `oklch(0.9 0 0)` | Body text |
| primary | `oklch(0.65 0.18 255)` | Primary actions |
| muted | `oklch(0.2 0 0)` | Subtle backgrounds |
| border | `oklch(1 0 0 / 8%)` | Borders, dividers |
| sidebar | `oklch(0.1 0 0)` | Sidebar background |

**Semantic Colors (non-token):**
- Priority: Urgent → Red, High → Amber, Medium → Blue, Low → Slate
- Status: Backlog → Slate, Todo → Blue, In Progress → Amber, Done → Emerald, Cancelled → Red

### 9.2 Typography

- **Font family:** Geist Sans (headings + body), Geist Mono (shortcuts, code)
- **Scale:** Fixed rem (not fluid): `0.75rem` / `0.875rem` / `1rem` / `1.125rem`
- **Heading hierarchy:** Two levels only — view title (`text-lg font-semibold`) and section labels (`text-sm font-medium text-muted-foreground`)
- **Line height:** `1.25` for headings, `normal` for body

### 9.3 Spacing & Layout

- **Shell layout:** `flex h-screen` — sidebar (w-64, border-r) + main area (flex-1, flex-col)
- **Top bar:** `h-12` with bottom border
- **Content area:** `overflow-auto`, each view scrolls independently
- **Component spacing:** `gap-1.5` (6px) lists, `gap-2` (8px) cards
- **Section padding:** `p-5` (20px)
- **Border radius:** 8px base (`rounded-lg`), 6.4px inputs, `rounded-full` badges

### 9.4 Interactive States

Every interactive component follows a consistent state machine:
- **Default** — resting state
- **Hover** — `bg-accent` tint
- **Focus** — `ring-2 ring-ring/50`
- **Active** — `translate-y-px` press effect
- **Disabled** — `opacity-50 pointer-events-none`
- **Loading** — skeleton placeholder (not spinner)

### 9.5 Motion

- **Transition duration:** 150-200ms for UI interactions, 100ms for press effects
- **Easing:** CSS `ease-out` (default), `ease-out-quart` for meaningful transitions
- **Respects `prefers-reduced-motion`** — all animations disable
- **No orchestrated page-load sequences** — no decorative motion

### 9.6 Component Library

14 shadcn/ui components are used, all following `radix-nova` style (shadcn v4):

| Component | Lines | Key Features |
|-----------|-------|-------------|
| badge | 49 | CVA-based, 6 variants |
| button | 69 | CVA-based, 5 sizes + 3 icon sizes, exports ButtonProps |
| calendar | 228 | react-day-picker wrapper, DayButton component |
| checkbox | 31 | Radix checkbox with CheckIcon |
| dialog | 166 | Overlay, Content, Header, Footer, Title, Description |
| dropdown-menu | 272 | Full Radix dropdown suite |
| input | 19 | Styled with focus/disabled/error |
| label | 18 | Styled with peer-disabled |
| popover | 89 | Radix popover + header/footer |
| select | 194 | Full Radix select with scroll buttons |
| separator | 28 | Horizontal/vertical |
| skeleton | 13 | Pulse animation placeholder |
| textarea | 18 | field-sizing-content |
| tooltip | 57 | Provider + Content with arrow |

---

## 10. Project Structure & Configuration

### 10.1 Directory Layout

```
teamon/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/route.ts    # Auth API handler
│   │   ├── globals.css                    # Tailwind v4 + design tokens
│   │   ├── layout.tsx                     # Root layout (fonts, TooltipProvider)
│   │   ├── page.tsx                       # Main page (data fetch + AppShell)
│   │   ├── sign-in/page.tsx              # Auth page
│   │   └── sign-up/page.tsx              # Registration page
│   ├── components/
│   │   ├── app/                           # Application components
│   │   │   ├── app-shell.tsx              # Theme + view router + keyboard
│   │   │   ├── command-palette.tsx        # Custom Cmd+K dialog
│   │   │   ├── new-task-dialog.tsx        # Task creation form
│   │   │   ├── sidebar.tsx                # Navigation + projects + user menu
│   │   │   └── top-bar.tsx                # View title header
│   │   ├── auth/                          # Auth forms
│   │   ├── kokonutui/                     # 5 unused KokonutUI components
│   │   ├── ui/                            # 14 shadcn/ui components
│   │   └── views/                         # 6 view components
│   │       ├── list-view.tsx
│   │       ├── kanban-view.tsx
│   │       ├── kanban-inline-add.tsx
│   │       ├── kanban-task-dialog.tsx
│   │       ├── calendar-view.tsx
│   │       └── timeline-view.tsx
│   ├── hooks/
│   │   └── use-debounce.ts               # Debounce utility
│   └── lib/
│       ├── actions.ts                    # 5 CRUD server actions
│       ├── auth-client.ts                # better-auth client + hooks
│       ├── auth.ts                       # better-auth server config
│       ├── db.ts                         # Drizzle/Turso client
│       ├── schema.ts                     # 6 tables + relations
│       ├── session.ts                    # getSession / requireAuth / requireGuest
│       ├── types.ts                      # Task, Project, Serializable types
│       └── utils.ts                      # cn() utility
├── src/proxy.ts                          # Next.js 16 route protection
├── drizzle/                              # Migration SQL files
├── next.config.ts                        # React Compiler enabled
├── postcss.config.mjs                    # Tailwind v4 PostCSS plugin
├── drizzle.config.ts                     # Drizzle Kit (turso dialect)
├── biome.json                            # Biome 2.2.0 config
├── components.json                       # shadcn/ui + KokonutUI registry
├── tsconfig.json                         # Strict TS, @/ alias
├── package.json                          # Dependencies + scripts
├── .env.example                          # Required env vars template
├── DESIGN.md                             # Design system documentation
├── PRODUCT.md                            # Product vision & philosophy
└── AGENTS.md                             # AI agent instructions
```

### 10.2 Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | React Compiler enabled, no other custom config |
| `postcss.config.mjs` | Single `@tailwindcss/postcss` plugin |
| `tsconfig.json` | ES2017 target, bundler module resolution, `@/*` → `./src/*` |
| `biome.json` | VCS-aware, React + Next.js domains, 2-space indent |
| `components.json` | radix-nova style, RSC, lucide icons, KokonutUI registry |
| `drizzle.config.ts` | Turso dialect, reads `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` |

### 10.3 Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `TURSO_DATABASE_URL` | Yes | Turso database endpoint (libsql://...) |
| `TURSO_AUTH_TOKEN` | Yes | Turso auth token |
| `BETTER_AUTH_SECRET` | Yes | Encryption key (min 32 chars) |
| `BETTER_AUTH_URL` | Yes | Server URL (http://localhost:3000 dev) |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL for auth client redirects |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

---

## 11. Implementation Details

### 11.1 Keyboard Shortcuts

Registered in `app-shell.tsx`:

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + K | Open command palette |
| C (no modifier, not in input) | Open new task dialog |
| 1 | Switch to List view |
| 2 | Switch to Kanban view |
| 3 | Switch to Calendar view |
| 4 | Switch to Timeline view |
| Escape | Close dialogs / cancel |
| Arrow keys + Enter | Navigate command palette |

### 11.2 Command Palette

The command palette (`command-palette.tsx`) is a custom dialog (not using the installed KokonutUI `action-search-bar`). It provides:
- Auto-focused search input with real-time filtering
- Filterable commands: New Task (C), Go to List (1), Go to Kanban (2), Go to Calendar (3), Go to Timeline (4)
- Arrow key navigation with Enter to select
- ESC to close, with hint shown in header

### 11.3 New Task Dialog

The new task dialog (`new-task-dialog.tsx`) uses React 19's `useActionState` hook:
- Fields: Title (required), Description (textarea), Status (select), Priority (select), Project (select, populated from data), Due date (date input)
- On submit: calls `createTask` server action via FormData
- On success: resets form, closes dialog, list auto-updates via `revalidatePath`
- Validation: title required, thrown from server action

### 11.4 Theme Provider

Theme switching is handled via `next-themes` with `ThemeProvider` in `app-shell.tsx` (not in the root `layout.tsx`):
- Strategy: `class` (adds `dark` class to `<html>`)
- Default: `system` (respects OS preference)
- Toggle: sidebar footer theme toggle
- Persisted in localStorage

---

## 12. Known Issues & Edge Cases

### 12.1 Authentication

1. **Sign-out returns 415 without Content-Type** — `POST /api/auth/sign-out` requires `Content-Type: application/json` header. The `nextCookies()` plugin doesn't set it automatically. Workaround needed on every client request.

2. **Middleware deprecated in Next.js 16** — The old `middleware.ts` convention triggers deprecation warnings. Migration to the `proxy.ts` convention is complete but the proxy approach is still new.

3. **`experimental: { joins: true }` crashes** — Enabling Drizzle experimental joins in better-auth config causes intermittent `next-server` crashes. Currently disabled with `joins: false`. Needs investigation when better-auth or Drizzle adapter updates.

4. **`generateId: false` breaks user creation** — Disabling better-auth's ID generation causes `NOT NULL constraint failed: user.id` because SQLite text PKs need UUIDs from better-auth. Removed as fix.

### 12.2 Code Quality

1. **@dnd-kit partially wired** — Dependencies are installed and Kanban uses drag-and-drop, but List view drag-to-reorder is not implemented.

2. **No tests** — Zero test infrastructure. No vitest, Playwright, or any test framework.

3. **No CI** — No GitHub Actions, pre-commit hooks, or automation.

4. **Unused KokonutUI components** — 5 components installed but none used in the application.

5. **Import sorting issues** — Multiple files have unsorted imports (Biome auto-fixable).

6. **Type imports** — Some files import React as a value when only types are needed.

### 12.3 Dependencies

1. **better-auth 1.6.9 on Next.js 16.2.4** — Both are very new. Cookie handling and subpath exports may have compatibility issues.

2. **Turso dialect in drizzle-kit** — Requires env vars loaded manually (npm scripts use `--env-file=.env.local` workaround).

---

## 13. Future Work & Roadmap

### 13.1 Short-Term (Next)

- **Wire @dnd-kit to List view** — Enable drag-to-reorder in the list view
- **Inline editing** — Title edit on click (without opening full dialog)
- **Task search/filter** — Full-text search across titles and descriptions
- **Keyboard shortcut cheat sheet** — `?` key opens shortcut reference

### 13.2 Medium-Term

- **OAuth provider integration** — Enable Google sign-in (code stubbed, config only)
- **Test infrastructure** — vitest for unit/integration, Playwright for E2E
- **CI pipeline** — GitHub Actions with lint + typecheck + test
- **Mobile responsive sidebar** — Slide-over drawer on small screens
- **Real-time sync via Turso** — Use Turso's replication for multi-device support

### 13.3 Long-Term

- **Task recurrence** — Repeating tasks (daily, weekly, custom)
- **Drag-and-drop from List to Kanban** — Cross-view drag support
- **Timeline dependency arrows** — Task A blocks Task B visualization
- **Calendar week/day drill-down** — Expand beyond month view
- **Data export** — JSON/CSV export for backup

---

## 14. Conclusion

Teamon is a purpose-built personal task manager that demonstrates modern full-stack development with Next.js 16, React 19, and the latest tooling ecosystem. The project's key architectural insight — a single tasks table powering four distinct visual projections — shows how thoughtful data modeling enables flexible UX without complexity.

The technology choices reflect a deliberate balance: **Turso/SQLite** for operational simplicity, **Drizzle ORM** for type-safe database access, **better-auth** for modern authentication, and **Tailwind v4 + shadcn/ui** for rapid UI development. The React Compiler, Turbopack, and Biome represent the cutting edge of the Next.js ecosystem.

At approximately 4,500 lines of TypeScript and CSS across 48 source files, Teamon is a compact but complete application. It solves a real problem — the need for multiple task perspectives without tool-switching — using a stack that prioritizes developer experience, type safety, and performance.

The project is actively developed with clear priorities for future work, starting with testing infrastructure and completing drag-and-drop integration across all views.

---

*Report generated from the Teamon codebase, May 2026.*
