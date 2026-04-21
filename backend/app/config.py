# ── MEMBER 4 FILLS THIS FILE ──────────────────────────────
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY      = os.getenv("GEMINI_API_KEY")
    LOCATIONIQ_API_KEY  = os.getenv("LOCATIONIQ_API_KEY")
    SQLITE_DB_PATH      = os.getenv("SQLITE_DB_PATH", "./surveys.db")
