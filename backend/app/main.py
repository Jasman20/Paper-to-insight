# FastAPI main entry point
# Run with: uvicorn app.main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import init_db
from app.routes import survey, dashboard, reports

app = FastAPI(title="Paper2Insight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize SQLite tables on startup
@app.on_event("startup")
def startup():
    init_db()

app.include_router(survey.router)
app.include_router(dashboard.router)
app.include_router(reports.router)

@app.get("/")
def root():
    return {"status": "Paper2Insight API running"}
