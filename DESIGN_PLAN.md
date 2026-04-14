# Moonshot — Design Plan

> Moonshot is a expense-splitting app similar to Splitwise. This document covers feature scope, page designs, repo structure, and tech stack decisions.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| UI Library | Material-UI v9 |
| Global State | Zustand (UI state only) |
| Server State | TanStack React Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts (balance history) |
| Auth | Firebase Auth or Supabase Auth |
| Routing | React Router v7 (v6-compat API) |

---

## Features

### Phase 1 — MVP
- Authentication (email + Google OAuth)
- Friends: add by email, see net balance per friend
- Groups: create, add members, group-level balance
- Add expense: equal split only
- Settle up: mark debt as paid
- Dashboard: net balance overview + recent activity

### Phase 2
- Custom split modes: exact amounts, percentages, shares (e.g. 2:1:1)
- Receipt photo attachment
- Full activity feed with filters
- Expense edit / delete with audit trail

### Phase 3
- Simplified debt (A→B→C collapses to A→C)
- Email digest notifications
- Mobile PWA support
- Multi-currency support

---

## Routes

```
/login                  → Auth page
/dashboard              → Home: net balance, recent activity
/friends                → Friends list + per-friend balances
/friends/:id            → Friend detail: shared expenses, net balance, settle up
/groups                 → Groups list
/groups/:id             → Group detail: members, expenses, balances
/expenses/new           → Add expense (modal or full page)
/expenses/:id           → Expense detail / edit
/activity               → Full activity feed
/profile                → Settings, currency, logout
```

---

## Page Designs

### Login (`/login`)
```
┌─────────────────────────────────────┐
│                                     │
│          🌙 Moonshot                │
│     Split expenses, not friendships │
│                                     │
│   [Continue with Google]            │
│                                     │
│   ──────── or ────────              │
│                                     │
│   Email    [                      ] │
│   Password [                      ] │
│            [Sign In]                │
│            Don't have an account?   │
│            [Sign Up]                │
│                                     │
└─────────────────────────────────────┘
```

---

### Dashboard (`/dashboard`)
```
┌──────────────────────────────────────────────┐
│  🌙 Moonshot              [+ Add Expense]  👤 │
├──────────────┬───────────────────────────────┤
│  Sidebar     │  You are owed   $142.50        │
│  ─────────   │  You owe        $38.00         │
│  Dashboard   ├───────────────────────────────┤
│  Friends     │  Groups                        │
│  Groups      │  ─────────────────────────     │
│  Activity    │  🏕 Yosemite Trip    +$56.00   │
│              │  🏠 Apt              -$23.00   │
│              │  🎉 Vegas             +$80.00  │
│              ├───────────────────────────────┤
│              │  Recent Activity               │
│              │  ─────────────────────────     │
│              │  Alice added "Dinner"  $60     │
│              │  You settled with Bob  $14     │
│              │  You added "Uber"      $22     │
└──────────────┴───────────────────────────────┘
```

- Net balance bar at top: green = owed to you, red = you owe
- Groups listed with per-group net balance
- Recent activity feed (last 10 events)

---

### Friends (`/friends`)
```
┌──────────────────────────────────────────────┐
│  Friends                    [+ Add Friend]   │
├──────────────────────────────────────────────┤
│  🔴 You owe                                  │
│  ─────────────────────────────────────────   │
│  👤 Alice Chen          you owe  $23.50  [>] │
│                                              │
│  🟢 Owed to you                              │
│  ─────────────────────────────────────────   │
│  👤 Bob Smith           owes you $14.00  [>] │
│  👤 Carol Wu            owes you $55.00  [>] │
│                                              │
│  ✅ Settled up                               │
│  ─────────────────────────────────────────   │
│  👤 Dan Park            settled              │
└──────────────────────────────────────────────┘
```

---

### Friend Detail (`/friends/:id`)
```
┌──────────────────────────────────────────────┐
│  ← Alice Chen                                │
│  alice@email.com                             │
│                                              │
│  You owe Alice  $23.50        [Settle Up]    │
├──────────────────────────────────────────────┤
│  Shared Expenses                             │
│  ─────────────────────────────────────────   │
│  🍕 Pizza dinner      Apr 10   you owe $20   │
│  🚕 Uber to airport   Apr 7    you owe $3.50 │
│  🍺 Drinks            Apr 2    Alice owes $8 │
└──────────────────────────────────────────────┘
```

---

### Groups (`/groups`)
```
┌──────────────────────────────────────────────┐
│  Groups                       [+ New Group]  │
├──────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐          │
│  │ 🏕 Yosemite  │  │ 🏠 Apartment │          │
│  │ 4 members    │  │ 3 members    │          │
│  │ +$56.00      │  │ -$23.00      │          │
│  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐                            │
│  │ 🎉 Vegas     │                            │
│  │ 6 members    │                            │
│  │ +$80.00      │                            │
│  └──────────────┘                            │
└──────────────────────────────────────────────┘
```

---

### Group Detail (`/groups/:id`)
```
┌──────────────────────────────────────────────┐
│  ← 🏕 Yosemite Trip              [+ Expense] │
│  Alice · Bob · You · Carol                   │
├───────────────────┬──────────────────────────┤
│  Balances         │  Expenses                │
│  ─────────────    │  ───────────────────      │
│  You owe Alice    │  🍕 Pizza      $60        │
│  $23.50           │  ⛽ Gas        $45        │
│                   │  🏨 Hotel      $320       │
│  Bob owes you     │  🧴 Sunscreen  $18        │
│  $14.00           │  🎟 Park pass  $35        │
│                   │                          │
│  [Settle Up]      │                          │
└───────────────────┴──────────────────────────┘
```

---

### Add Expense (modal)
```
┌──────────────── Add Expense ─────────────────┐
│                                              │
│  Description  [Pizza dinner               ] │
│  Amount       [$  60.00                   ] │
│  Date         [Apr 13, 2026               ] │
│  Category     [🍕 Food ▾                  ] │
│  Group        [Yosemite Trip ▾            ] │
│                                              │
│  Paid by      [You ▾]                        │
│                                              │
│  Split        [Equally ▾]                   │
│               ☑ Alice   $20.00              │
│               ☑ Bob     $20.00              │
│               ☑ You     $20.00              │
│                                              │
│               [Cancel]        [Save]        │
└──────────────────────────────────────────────┘
```

Split modes (toggle):
- **Equally** — divide total by checked members
- **Exact** — type each person's amount (must sum to total)
- **Percentage** — type % per person (must sum to 100)
- **Shares** — assign share weight (e.g. 2:1:1), auto-calculates amounts

---

### Activity Feed (`/activity`)
```
┌──────────────────────────────────────────────┐
│  Activity          [Filter: All ▾]           │
├──────────────────────────────────────────────┤
│  Apr 13                                      │
│  Alice added "Pizza dinner"  Yosemite  $60   │
│  You settled with Bob                  $14   │
│                                              │
│  Apr 10                                      │
│  You added "Uber to airport"           $22   │
│  Bob edited "Hotel"          Yosemite  $320  │
└──────────────────────────────────────────────┘
```

Filters: All / Group / Friend / Date range

---

## Repo Structure

```
moonshot/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx                  # App entry point
│   ├── App.tsx                   # Router setup
│   │
│   ├── types/
│   │   └── api.ts                # All shared TS interfaces (User, Group, Expense, Balance…)
│   │
│   ├── auth/
│   │   ├── AuthProvider.tsx      # Auth context + token management
│   │   └── useAuth.ts            # Hook to access auth state
│   │
│   ├── api/
│   │   ├── client.ts             # Axios instance with auth interceptor + 401/403 error interceptor
│   │   ├── queryKeys.ts          # React Query key factory for all resources
│   │   ├── users.ts
│   │   ├── friends.ts
│   │   ├── groups.ts
│   │   ├── expenses.ts
│   │   └── settlements.ts
│   │
│   ├── store/                    # Zustand — UI state only
│   │   ├── authStore.ts
│   │   └── uiStore.ts            # modal open state, active group, etc.
│   │
│   ├── hooks/                    # React Query hooks wrapping API calls
│   │   ├── useFriends.ts
│   │   ├── useGroups.ts
│   │   ├── useExpenses.ts
│   │   └── useBalances.ts
│   │
│   ├── components/
│   │   ├── styled.ts             # MUI layout primitives (PageRoot, FlexSpacer, EmptyStateBox, DetailRow)
│   │   ├── DataTable.tsx         # Generic sortable/selectable table — reused across expenses, groups, history
│   │   ├── layout/
│   │   │   ├── AppShell.tsx      # Sidebar + topbar wrapper
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseCard.tsx
│   │   │   ├── AddExpenseModal.tsx
│   │   │   └── SplitSelector.tsx
│   │   ├── groups/
│   │   │   ├── GroupCard.tsx
│   │   │   └── MemberList.tsx
│   │   ├── friends/
│   │   │   ├── FriendRow.tsx
│   │   │   └── SettleUpModal.tsx
│   │   └── common/
│   │       ├── BalanceBadge.tsx
│   │       ├── Avatar.tsx
│   │       ├── EmptyState.tsx
│   │       └── LoadingSpinner.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FriendsPage.tsx
│   │   ├── FriendDetailPage.tsx
│   │   ├── GroupsPage.tsx
│   │   ├── GroupDetailPage.tsx
│   │   ├── ExpenseDetailPage.tsx
│   │   └── ActivityPage.tsx
│   │
│   ├── utils/
│   │   ├── currency.ts           # format $1,234.56
│   │   ├── splitting.ts          # equal/exact/percent/shares calc logic
│   │   └── dates.ts
│   │
│   ├── constants/
│   │   └── categories.ts         # expense categories with icons
│   │
│   └── theme/
│       └── theme.ts              # MUI palette, typography
│
├── tests/
│   ├── unit/                     # Vitest unit tests
│   └── e2e/                      # Playwright tests
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── Dockerfile
├── nginx.conf
└── docker-entrypoint.sh
```

---

## Key Architecture Decisions

| Decision | Rationale |
|---|---|
| React Query for server state | Handles caching, refetch, loading/error states — no manual useState boilerplate |
| Zustand only for UI state | Avoids double-source-of-truth between server and client state |
| `hooks/` separate from `api/` | API layer is pure async functions; hooks layer adds React Query on top |
| `queryKeys.ts` key factory | Centralised key definitions prevent cache misses and typos across hooks |
| Axios response interceptor for 401/403 | Explicit error handling from day one — the physician advisory frontend has none; do not repeat that gap |
| `splitting.ts` pure functions | Core math is framework-agnostic and easy to unit test |
| Single `types/api.ts` | One place to update when backend schema changes |
| Placeholder env vars in Dockerfile | Same Docker image deployable to dev/staging/prod without rebuild |
| Borrow config/layout/theme from physician advisory frontend | Proven patterns already in production; adapt rather than rewrite — see `TASKS.md` for `[PA]` annotations |
