# Moonshot

A Splitwise-style expense-splitting app. See `DESIGN_PLAN.md` for full feature design.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in values (Firebase config, API URL).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `localhost:5173` |
| `npm run build` | Production build → `dist/` |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run unit tests |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run test:e2e` | Playwright e2e tests |
| `npm run lint` | ESLint |
