import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ── GROQ AI ───────────────────────────────
    # Get free key at: console.groq.com
    GROQ_API_KEY       = os.getenv("GROQ_API_KEY")

    # ── LOCATIONIQ GEOCODING ──────────────────
    # Get free key at: locationiq.com
    LOCATIONIQ_API_KEY = os.getenv("LOCATIONIQ_API_KEY")

    # ── DATABASE ──────────────────────────────
    SQLITE_DB_PATH     = os.getenv("SQLITE_DB_PATH", "./surveys.db")