# Reminders — CLAUDE.md

## Project

Replicating the Apple Reminders macOS app in Next.js — built as a multi-user, full-stack application following SOLID principles.

### UI Reference

**Sidebar:**

- Smart lists: 2×2 grid (Today, Scheduled, All, Flagged) + Completed as a standalone full-width row below
- "My Lists" section below, with colored circle icon, name, and count badge per list
- Lists can have a shared indicator (person icon)

**Smart list views:**

- `Today`: grouped by Morning / Afternoon / Tonight
- `Scheduled`: grouped by specific day labels this week (Today, Tomorrow, Tue 17 Mar…), then "Rest of [Month]", then by month (April, May…)
- `All`: grouped by list, with colored list name as section header
- `Flagged`: flat list
- `Completed`: grouped by relative date (Yesterday, etc.); each row shows title, list name, and completion timestamp

**List view:**

- Header: colored list name (bold), completion count, Clear link, Show/Hide toggle (top-right)
- Toolbar icons (top-right): share, view options, `+`, search
- Reminders support collapsible sub-sections within a list
- Each row: checkbox, title, due date (if set), flag, priority, notes snippet
- "No Reminders" empty state
- Completed count shown as large number in top-right corner of Completed view

---

## Stack

**Frontend**

- Next.js 16 + React 19, TypeScript (strict)
- Tailwind CSS v4, `@base-ui/react` for primitives
- `class-variance-authority`, `clsx`, `tailwind-merge` for class composition
- Hugeicons (`@hugeicons/react`) for icons
- Bun as package manager

**Backend**

- Next.js API Route Handlers (under `src/app/api/`)
- PostgreSQL via Drizzle ORM; `drizzle-kit` (dev) for migrations
- Zod for runtime validation and type inference (input, API boundaries, DB results)
- Effect for typed error handling, async flows, and service/dependency composition
- Authentication via NextAuth.js

---

## Architecture

This project follows SOLID principles with a layered backend architecture:

```
Request → Route Handler (Zod) → Effect Service → Repository (Effect) → Drizzle → PostgreSQL
```

- **Route Handlers** (`src/app/api/`): HTTP boundary only — validate input with Zod, run Effect program, return response.
- **Services** (`src/services/`): Business logic modeled as Effect services (`Context.Tag`). Depend on repository tags via Effect's dependency injection, not concrete implementations.
- **Repositories** (`src/repositories/`): Data access only, implemented as Effect services (`Context.Tag` + `Layer`). One tag + one Drizzle `Layer` implementation per domain.
- **Zod schemas** (`src/schemas/`): Runtime validation at all boundaries (API input, API output, DB results). TypeScript types are inferred from schemas — never duplicated.
- **Effect**: Replaces try/catch and Promise chains. All async operations return `Effect<A, E, R>` — errors and dependencies are tracked in the type signature.

**SOLID applied:**

- **S** — Each layer has one responsibility (Route Handler ≠ Service ≠ Repository)
- **O** — Services depend on repository tags; swap `Layer` implementations without changing business logic
- **L** — Repository layers are substitutable (e.g. `DrizzleReminderLayer` ↔ `InMemoryReminderLayer` for tests)
- **I** — Narrow `Context.Tag` per domain (`ReminderRepository`, `ListRepository`, etc.)
- **D** — Effect's `Layer` system provides repository implementations to services at the composition root (Route Handler)

---

## File Structure

```
src/
  app/
    api/                    # Route Handlers (HTTP boundary)
      reminders/
      lists/
      auth/
    (app)/                  # Next.js route group for app pages
  components/ui/            # Generic, reusable primitives (shadcn-style)
  context/                  # React Context providers + hooks (client state only, Phase 1)
  features/                 # Domain-grouped feature components
    reminders/              # ReminderRow, ReminderDetail, etc.
    sidebar/                # SidebarTile, ListRow, etc.
    toolbar/                # TopBar, SearchInput, etc.
  repositories/             # Data access layer (Phase 2: Effect Context.Tag + Layer)
    drizzle/                # DrizzleReminderRepository Layer, etc.
    in-memory/              # InMemoryReminderRepository Layer (dev/test)
  services/                 # Business logic layer (Phase 2: Effect Context.Tag + Layer)
    reminder.service.ts
    list.service.ts
  schemas/                  # Zod schemas — single source of truth for all types
    reminder.schema.ts
    list.schema.ts
  hooks/                    # Shared client hooks
  lib/                      # Utilities, Drizzle client singleton, auth config
db/
  schema.ts                 # Drizzle schema definition
  migrations/               # drizzle-kit generated migrations
```

> **Note:** There is no separate `src/types/` directory. All TypeScript types are derived via `z.infer<typeof schema>` from `src/schemas/` and re-exported from there.

---

## Conventions

**General**

- All TypeScript types are inferred from Zod schemas (`z.infer<typeof schema>`); never define types manually for data shapes.
- Use `import type` for all type-only imports (enforced by ESLint).
- Import order (enforced by Prettier): `react` → `next` → third-party → `@/` → relative.
- Use `@/` alias for all internal imports.

**Frontend**

- RSC by default; mark interactive components `"use client"` at the leaf level.
- Client-side state (selected list, UI state) lives in React Context (`src/context/`).
- Server state is fetched via RSC or Route Handlers — do not duplicate server data in Context.

**Backend**

- Route Handlers are thin: validate input with Zod → run Effect program → return JSON.
- Services contain all business logic; must not import Drizzle directly.
- Repositories must not contain business logic; all DB access goes through Drizzle.
- All async operations return `Effect<A, E, R>` — no raw Promises or try/catch in services or repositories.
- Repository interfaces are defined as `Context.Tag` inside the repository module — no separate interface files.
- Use Drizzle client as a singleton (`src/lib/db.ts`).
- All authenticated routes must verify session via NextAuth before processing.

---

## Tooling

- Lint: `bun run lint:check` / `bun run lint:write`
- Format: `bun run prettier:check` / `bun run prettier:write`
- Dev: `bun run dev`
