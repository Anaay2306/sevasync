# SevaSync

SevaSync is an AI-powered social impact operating system for Indian NGOs, relief teams, CSR foundations, community leaders, donors, and government welfare partners. It turns fragmented field data into prioritized action and uses a credentialed volunteer intelligence layer to assign the right people to the right mission.

## What is included

- Next.js 15, React, Tailwind CSS, Framer Motion mission-control dashboard
- FastAPI backend with priority scoring, volunteer matching, credential intelligence, and Ola Maps-compatible ETA service
- PostgreSQL schema covering users, NGOs, volunteers, skills, tasks, requests, assignments, reports, ratings, and notifications
- AI prioritization model scaffold using XGBoost, Random Forest, Logistic Regression, and explainable scoring
- Dummy datasets and realistic seed data for India-focused NGO operations
- Mobile-ready volunteer experience surfaces inside the dashboard

## Folder structure

```text
sevasync/
  app/                     Next.js app router pages and global styles
  components/              Reusable dashboard and UI components
  lib/                     Shared TypeScript domain data, matching, analytics, volunteer intelligence
  backend/app/             FastAPI application
  backend/app/services/    Priority, matching, maps, and credential verification services
  backend/app/ai/          Model training scripts
  database/schema.sql      PostgreSQL + PostGIS schema
  data/                    CSV and JSON seed datasets
```

## Run frontend

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Run backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open `http://localhost:8000/docs`.

## Key APIs

- `GET /dashboard` - command dashboard metrics
- `GET /requests` - centralized community need records
- `POST /priority/score` - AI priority score and explanation
- `POST /credentials/parse-profile` - volunteer profile parsing
- `GET /credentials/graph/{volunteer_id}` - structured capability graph
- `POST /matching/rank` - best-fit volunteer ranking
- `GET /maps/eta` - Ola Maps-compatible route ETA adapter

## Volunteer intelligence design

The platform treats verified credentials and mission history as the source of truth for volunteer capabilities:

- Parse resumes and volunteer profile text
- Normalize skills into a structured graph
- Attach verification status and certifications
- Detect missing task skills
- Recommend training paths
- Rank volunteers by skill fit, distance, availability, urgency readiness, past performance, and language fit
- Suggest team composition for medical camps, food drives, education cohorts, and flood rescue

In production, connect the verification service to trusted certification providers while preserving the response contract used by the matching engine.

## Deployment

Frontend on Vercel:

```bash
npm run build
vercel deploy --prod
```

Backend on Railway or Render:

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Database:

1. Create PostgreSQL with PostGIS enabled.
2. Run `database/schema.sql`.
3. Add `DATABASE_URL` to backend environment variables.

Required production environment variables are listed in `.env.example`.

## Production hardening checklist

- Add Clerk or Firebase Auth middleware to protect admin APIs
- Store uploaded OCR files in S3-compatible object storage
- Add background workers for WhatsApp intake, OCR processing, and notifications
- Replace mocked Ola adapter with live Ola Maps routing and geocoding
- Replace local credential adapter with live verification webhooks
- Persist AI explanations and assignment factors for auditability
- Add row-level NGO tenancy policies for multi-NGO deployments
- Add offline sync queue for field forms in rural areas
