from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.survey    import router as survey_router
from app.routes.dashboard import router as dashboard_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Paper2Insight API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://paper-to-insight.vercel.app",
        "https://*.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(survey_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"status": "Paper2Insight API running ✅"}
