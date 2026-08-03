# Peak Physique — Frontend (Public Site + Client Portal)

React 18 + Vite + Tailwind CSS. Contains the public marketing site (hero, services,
tools, pricing, testimonials, booking) and the authenticated **client portal**
(overview, progress tracking with charts, bookings, payments, messaging).

## Run locally

```bash
cp .env.example .env          # VITE_API_URL -> http://localhost:8000/api/v1
npm install
npm run dev                   # http://localhost:5173
```

The backend must be running (see `../backend`).

## Build for production

```bash
npm run build                 # outputs dist/
npm run preview               # preview the production build
```

Deploy `dist/` to any static host. Set `VITE_API_URL` at build time to your live API,
and add a catch-all rewrite to `index.html` for client-side routing.

## Structure

- `src/sections` — landing-page sections
- `src/tools` — BMI, macro, and workout calculators (client-side)
- `src/pages` — Landing, Login, Register, and `portal/*`
- `src/context/AuthContext.jsx` — JWT auth state
- `src/lib/api.js` — axios client with automatic token refresh