# Paper-to-Insight

Convert handwritten field surveys into structured community need assessments using Gemini Vision AI.

## Stack
- **Frontend**: React + Vite + React-Leaflet (LocationIQ tiles)
- **Backend**: FastAPI + SQLite + LocationIQ Geocoding
- **AI**: Google Gemini Vision

## Quick Start
See [docs/SETUP.md](docs/SETUP.md) for full setup instructions.

```bash
# Backend
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## Features
- 📸 Upload or photograph handwritten surveys
- 🤖 AI extracts text, scores severity, suggests resources
- 🗺️ Auto-geocodes villages via LocationIQ and pins them on a live map
- 📊 Dashboard with severity breakdown and priority table
- 💾 Offline mode — queues surveys in IndexedDB, syncs when online
- 🗄️ SQLite database — zero-config, file-based persistence
