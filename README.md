# Peak Physique — Full-Stack Platform

A production-ready rebuild of the Peak Physique personal-training website. What used
to be three standalone HTML files backed by browser `localStorage` is now a real
full-stack application: a FastAPI + PostgreSQL backend, a public marketing site with a
secure client portal, and a separate trainer/admin dashboard that reads **live** client
data. The original dark-and-gold visual identity is preserved throughout.

---

## 1. What's Inside

```
Peak_Physique/
├── backend/     FastAPI + SQLAlchemy (async) + PostgreSQL API
├── frontend/    Public website + client portal (React + Vite + Tailwind)
├── dashboard/   Trainer / admin dashboard        (React + Vite + Tailwind)
├── docker-compose.yml
├── Makefile
└── README.md    (this file)
```

### Feature checklist (from the agreed scope)

| Requirement | Status |
|---|---|
| Custom client portal on a real database | ✅ Built |
| Trainer dashboard connected to live client data | ✅ Built |
| Secure registration & login (hashed passwords, JWT) | ✅ Built |
| Client data syncs across devices | ✅ Built (server-side DB) |
| Custom backend (FastAPI + PostgreSQL) | ✅ Built |
| Stripe payment integration | ✅ Built (activates with your keys) |
| Google Calendar integration for bookings | ✅ Built (activates with your keys) |
| Server-side email booking notifications | ✅ Built (activates with SMTP) |
| Social-media icons removed + code cleanup | ✅ Done |

> **Graceful degradation:** Stripe, Google Calendar, and email are fully wired up, but
> the app runs perfectly **without** them — those features simply no-op and log a notice
> until you add the relevant credentials. This means you can run and demo the entire
> platform locally with zero external accounts.

---

## 2. Architecture at a Glance

```
                 ┌────────────────────┐       ┌────────────────────┐
                 │   frontend (5173)  │       │  dashboard (5174)  │
                 │  Public + Portal   │       │  Trainer / Admin   │
                 └─────────┬──────────┘       └─────────┬──────────┘
                           │  HTTPS / JSON (JWT)         │
                           └──────────────┬─────────────┘
                                          ▼
                              ┌───────────────────────┐
                              │    backend (8000)     │
                              │   FastAPI  /api/v1    │
                              │  Auth · Bookings ·    │
                              │  Progress · Payments  │
                              │  Messages · Admin     │
                              └───────────┬───────────┘
                                          ▼
                    ┌───────────────┬─────────────┬────────────────┐
                    │  PostgreSQL   │   Stripe    │ Google Calendar │
                    │  (core data)  │  (payments) │  + SMTP email   │
                    └───────────────┴─────────────┴────────────────┘
```

- **Auth:** JWT access + refresh tokens. Passwords hashed with bcrypt. Role-based
  access (`client`, `trainer`, `admin`) enforced on every protected route.
- **Data model:** users, plans, bookings, payments, progress entries, messages.
- **The "sync" requirement:** because all data lives in PostgreSQL, a client logging
  progress on their phone is instantly visible in the portal on their laptop **and** in
  the trainer's dashboard. There is no browser-local state.

---

## 3. Prerequisites

Install these once (all free / open-source):

| Tool | Version | Why |
|---|---|---|
| **Python** | 3.12+ | Backend runtime |
| **uv** | latest | Fast Python package/venv manager ([install](https://docs.astral.sh/uv/)) |
| **Node.js** | 22 LTS | Frontend build/runtime |
| **PostgreSQL** | 14+ | Database (or use Docker — see §6) |

> Don't want to install Postgres locally? You can run the backend against **SQLite**
> with zero setup (great for a first run) — see §4. For production, use PostgreSQL.

Installing `uv` (if you don't have it):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh   # macOS / Linux
# or: pip install uv
```

---

## 4. Quick Start (local, zero external services)

Open **three terminals** — one per app.

### Terminal 1 — Backend

```bash
cd backend
cp .env.example .env                      # sensible defaults; SQLite out of the box

uv venv                                   # create .venv
uv sync                                   # install dependencies from pyproject.toml
                                          # (or: uv pip install -e ".[dev]")

uv run python -m app.db.init_db           # create tables + seed demo data
uv run uvicorn app.main:app --reload      # http://localhost:8000
```

Check it: open <http://localhost:8000/docs> for interactive API docs.

**Seeded demo accounts** (created by `init_db`):
- **Client portal:** `demo@peakphysique.com` / `peak2025`
- **Trainer dashboard:** whatever you set as `FIRST_TRAINER_EMAIL` /
  `FIRST_TRAINER_PASSWORD` in `.env` (defaults are in `.env.example` — change them).

### Terminal 2 — Frontend (public site + portal)

```bash
cd frontend
cp .env.example .env                      # points at http://localhost:8000/api/v1
npm install
npm run dev                               # http://localhost:5173
```

### Terminal 3 — Dashboard (trainer/admin)

```bash
cd dashboard
cp .env.example .env
npm install
npm run dev                               # http://localhost:5174
```

That's it. Register a new client on the site, log some progress, then open the
dashboard and watch it appear under that client. 🎉

---

## 5. Configuration (turning on Stripe, Calendar, Email)

All backend configuration lives in `backend/.env`. The file `backend/.env.example`
documents every variable. The important groups:

### Database
```env
# SQLite (default, zero-config):
DATABASE_URL=sqlite+aiosqlite:///./peak_physique.db
# PostgreSQL (recommended for production):
# DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@localhost:5432/peak_physique
```

### Security (REQUIRED for production)
```env
SECRET_KEY=change-me            # generate with:  openssl rand -hex 32
FIRST_TRAINER_EMAIL=coach@trainpeakphysique.com
FIRST_TRAINER_PASSWORD=change-me-too
```

### Stripe (optional — payments)
```env
STRIPE_SECRET_KEY=sk_live_or_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:5173/portal/payments?status=success
STRIPE_CANCEL_URL=http://localhost:5173/pricing?status=cancel
```
Leave blank and checkout endpoints will report "payments not configured" instead of
failing. Point your Stripe webhook at `POST /api/v1/payments/webhook`.

### Google Calendar (optional — auto-create events for bookings)
```env
GOOGLE_CALENDAR_ID=you@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_JSON=/absolute/path/to/service-account.json
```
Uses a Google **service account**. Share the target calendar with the service
account's email. Leave blank to skip calendar sync.

### Email / SMTP (optional — booking notifications)
```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...
SMTP_FROM=Peak Physique <no-reply@trainpeakphysique.com>
NOTIFY_EMAIL=coach@trainpeakphysique.com   # where new-booking alerts go
```
Leave blank and emails are logged to the console instead of sent.

### Frontend / Dashboard
Each has a one-line `.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```
For production, set this to your deployed API URL (e.g. `https://api.trainpeakphysique.com/api/v1`).

---

## 6. Running with Docker (backend + PostgreSQL)

A `docker-compose.yml` is provided that brings up PostgreSQL and the backend together:

```bash
cp backend/.env.example backend/.env      # edit as needed; compose sets DATABASE_URL
docker compose up --build
# backend on http://localhost:8000, postgres on 5432
```

The backend container runs `init_db` (create tables + seed) on startup, then serves via
uvicorn. The two React apps are static frontends — build them (`npm run build`) and host
the `dist/` folders on any static host (see §7), or run them with `npm run dev` during
development.

---

## 7. Deployment

**Backend** — any host that runs Python/containers (Render, Railway, Fly.io, a VPS, etc.):
1. Provision a PostgreSQL database; set `DATABASE_URL` to it.
2. Set `SECRET_KEY`, the `FIRST_TRAINER_*` vars, and any Stripe/Google/SMTP creds.
3. Run migrations: `uv run alembic upgrade head` (or `python -m app.db.init_db` for a
   first deploy — it creates tables and seeds the plans + first admin).
4. Serve with a production server, e.g.
   `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`.
   (The included `Dockerfile` already does this.)

**Frontend & Dashboard** — static hosts (Vercel, Netlify, Cloudflare Pages, S3+CloudFront):
```bash
cd frontend && npm run build      # outputs dist/
cd ../dashboard && npm run build  # outputs dist/
```
Deploy each `dist/` folder. Set `VITE_API_URL` at build time to your live API. Because
both apps use client-side routing, add a catch-all rewrite to `index.html` (Netlify:
`/* /index.html 200`; Vercel: a rewrite of all paths to `/`).

**CORS:** add your deployed frontend/dashboard origins to `CORS_ORIGINS` in the backend
`.env` so the browser is allowed to call the API.

---

## 8. Project Layout (detail)

```
backend/
├── app/
│   ├── main.py              App factory, CORS, rate limiting, lifespan
│   ├── core/               config, security (JWT/bcrypt), logging, rate limit
│   ├── db/                 async engine/session, Base, init_db, seed
│   ├── models/             SQLAlchemy models (user, plan, booking, payment, progress, message)
│   ├── schemas/            Pydantic v2 request/response models
│   ├── api/                deps (auth guards) + routes (auth, users, plans,
│   │                       bookings, progress, payments, messages, admin)
│   └── services/           email, stripe, google_calendar (all degrade gracefully)
├── alembic/                migrations
├── tests/                  pytest suite
├── pyproject.toml          dependencies (managed by uv)
├── Dockerfile
└── .env.example

frontend/  (public site + client portal)
└── src/
    ├── sections/           Hero, Services, About, Tools, Pricing, Testimonials, Booking
    ├── tools/              BMI, Macro, Workout generators (client-side)
    ├── pages/              Landing, Login, Register, portal/*  (Overview, Progress,
    │                       Bookings, Payments, Messages)
    ├── components/         Navbar, Footer (no social icons), ProtectedRoute
    ├── context/            AuthContext (JWT)
    └── lib/                api client (axios + token refresh), utils

dashboard/  (trainer / admin — staff-only)
└── src/
    ├── pages/              Login, Overview, Clients, ClientDetail, Bookings, Payments
    ├── components/         Sidebar, ProtectedRoute (staff guard)
    ├── context/            AuthContext (rejects non-staff)
    └── lib/                api client, utils
```

---

## 9. Testing

```bash
cd backend
uv run pytest            # runs the API test suite (auth, bookings, access control)
```

---

## 10. Notes & Next Steps

- **Images:** the design uses the original dark/gold system with typography and
  gradients rather than stock photos, so it renders reliably with no external image
  dependencies. Drop your own photos into the hero/about sections whenever you'd like —
  the layout leaves room for them.
- **Security:** please read `SECURITY.md` before going live. In short: never commit
  `.env`, rotate any credentials that were shared during the project, use least-privilege
  API keys, and enable 2FA on Stripe/Google/your host.
- **Extensibility:** the codebase is organized so new features (e.g. workout plan
  management, richer analytics) slot in as new models + routes on the backend and new
  pages on the frontends.