# GDG on Campus – Rajeev Institute of Technology, Hassan

> **Learn. Build. Connect. Innovate.**  
> Official Full-Stack Web Application & Club Operations Platform for **Google Developer Groups on Campus – RIT Hassan** (Department of Computer Science & Engineering), built for **CODESTORM 2026 – Challenge 01 (Website Building Challenge)**.

---

## 🌐 Live Demo

- **Live Website:** [https://gdg-rit-website-five.vercel.app/](https://gdg-rit-website-five.vercel.app/)
- **Backend API:** [https://gdg-rit-backend.onrender.com](https://gdg-rit-backend.onrender.com)
- **API Documentation:** [https://gdg-rit-backend.onrender.com/docs](https://gdg-rit-backend.onrender.com/docs)

> The frontend is hosted on Vercel, and the FastAPI backend is deployed on Render.

---

## Short Project Description

A modern, database-backed full-stack web platform for **GDG on Campus – Rajeev Institute of Technology, Hassan**. Built with React, TypeScript, Tailwind CSS, FastAPI, and SQLAlchemy, it combines an engaging public developer community hub (Home, About, Events & Live Registration, Activities & Achievements, Interactive Gallery, Team Directory, Verifiable Digital Certificates, Membership Portal, and Contact Desk) with a JWT-secured Admin Control Panel for real-time club operations.

---

## Technologies Used

| Layer | Stack |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS, Framer Motion, React Router, Axios, Lucide React |
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy ORM, Pydantic v2, Pydantic Settings, Python-Dotenv |
| **Authentication & Security** | JWT (`PyJWT`), PBKDF2-HMAC-SHA256 salted password hashing, login rate limiting, magic-byte upload validation, explicit CORS allowlist |
| **Database** | SQLite (zero-config local development) & PostgreSQL-compatible SQLAlchemy architecture for production |
| **Deployment** | Vercel (Frontend SPA with `vercel.json`) + Render / Railway (FastAPI Backend via `Procfile`) |

---

## Key Features

### Public Website

- **Home (`/`)**: Hero with official GDG, RIT, and CSE branding, live announcement banner, dynamic database-backed community statistics, featured **CODESTORM 2026** countdown & instant registration, 4 interactive technology tracks, gallery preview with lightbox, and team spotlight.
- **About (`/about`)**: Official Mission, Vision, 8 strategic goals, 6 technology domain cards, club inauguration milestone (23 September 2026), and all three institutional logos (GDG on Campus, RIT Hassan, Dept. of CSE).
- **Events & Live Registration (`/events`, `/events/:slug`)**: Searchable/filterable events catalog, full event detail pages (agenda, speakers, coordinators, eligibility, rules, FAQs), individual & team registration modal with duplicate email/USN prevention, capacity & deadline validation, and unique registration pass generation.
- **Activities & Achievements (`/activities`)**: Tabbed showcase of technical workshops, hackathons, study jams, and verified club recognitions.
- **Interactive Gallery (`/gallery`)**: Category filters, search, and fullscreen keyboard-accessible Lightbox viewer.
- **Team Directory (`/team`)**: Authentic 12-member directory across Faculty Coordinators, Leadership, and Student Core Team with bios and social links.
- **Certificate Verification (`/certificates`)**: Public lookup by Certificate Code, Student Name, USN, or Event Name with printable verification credentials (`@media print`).
- **Membership Application (`/membership`)**: Interactive application form with multi-domain interest selection and instant tracking ID (`GDG-MEM-*`).
- **Contact Desk (`/contact`)**: Backend-connected contact form, official club channels (`gdgoncampusgdgclubrit@gmail.com`, `@gdg_club_rit`, WhatsApp communities, GitHub), and embedded Google Maps location for RIT Hassan.

### Protected Admin Control Panel (`/admin/login`)

- **Dashboard (`/admin/dashboard`)**: Real-time KPIs, recent registrations, recent visitor messages, and authenticated CSV export.
- **Events Manager (`/admin/events`)**: Create/edit/delete events, poster image uploads, agenda/speakers/coordinators/rules/deadline fields, draft publish & registration open/close toggles.
- **Registrations Manager (`/admin/registrations`)**: Search, filter by event/department, update status (`CONFIRMED`/`WAITLIST`/`CANCELLED`), and export filtered CSV rosters.
- **Gallery Manager (`/admin/gallery`)**: Drag-and-drop multi-image uploader with previews, event linking, metadata editing, and deletion.
- **Team, Certificates, Membership, Contact, Activities & Settings**: Complete dynamic management of members, verifiable certificates (issue/edit/approve/revoke/CSV export), membership applications, contact inquiries, announcements, website settings, and admin password changes.

---

## Folder Structure

```text
gdg-rit-website/
├── .env.example                 # Root environment variable template
├── .gitignore                   # Protects .env, *.db, node_modules, dist, uploads
├── README.md                    # Documentation & deployment guide
├── start.ps1                    # Windows one-click dev launcher
├── backend/
│   ├── Procfile                 # Production server command (Render/Railway)
│   ├── .env.example             # Backend environment variable template
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Local Uvicorn launcher (port 8000)
│   ├── uploads/                 # Local storage for uploaded posters, gallery, team avatars
│   └── app/
│       ├── main.py              # FastAPI app, CORS, static /uploads mount, auto-seed
│       ├── core/                # config.py (.env loader), security.py (PBKDF2 + JWT)
│       ├── database/            # session.py (SQLite FK PRAGMA), seed.py, reset_admin.py
│       ├── models/              # 12 relational SQLAlchemy models
│       ├── schemas/              # Pydantic v2 validation schemas
│       ├── routes/               # 11 REST API routers under /api/*
│       └── utils/                # file_storage.py (magic-byte & size validation)
└── frontend/
    ├── .env.example             # Frontend environment variable template
    ├── vercel.json              # SPA deep-link rewrites for Vercel
    ├── package.json             # Frontend dependencies & scripts
    ├── vite.config.ts           # Vite 8 build config with vendor chunk splitting
    ├── public/
    │   ├── robots.txt
    │   ├── sitemap.xml
    │   └── assets/              # Official logos: gdg-logo.jpeg, rit-logo.jpeg, cse-logo.jpeg
    └── src/
        ├── components/          # Navbar, Footer, AnnouncementBanner, Lightbox, Modals, ErrorBoundary
        ├── context/             # AuthContext, ToastContext
        ├── layouts/             # MainLayout, AdminLayout
        ├── pages/               # 11 Public pages + 11 Admin pages under pages/admin/
        ├── services/            # api.ts (Axios client + JWT interceptor + CSV blob export)
        └── types/               # Shared TypeScript interfaces
```

---

## Installation & Local Setup

### Prerequisites

- **Python 3.10+** and `pip`
- **Node.js 18+** and `npm`

### 1. Configure Environment Variables

Copy the example templates and set your own secure values:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### 2. Backend Installation & Startup (`http://localhost:8000`)

```powershell
cd backend
pip install -r requirements.txt
python run.py
```

- Database tables and authentic GDG RIT Hassan seed data are initialized automatically on first startup (`backend/gdg_rit.db`).
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/health`

### 3. Frontend Installation & Startup (`http://localhost:5173`)

```powershell
cd frontend
npm install
npm run dev -- --port 5173
```

### 4. Production Build (Frontend)

```powershell
cd frontend
npm run build
```

---

## Secure Admin Credential Configuration

The admin account is configured via environment variables in `backend/.env` (never committed to GitHub):

```env
ENVIRONMENT=development
SECRET_KEY=your-strong-random-secret-key
ADMIN_USERNAME=admin
ADMIN_EMAIL=gdgoncampusgdgclubrit@gmail.com
ADMIN_PASSWORD=your-chosen-local-password
ADMIN_FULL_NAME=GDG RIT Administrator
```

- **Local Development**: You can sign in at `http://localhost:5173/admin/login` using either your configured `ADMIN_USERNAME` or `ADMIN_EMAIL` (case-insensitive) and `ADMIN_PASSWORD`.
- **Safe Dev-Only Credential Reset** (preserves all events, registrations, gallery, and team records):

  ```powershell
  cd backend
  python -m app.database.reset_admin
  ```

- **Production Safety**: When `ENVIRONMENT=production`, the backend refuses to boot without an explicit `SECRET_KEY`, never provisions hardcoded default credentials, and disables `reset_admin.py`. Always change passwords via **Admin Portal → Settings → Security & Passwords**.

---

## Deployment Instructions

### Backend Deployment (Render / Railway)

1. Push this repository to a **public GitHub repository** (verify `.gitignore` excludes `.env` and `*.db`).
2. Create a new **Web Service** pointing to the `backend/` root directory.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT` (also defined in `backend/Procfile`).
5. Configure Production Environment Variables:
   - `ENVIRONMENT=production`
   - `SECRET_KEY=<64-char random secret>`
   - `DATABASE_URL=<managed PostgreSQL connection URL>`
   - `CORS_ORIGINS=https://your-vercel-app.vercel.app`
   - `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` (for initial first-boot provisioning)

### Frontend Deployment (Vercel)

1. Import the public GitHub repository in **Vercel** and set Root Directory to `frontend`.
2. Framework Preset: **Vite** (`npm run build`, output `dist`).
3. Add Environment Variables:
   - `VITE_API_BASE_URL=https://gdg-rit-backend.onrender.com/api`
   - `VITE_BACKEND_URL=https://gdg-rit-backend.onrender.com`
4. Deploy (`frontend/vercel.json` handles SPA routing for all public and admin URLs).

### Production URLs

| Service | URL |
| :--- | :--- |
| **Live Website** | https://gdg-rit-website-five.vercel.app/ |
| **Backend API** | https://gdg-rit-backend.onrender.com |
| **API Documentation** | https://gdg-rit-backend.onrender.com/docs |

---

## Official Club Links & Credits

- **Club**: GDG on Campus – Rajeev Institute of Technology, Hassan (Department of CSE)
- **Email**: `gdgoncampusgdgclubrit@gmail.com`
- **Instagram**: `@gdg_club_rit`
- **Main WhatsApp Community**: [Join Group](https://chat.whatsapp.com/Ep2J8GpmRBoF0Fj3A5eks1)
- **CODESTORM 2026 GitHub**: [codestorm-2026](https://github.com/Yashawantha26/codestorm-2026.git)
- **Credit**: *Designed & Developed by Ajithkumar HM, Chaithan SR, Sathwik HL*

---

**Built with ❤️ for GDG on Campus – RIT Hassan.**
