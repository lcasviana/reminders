# Reminders App — Task Tracker

## Status Legend

- [ ] Not started
- [~] In progress
- [x] Done

---

## Phase 1 — UI (localStorage, single-user)

### 1. Data Layer (In-Memory)

- [x] Define Zod schemas as source of truth (`src/schemas/`); infer all TS types from them
  - `reminderSchema`: id, title, notes, dueDate, flag, priority, listId, sectionId, completedAt
  - `reminderListSchema`: id, name, color, icon
  - `reminderSectionSchema`: id, listId, name
  - `smartListSchema`: enum (Today, Scheduled, All, Flagged, Completed)
- [x] Create mock/seed data (lists + sections + reminders with dates, flags, priorities)
- [x] Implement in-memory store with React Context (no formal interfaces yet)
- [x] CRUD: create, update, delete reminders
- [x] CRUD: create, rename, delete lists
- [x] CRUD: create, rename, delete sections
- [x] Persist state to `localStorage`

---

### 2. Sidebar

- [x] Smart list tiles: 2×2 grid (Today, Scheduled, All, Flagged) + Completed full-width row below
  - Colored tile backgrounds matching macOS design
  - Badge counts per smart list
- [x] "My Lists" section with list rows
  - Colored circle icon per list
  - Reminder count badge
  - Shared indicator icon (person icon)
- [x] "Add List" button at bottom
- [x] Active/selected state highlighting
- [x] Sidebar toggle

---

### 3. Main Panel — Smart List Views

- [x] `Today` view: reminders grouped by Morning / Afternoon / Tonight
- [x] `Scheduled` view: grouped by specific day labels this week (Today, Tomorrow, Mon 16 Mar…), then "Rest of [Month]", then by month (April, May…)
- [x] `All` view: grouped by list, colored list name as section header
- [x] `Flagged` view: flat list of flagged reminders
- [x] `Completed` view: grouped by relative date (Yesterday, etc.); each row shows title, list name, completion timestamp; total count shown top-right

---

### 4. Main Panel — List View

- [x] List title header (colored, bold) with completion count + Clear link
- [x] Show/Hide toggle for completed items (top-right of header)
- [ ] Toolbar icons: share, view options, `+`, search (top-right)
- [x] Collapsible sub-sections within a list
- [x] Reminder rows with:
  - [x] Checkbox (complete/incomplete toggle)
  - [x] Title text
  - [x] Due date/time (if set)
  - [x] Flag indicator
  - [x] Priority indicator (!, !!, !!!)
  - [x] Notes snippet
- [x] "No Reminders" empty state
- [x] Inline add reminder (Enter to create new row at bottom)

---

### 5. Add / Edit Reminder

- [x] Quick add via `+` button in top bar
- [x] Inline add at bottom of list
- [x] Detail panel / popover for full editing:
  - [x] Title
  - [x] Notes
  - [x] Due date + time picker
  - [x] Flag toggle
  - [x] Priority picker
  - [x] List assignment
  - [x] Section assignment

---

### 6. Search

- [x] Search bar in top-right
- [x] Filter reminders across all lists by title/notes
- [x] Highlight matching text

---

### 7. Toolbar / Top Bar

- [ ] `+` button to add reminder to current list
- [ ] Search input (right side)
- [ ] View title (e.g. "Today", list name)

---

### 8. Styling & Polish

- [ ] Match macOS dark theme colors exactly
- [ ] Sidebar tile colors (blue Today, red Scheduled, gray All, orange Flagged, gray Completed)
- [ ] Completed tile spans full width as a standalone row
- [ ] List icon color theming (colored circle per list)
- [ ] Hover and focus states throughout
- [ ] Smooth transitions on sidebar collapse
- [ ] Responsive layout (mobile via Sheet sidebar — already wired)

---

### 9. Infrastructure (Phase 1)

- [ ] Update `layout.tsx` metadata (title, description)
- [ ] Add favicon matching Reminders icon

---

## Phase 2 — Full-Stack

### 10. Architecture Setup

- [ ] Install runtime deps: `drizzle-orm`, `zod`, `effect`
- [ ] Install dev deps: `drizzle-kit`
- [ ] Extend Zod schemas with `userId` field for multi-user support
- [ ] Define repository `Context.Tag` per domain inside each repository module (`src/repositories/`)
- [ ] Implement `DrizzleReminderRepository`, `DrizzleListRepository`, `DrizzleSectionRepository` as Effect `Layer`s
- [ ] Implement `InMemoryReminderRepository`, `InMemoryListRepository` as Effect `Layer`s (dev/test)
- [ ] Implement `ReminderService`, `ListService` as Effect services consuming repository tags via Effect DI
- [ ] Set up Drizzle client singleton (`src/lib/db.ts`)

---

### 11. Database

- [ ] Define Drizzle schema (`db/schema.ts`): `users`, `reminderLists`, `reminderSections`, `reminders`
  - Relations: User → Lists → Sections → Reminders
  - Fields derived from Zod schemas (extended with `userId`)
- [ ] Configure drizzle-kit (`drizzle.config.ts`)
- [ ] Set up PostgreSQL (e.g. Neon or Supabase)
- [ ] Initial migration via `drizzle-kit generate` + `drizzle-kit migrate`

---

### 12. Authentication

- [ ] Set up NextAuth.js (`src/lib/auth.ts`)
- [ ] Auth provider(s) (e.g. Google, email/password)
- [ ] Protect all API routes — verify session before any data access
- [ ] Scope all queries to `userId` (no cross-user data leakage)

---

### 13. API Route Handlers

- [ ] Each Route Handler: validate request body with Zod → provide Effect `Layer` dependencies → run Effect program → return JSON
- [ ] `GET/POST /api/lists` — list all lists, create list
- [ ] `PATCH/DELETE /api/lists/[id]` — update, delete list
- [ ] `GET/POST /api/lists/[id]/sections` — list sections, create section
- [ ] `PATCH/DELETE /api/sections/[id]` — update, delete section
- [ ] `GET/POST /api/reminders` — list reminders (with filters), create reminder
- [ ] `PATCH/DELETE /api/reminders/[id]` — update, delete reminder

---

### 14. Frontend → API Migration

- [ ] Replace React Context in-memory store with API calls
- [ ] Add loading and error states throughout
- [ ] Optimistic updates for toggle/complete actions

---

### 15. Infrastructure (Phase 2)

- [ ] Set up route structure (`/list/[id]`, `/smart/[slug]`)
- [ ] Environment config (`.env.local`, Vercel env vars)
- [ ] Deploy to Vercel
