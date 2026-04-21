# Setup Guide — Paper-to-Insight

## Prerequisites
- Node.js 18+
- Python 3.11+
- Git

## Frontend Setup (Member 1)
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## Backend Setup (Member 4)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://localhost:8000
# SQLite database (surveys.db) is auto-created on first run
```

## API Keys Needed

| Key | Who Gets It | Where |
|-----|-------------|-------|
| GEMINI_API_KEY | Member 2 & 4 | aistudio.google.com |
| LOCATIONIQ_API_KEY | Member 4 (backend geocoding) | locationiq.com → Dashboard → API Access Tokens |
| LOCATIONIQ_ACCESS_TOKEN | Member 1 (frontend map tiles) | locationiq.com → Dashboard → API Access Tokens |

> **LocationIQ free tier** gives 5,000 requests/day — plenty for development and demos.
> Sign up at https://locationiq.com — no credit card required for free tier.

## Where To Replace Keys

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:8000         ← keep for local dev
VITE_LOCATIONIQ_ACCESS_TOKEN=pk.xxxx...   ← from locationiq.com dashboard
```

### Backend (`backend/.env`)
```
GEMINI_API_KEY=AIza...                    ← from aistudio.google.com
LOCATIONIQ_API_KEY=pk.xxxx...             ← from locationiq.com dashboard
SQLITE_DB_PATH=./surveys.db               ← auto-created, no setup needed
```

## Database
- **No setup required.** SQLite creates `backend/surveys.db` automatically on first run.
- To inspect the database, install [DB Browser for SQLite](https://sqlitebrowser.org/) or run:
  ```bash
  sqlite3 backend/surveys.db ".tables"
  sqlite3 backend/surveys.db "SELECT * FROM surveys;"
  ```
- To reset the database: `rm backend/surveys.db` (it will be recreated on next run).

## Map (LocationIQ + OpenStreetMap)
- The interactive map uses **React-Leaflet** with **LocationIQ tile layers**.
- If `VITE_LOCATIONIQ_ACCESS_TOKEN` is not set, it falls back to plain OpenStreetMap tiles (fully free, no key needed).
- Village coordinates are resolved at upload time via the **LocationIQ Geocoding API** (backend).

## Docker (optional)
```bash
docker-compose up --build
# frontend → http://localhost:3000
# backend  → http://localhost:8000
```
