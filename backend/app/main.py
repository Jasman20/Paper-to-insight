from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.survey    import router as survey_router
from app.routes.dashboard import router as dashboard_router
from app.db.database      import init_db
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Paper2Insight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()   # ← THIS creates the surveys table on startup

app.include_router(survey_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"status": "Paper2Insight API running ✅"}
