# BI Dashboard — Project Instructions

## What this app does
A BI dashboard that reads data from Google Sheets and visualises it with charts, statistics, and data tables. Think Looker/Metabase but backed by Google Sheets.

## Stack
- **Framework**: Next.js 15+ (App Router, TypeScript, `src/` dir)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Statistics**: simple-statistics
- **Data fetching**: Google Sheets API via `googleapis` (server-side only)
- **Tables**: TanStack Table v8
- **Icons**: lucide-react
- **Utilities**: clsx + tailwind-merge (`cn()` helper in `src/lib/utils.ts`)

## Key commands
```bash
npm run dev     # Start dev server on http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

## Project structure
```
src/
  app/                  # Next.js App Router pages
    api/                # API routes (server-side, Google Sheets calls go here)
    layout.tsx
    page.tsx
  components/
    charts/             # Recharts-based chart components
    ui/                 # Generic UI components (cards, tables, etc.)
  lib/
    sheets.ts           # Google Sheets API helpers (server-side only)
    utils.ts            # cn(), toNumber(), formatNumber()
  types/
    index.ts            # Shared TypeScript types
```

## Google Sheets setup
- Uses a **Service Account** (no OAuth flow needed)
- Credentials are in `.env.local` — never commit this file
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SPREADSHEET_ID`
- All Sheets API calls must be server-side (API routes or Server Components)

## Conventions
- Google Sheets data is always fetched in API routes (`src/app/api/`) — never in client components
- Use `getSheetData(range)` and `rowsToObjects(rows)` from `src/lib/sheets.ts`
- Numeric parsing: use `toNumber()` from `src/lib/utils.ts` (handles commas, empty strings)
- Use `cn()` for all className merging
- Prefer Recharts `ResponsiveContainer` for all charts so they resize properly
- Stats calculations via `simple-statistics` (mean, median, stdDev, etc.)
- Keep chart components in `src/components/charts/`, generic UI in `src/components/ui/`
