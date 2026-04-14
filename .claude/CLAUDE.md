# CLAUDE.md

This file provides guidance to Claude Code agents working in the Moonshot frontend repository.

## What is Moonshot

Moonshot is a Splitwise-style expense-splitting web app. Full feature and page design is documented in `DESIGN_PLAN.md` at the repo root.

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI Library | Material-UI (MUI) v9 |
| Global/UI state | Zustand |
| Server state | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Routing | React Router v7 (v6-compat API) |
| Charts | Recharts |
| Testing (unit) | Vitest |
| Testing (e2e) | Playwright |

## Running the App

```bash
npm install          # install dependencies
npm run dev          # start dev server (Vite, localhost:5173)
npm run build        # production build → dist/
npm run test         # run Vitest unit tests
npm run test:e2e     # run Playwright e2e tests
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
```

## Repo Structure

```
src/
├── types/api.ts          # All shared TypeScript interfaces — single source of truth
├── auth/                 # AuthProvider + useAuth hook
├── api/                  # Pure async fetch functions (no React hooks)
│   └── queryKeys.ts      # React Query key factory — ALL query keys defined here
├── store/                # Zustand stores — UI state ONLY (modals, active selections)
├── hooks/                # React Query hooks wrapping api/ functions
├── components/
│   ├── layout/           # AppShell, Sidebar, TopBar
│   ├── expenses/         # ExpenseCard, AddExpenseModal, SplitSelector
│   ├── groups/           # GroupCard, MemberList
│   ├── friends/          # FriendRow, SettleUpModal
│   ├── common/           # BalanceBadge, Avatar, EmptyState, LoadingSpinner
│   ├── styled.ts         # MUI layout primitives (PageRoot, FlexSpacer, EmptyStateBox…)
│   └── DataTable.tsx     # Generic sortable/selectable table
├── pages/                # One file per route
├── utils/                # Pure functions: currency.ts, splitting.ts, dates.ts
├── constants/            # categories.ts (expense categories + icons)
└── theme/                # MUI theme: palette, typography
```

## Borrowing from Physician Advisory Frontend

Several files should be adapted (not rewritten from scratch) from the existing frontend at `/Users/jaia1188/physician-advisory-4-week-skunkworks-frontend`. See `TASKS.md` for the full list with `[PA]` annotations. Key borrowings:

| Moonshot file | Source | Change needed |
|---|---|---|
| `vite.config.ts` | PA `vite.config.ts` | Copy test block as-is |
| `tsconfig.json` | PA `tsconfig.json` | Copy as-is |
| `src/theme/theme.ts` | PA `src/theme.ts` | Update brand color; keep badge/custom palette shape |
| `src/components/styled.ts` | PA `src/components/styled.ts` | Copy as-is |
| `src/components/DataTable.tsx` | PA `src/components/DataTable.tsx` | Copy as-is |
| `src/api/client.ts` | PA `src/api/client.ts` | Swap MSAL `acquireTokenSilent` → Firebase `user.getIdToken()` |
| `src/components/layout/AppShell.tsx` | PA `src/components/Layout.tsx` | Swap logo/nav links; remove Azure-specific menu items |
| `Dockerfile` | PA `Dockerfile` | Copy; update env var placeholder names |
| `nginx.conf` | PA `nginx.conf` | Copy as-is |
| `docker-entrypoint.sh` | PA `docker-entrypoint.sh` | Copy; update placeholder names |

**Do not** copy anything from `src/auth/` (Azure AD), `src/components/case-review/`, or `src/utils/clinical.ts` — these are healthcare-specific.

## Coding Conventions

- **TypeScript strict mode** — no `any`. Use concrete types or interfaces.
- All shared data types live in `src/types/api.ts`. Add new types there; never inline type definitions in components.
- **Server state belongs in React Query**, not Zustand. Zustand is only for UI state (modal open/close, active group id, etc.).
- `src/api/` files export plain async functions (no hooks, no React imports). `src/hooks/` wraps them with `useQuery` / `useMutation`.
- Components must be typed with explicit props interfaces — no inline `{ prop: type }` in function signatures.
- Use MUI `sx` prop for component-level styles. Do not use inline `style={}`.
- Splitting logic (equal, exact, percent, shares) lives exclusively in `src/utils/splitting.ts` as pure functions — no splitting math inside components.
- Currency formatting goes through `src/utils/currency.ts` — never format money inline.
- No `console.log` left in committed code.
- **Always add an axios response interceptor** for 401/403 in `src/api/client.ts` — redirect to `/login` on 401, show error toast on 403. The physician advisory frontend has no error handling; do not replicate that gap.
- All React Query hooks must use a key factory from `src/api/queryKeys.ts`. Never hardcode query key strings inline.
- `src/components/styled.ts` exports reusable MUI layout primitives (PageRoot, FlexSpacer, EmptyStateBox, DetailRow). Use these before reaching for custom `sx` layouts.
- **MUI v9 uses `slotProps` instead of the deprecated `*Props` pattern** (e.g. `slotProps={{ primary: { sx: {...} } }}` instead of `primaryTypographyProps`). Always use `slotProps`.
- **Do not use `styled()` on MUI components that need the `component` prop** (e.g. `ListItemButton`). The `styled()` HOC strips the polymorphic `component` type in MUI v9. Use `sx` prop instead.

## Keeping Files Current

After every change — feature, fix, refactor, or structural decision — agents must update all files that are affected. No file should be left stale.

| File | Update when… |
|---|---|
| `TASKS.md` | A task is started (`[ ]` → `[~]`), completed (`[~]` → `[x]`), added, or broken into subtasks |
| `DESIGN_PLAN.md` | Repo structure changes (new file/folder added or removed), a page design is revised, a tech stack decision changes |
| `.claude/CLAUDE.md` | A new coding convention is established, a borrowing source is added/removed, a new pattern is agreed upon |
| `README.md` | A new route, feature, or environment variable is added; setup steps change |

**Rules:**
- Do not defer doc updates to a separate task. Update in the same agent run as the code change.
- If a task is split into subtasks during implementation, add the subtasks to `TASKS.md` before starting them.
- If a structural decision made during implementation differs from `DESIGN_PLAN.md`, update `DESIGN_PLAN.md` to reflect what was actually built — not what was originally planned.
- If a new convention is discovered or agreed upon during implementation, add it to `CLAUDE.md` immediately.

## Agent Usage

**IMPORTANT: Never directly execute development tasks (writing code, running tests, debugging, refactoring) in the main conversation.** All such work must be routed through the **orchestrator agent**.

For any new feature, bug fix, debugging, or refactor — delegate to the orchestrator agent. It will coordinate research, development, testing, and docker-build agents in the correct sequence.

The only actions permitted in the main conversation outside the orchestrator are:
- Reading files to understand context before delegating
- Running `/update-docs` or `/git-workflow` skills when instructed
- Answering questions that do not require code changes

## Git Commit Messages

Evaluate if the user intends to explicitly bump the semantic version.
- `+semver: major` — e.g. 1.0.0 → 2.0.0
- `+semver: minor` — e.g. 1.0.0 → 1.1.0

Do not append these unless explicitly asked.
