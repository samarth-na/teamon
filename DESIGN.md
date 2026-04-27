# Design System

## Design Principles
1. **Speed over spectacle** — All motion serves function (150-200ms, ease-out-quart). No decorative animations.
2. **Consistency is the affordance** — Same button vocabulary, icon style, and spacing rhythm across all views.
3. **Content first, chrome second** — Tasks are the interface. Navigation recedes.
4. **Calm over stimulation** — Low-contrast surfaces, restrained color. No blinking or pulsing.
5. **One action, one way** — Every task action has exactly one interaction pattern (card click, checkbox toggle, etc.) across all four views.

## Visual Theme

### Color Palette (OKLCH)

**Light mode** — Notion-like warm off-white (chroma 0.005–0.01 tinted toward 95 hue)
**Dark mode** — Linear-like deep blacks (chroma 0 at background, ~0.005 at card level)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | `oklch(1 0 0)` | `oklch(0.12 0 0)` | Page background |
| `foreground` | `oklch(0.28 0.01 95)` | `oklch(0.9 0 0)` | Body text |
| `primary` | `oklch(0.55 0.18 255)` | `oklch(0.65 0.18 255)` | Primary actions, selected state |
| `muted` | `oklch(0.96 0.005 95)` | `oklch(0.2 0 0)` | Subtle backgrounds |
| `muted-foreground` | `oklch(0.55 0.01 95)` | `oklch(0.55 0 0)` | Secondary text |
| `border` | `oklch(0.9 0.005 95)` | `oklch(1 0 0 / 8%)` | Borders, dividers |
| `accent` | `oklch(0.94 0.01 95)` | `oklch(0.22 0 0)` | Hover states |
| `destructive` | `oklch(0.55 0.22 25)` | `oklch(0.6 0.2 25)` | Errors, deletion |
| `sidebar` | `oklch(0.97 0.005 95)` | `oklch(0.1 0 0)` | Sidebar background |
| `card` | `oklch(1 0 0)` | `oklch(0.16 0 0)` | Card surfaces |

**Color strategy:** Restrained (tinted neutrals + one accent ≤10% surface area). Blue accent (255 hue).

### Priority colors (non-token, semantic)
- **Urgent:** Red `oklch(0.55 0.22 25)` / dark `oklch(0.6 0.2 25)`
- **High:** Amber `oklch(0.65 0.18 60)`
- **Medium:** Blue `oklch(0.55 0.18 255)`
- **Low:** Slate `oklch(0.5 0.02 260)`

### Status colors
- **Backlog:** Slate gray
- **Todo:** Blue
- **In Progress:** Amber `oklch(0.65 0.18 60)`
- **Done:** Emerald `oklch(0.55 0.15 160)`
- **Cancelled:** Red `oklch(0.5 0.1 25)`

## Typography

- **Font family:** Geist Sans (headings and body), Geist Mono (shortcuts, code)
- **Scale:** Fixed rem scale, not fluid. `text-xs` (0.75rem), `text-sm` (0.875rem), `text-base` (1rem), `text-lg` (1.125rem)
- **Heading hierarchy:** Only two levels — view title (`text-lg font-semibold`) and section labels (`text-sm font-medium text-muted-foreground`)
- **Line height:** `tight` (1.25) for headings, `normal` for body
- **Shortcuts/Captions:** `text-[10px]` or `text-xs`, font-mono for kbd elements

## Component Vocabulary

### Interactive states (every component)
- **Default** — resting state
- **Hover** — `bg-accent` tint, subtle color shift
- **Focus** — `ring-2 ring-ring/50` outline with visible contrast
- **Active** — `translate-y-px` press effect
- **Disabled** — `opacity-50 pointer-events-none`
- **Loading** — Skeleton placeholder (not spinner)

### Spacing scale
- **Gap between items:** `gap-1.5` (6px) for lists, `gap-2` (8px) for cards
- **Section padding:** `p-5` (20px)
- **Component padding:** `px-3 py-2` or `px-2.5 py-1.5`

### Border radius
- `--radius: 0.5rem` (8px base)
- Cards: `rounded-lg` (8px)
- Buttons: `rounded-lg` (8px)
- Inputs: `rounded-md` (6.4px)
- Badges: `rounded-full`

### Icons
- Library: Lucide React
- Sizing: `h-4 w-4` (16px) for UI, `h-3.5 w-3.5` for compact, `h-3 w-3` for inline
- Color: `text-muted-foreground` by default, `text-foreground` when active

## Layout

- **Shell:** `flex h-screen` — sidebar (w-64, border-r) + main (flex-1, flex-col: top-bar + content)
- **Top bar:** `h-12` with border-b, view title left, actions right
- **Content area:** `overflow-auto` — each view scrolls independently
- **Kanban:** Horizontal scroll columns (`overflow-x-auto`), fixed-width columns (w-72)
- **Calendar:** CSS Grid 7 columns
- **Timeline:** Minimum width 800px with horizontal scroll

## Motion

- **Transition duration:** 150-200ms for UI interactions, 100ms for press effects
- **Easing:** `ease-out` (CSS default) or `ease-out-quart` for meaningful transitions
- **Respects `prefers-reduced-motion`**
- **No orchestrated page-load sequences**
