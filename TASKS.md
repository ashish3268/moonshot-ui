# Moonshot — Task Tracker

> Status legend: `[ ]` todo · `[~]` in progress · `[x]` done
> Source legend: `[PA]` = adapt from `/Users/jaia1188/physician-advisory-4-week-skunkworks-frontend`

---

## Phase 1 — Project Setup

- [x] **S-01** Scaffold Vite + React 18 + TypeScript project
- [x] **S-02** Install and configure dependencies (MUI, React Query, Zustand, React Router, React Hook Form, Zod, date-fns)
- [x] **S-03** Set up ESLint, Prettier, and tsconfig strict mode `[PA]` adapt `tsconfig.json` + `tsconfig.app.json`
- [x] **S-04** Configure Vitest for unit tests `[PA]` adapt `vite.config.ts` test block
- [x] **S-05** Configure Playwright for e2e tests `[PA]` adapt `playwright.config.ts`
- [x] **S-06** Set up MUI theme (`src/theme/theme.ts`) with Moonshot palette `[PA]` adapt `src/theme.ts` — update brand color, keep badge/custom palette shape
- [x] **S-06b** Copy layout primitives to `src/components/styled.ts` `[PA]` copy `src/components/styled.ts` — PageRoot, FlexSpacer, EmptyStateBox, DetailRow
- [x] **S-07** Create base `src/types/api.ts` with core interfaces (User, Friend, Group, Expense, Balance, Settlement)
- [x] **S-08** Create `src/api/client.ts` — Axios instance with auth interceptor + 401/403 error interceptor `[PA]` adapt `src/api/client.ts` — swap MSAL token fetch for Firebase `getIdToken()`
- [x] **S-08b** Create `src/api/queryKeys.ts` — React Query key factory for all resources
- [x] **S-09** Set up React Router with all routes wired to placeholder pages
- [x] **S-10** Create AppShell layout (Sidebar + TopBar) with navigation `[PA]` adapt `src/components/Layout.tsx` — rebrand, update nav links

---

## Phase 2 — Authentication

- [ ] **S-11** Integrate Firebase Auth (or Supabase Auth) — provider setup
- [ ] **S-12** Build `AuthProvider` + `useAuth` hook
- [ ] **S-13** Build `LoginPage` — email/password + Google OAuth
- [ ] **S-14** Add protected route wrapper — redirect unauthenticated users to `/login`
- [ ] **S-15** Persist auth token and wire into Axios interceptor

---

## Phase 3 — Friends

- [x] **S-16m** `src/hooks/useFriends.ts` — mock hook (300ms delay, returns MOCK_FRIENDS)
- [x] **S-17** `src/hooks/useFriends.ts` — React Query hooks (real API wired)
- [x] **S-17a** `src/api/friends.ts` — fetchFriends, fetchFriendBalance, fetchSharedExpenses (snake_case → camelCase)
- [x] **S-18** Build `FriendsPage` — list with owed/owing/settled sections and net balances
- [x] **S-19** Build `FriendDetailPage` — shared expenses list + net balance + Settle Up CTA
- [ ] **S-20** Build `SettleUpModal` — confirm and record a settlement
- [ ] **S-21** Add Friend flow — invite by email, pending state UI

---

## Phase 4 — Groups

- [x] **S-22m** `src/hooks/useGroups.ts` — mock hook (300ms delay, returns MOCK_GROUPS)
- [x] **S-23** `src/hooks/useGroups.ts` — React Query hooks (real API wired)
- [x] **S-23a** `src/api/groups.ts` — fetchGroups, fetchGroupDetail (snake_case → camelCase)
- [x] **S-24** Build `GroupsPage` — card grid with per-group net balance
- [x] **S-25** Build `GroupDetailPage` — members list, expense list, balance breakdown (uses useGroupDetail)
- [ ] **S-26** Create Group flow — name, emoji/color picker, add initial members

---

## Phase 5 — Expenses

- [x] **S-27m** `src/hooks/useExpenses.ts` — mock hook (300ms delay, filterable by groupId)
- [x] **S-28** `src/hooks/useExpenses.ts` — React Query hooks (real API)
- [x] **S-28a** `src/api/expenses.ts` — fetchExpenses, createExpense, deleteExpenseById (snake_case → camelCase)
- [x] **S-28b** `AddExpenseModal` wired to real `useCreateExpense()` mutation; removes alert mock
- [ ] **S-29** `src/utils/splitting.ts` — pure functions for equal, exact, percent, shares split modes
- [x] **S-30** `src/constants/categories.ts` — expense categories with icons
- [x] **S-31** Build `AddExpenseModal` — description, amount, date, category, paid-by, group, split preview
- [ ] **S-32** Build `SplitSelector` — toggle between equal / exact / percent / shares modes
- [ ] **S-33** Build `ExpenseDetailPage` — view, edit, delete expense; show audit trail
- [ ] **S-34** Unit tests for `splitting.ts` — all four split modes + edge cases

---

## Phase 6 — Dashboard & Activity

- [x] **S-35m** `src/hooks/useDashboard.ts` — mock hook (300ms delay, returns MOCK_DASHBOARD)
- [x] **S-35a** `src/hooks/useDashboard.ts` — real API wired via fetchDashboard
- [x] **S-35b** `src/api/dashboard.ts` — fetchDashboard (snake_case → camelCase)
- [x] **S-35c** `src/hooks/useActivity.ts` — real API wired (derives from fetchDashboard)
- [x] **S-36** Build `DashboardPage` — summary cards (owed/owe), groups list, recent activity feed
- [x] **S-37** Build `ActivityPage` — full chronological feed grouped by date
- [x] **S-38** `src/utils/currency.ts` — currency formatting helpers
- [x] **S-39** `src/utils/dates.ts` — relative date formatting (e.g. "3 days ago")

---

## Phase 6b — Mock Data Infrastructure

- [x] **S-M1** `src/mocks/data.ts` — hardcoded mock data conforming to `src/types/api.ts`
- [x] **S-M2** `src/hooks/useActivity.ts` — mock hook (300ms delay, returns MOCK_ACTIVITY)
- [x] **S-M3** Seed mock user in `src/main.tsx` via `useAuthStore.getState().setUser()`

---

## Phase 6b — AI Chat

> Entry point: floating 💬 button (bottom-right, all pages) → toggles slide-in drawer; full page also accessible via sidebar `/chat`
> API: Claude API called directly from frontend (VITE_ANTHROPIC_API_KEY). Move server-side before production.

- [x] **C-01** Add `VITE_ANTHROPIC_API_KEY` to `.env.local` + document in README
- [x] **C-02** Create `src/api/claude.ts` — thin wrapper around Anthropic API (`/v1/messages`) using `fetch`, with tool use support
- [x] **C-03** Define Claude tools in `src/ai/tools.ts`: `add_expense`, `get_balance`, `list_expenses`, `settle_up`, `list_friends`, `list_groups`
- [x] **C-04** Create `src/ai/systemPrompt.ts` — builds system prompt injecting current user's friends + groups as context so Claude can resolve names to IDs
- [x] **C-05** Build `src/pages/ChatPage.tsx` — ChatGPT-style full page: scrollable message history + fixed input at bottom
- [x] **C-06** Build `src/components/chat/ChatMessage.tsx` — user bubble (right) and assistant bubble (left) with markdown support
- [x] **C-07** Build `src/components/chat/ConfirmationCard.tsx` — inline card shown when Claude calls a tool, with [Confirm] and [Edit] buttons
- [x] **C-08** Build `src/components/chat/SuggestedPrompts.tsx` — shown on empty chat: "Split dinner with friends", "How much does Alice owe me?", "Show Yosemite expenses"
- [x] **C-09** Add floating chat button to `AppShell.tsx` — fixed bottom-right, navigates to `/chat`
- [x] **C-10** Wire tool confirmations to app actions — Confirm on `add_expense` → adds to mock data + shows success; `get_balance` → renders balance inline
- [x] **C-11** Add `/chat` route to `App.tsx`
- [x] **C-12** Extract `ChatMessageItem` type to `src/types/chat.ts` — shared between ChatPage and ChatDrawer
- [x] **C-13** Extract chat logic into `src/hooks/useChatState.ts` — reusable hook managing messages, input, loading, handleSend, handleConfirm
- [x] **C-14** Add `chatDrawerOpen` / `setChatDrawerOpen` / `toggleChatDrawer` to `src/store/uiStore.ts`
- [x] **C-15** Build `src/components/chat/ChatDrawer.tsx` — fixed right-side slide-in panel (420px, CSS transform, no backdrop/dimming, no content push); header with expand-to-full and close buttons
- [x] **C-16** Update `AppShell.tsx` — Fab toggles drawer (ChatIcon ↔ CloseIcon), ChatDrawer rendered as sibling; Fab hidden on `/chat` page
- [x] **C-17** Refactor `ChatPage.tsx` to use `useChatState()`; add back-arrow button in header via `useNavigate(-1)`
- [x] **C-18** Add "Chat" nav item to `Sidebar.tsx` with `AutoAwesomeIcon`, placed after Activity

---

## Phase 7 — Polish & Deployment

- [x] **S-40** Build `EmptyState` component — shown when lists are empty
- [x] **S-40b** Build `LoadingSpinner` component — centered CircularProgress
- [x] **S-40c** Build `BalanceBadge` component — green/red/grey pill
- [x] **S-40d** Build `UserAvatar` component — MUI Avatar with initials fallback
- [ ] **S-40e** Copy `DataTable.tsx` — generic sortable/selectable table `[PA]` copy `src/components/DataTable.tsx` directly
- [ ] **S-41** Add loading skeletons to all list/detail pages
- [ ] **S-42** Add error boundary + fallback UI
- [ ] **S-44** Write Dockerfile (Node build stage → nginx serve stage) `[PA]` copy `Dockerfile` directly; update env var placeholder names
- [ ] **S-45** Write `nginx.conf` and `docker-entrypoint.sh` with placeholder env var replacement `[PA]` copy both directly; update placeholder names
- [ ] **S-46** Playwright e2e: login → add expense → verify balance updates
- [ ] **S-47** Update `DESIGN_PLAN.md` and `README.md` to reflect final implementation

---

> **Note**: All hooks (friends, groups, expenses, dashboard, activity) are now wired to the real
> FastAPI backend at `http://localhost:8000`. A dev auth bypass is in place: when `FIREBASE_PROJECT_ID`
> is empty (dev), the backend accepts `dev:<firebase_uid>` tokens. The seed user is Alex Johnson
> (UUID `00000000-0000-0000-0000-000000000001`, firebase_uid `seed-u1`). FriendDetailPage still
> uses MOCK_FRIENDS/MOCK_EXPENSES directly — wiring deferred until friend detail API endpoints
> are confirmed.

---

## Backlog (Post-MVP)

- [ ] **B-01** Simplified debt algorithm (A→B→C collapses to A→C)
- [ ] **B-02** Receipt photo upload and attachment to expenses
- [ ] **B-03** Email digest notifications (weekly balance summary)
- [ ] **B-04** Multi-currency support with conversion
- [ ] **B-05** Mobile PWA — offline support, add-to-home-screen
- [ ] **B-06** Balance history chart (Recharts) on friend/group detail pages
