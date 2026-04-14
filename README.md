# Moonshot

A Splitwise-style expense-splitting app. See `DESIGN_PLAN.md` for full feature design.

## Setup

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in values (Firebase config, API URL).

### AI Chat

The `/chat` route calls the Anthropic API directly from the browser. Set your API key in `.env.local`:

```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

> **Note**: Direct browser access to the Anthropic API is intended for development/demo only. Move the API call server-side before production.

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
