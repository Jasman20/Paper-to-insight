# SQLite database setup — replaces Firebase Firestore
import sqlite3
import json
from datetime import datetime
from app.config import Config

def get_connection():
    conn = sqlite3.connect(Config.SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create tables on first run."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS surveys (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            uploaded_by   TEXT    NOT NULL DEFAULT 'Field Worker',
            uploaded_at   TEXT    NOT NULL,
            raw_text      TEXT,
            language      TEXT,
            village_name  TEXT,
            district      TEXT,
            state         TEXT,
            people_affected INTEGER,
            severity      TEXT,
            severity_score  INTEGER,
            need_category TEXT,
            immediate_action INTEGER DEFAULT 0,
            allocation_suggestion TEXT,
            suggested_resources TEXT,
            lat           REAL,
            lng           REAL,
            image_path    TEXT
        )
    """)
    conn.commit()
    conn.close()

def insert_survey(data: dict) -> int:
    """Insert a processed survey and return its id."""
    conn = get_connection()
    cur = conn.execute("""
        INSERT INTO surveys (
            uploaded_by, uploaded_at, raw_text, language,
            village_name, district, state, people_affected,
            severity, severity_score, need_category,
            immediate_action, allocation_suggestion,
            suggested_resources, lat, lng, image_path
        ) VALUES (
            :uploaded_by, :uploaded_at, :raw_text, :language,
            :village_name, :district, :state, :people_affected,
            :severity, :severity_score, :need_category,
            :immediate_action, :allocation_suggestion,
            :suggested_resources, :lat, :lng, :image_path
        )
    """, {
        "uploaded_by":            data.get("uploaded_by", "Field Worker"),
        "uploaded_at":            datetime.utcnow().isoformat(),
        "raw_text":               data.get("raw_text"),
        "language":               data.get("language"),
        "village_name":           data.get("village_name"),
        "district":               data.get("district"),
        "state":                  data.get("state"),
        "people_affected":        data.get("people_affected"),
        "severity":               data.get("severity"),
        "severity_score":         data.get("severity_score"),
        "need_category":          data.get("need_category"),
        "immediate_action":       1 if data.get("immediate_action_needed") else 0,
        "allocation_suggestion":  data.get("allocation_suggestion"),
        "suggested_resources":    json.dumps(data.get("suggested_resources", [])),
        "lat":                    data.get("lat"),
        "lng":                    data.get("lng"),
        "image_path":             data.get("image_path"),
    })
    conn.commit()
    survey_id = cur.lastrowid
    conn.close()
    return survey_id

def get_all_surveys() -> list:
    """Return all surveys ordered by newest first."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM surveys ORDER BY uploaded_at DESC"
    ).fetchall()
    conn.close()
    result = []
    for row in rows:
        d = dict(row)
        d["suggested_resources"] = json.loads(d.get("suggested_resources") or "[]")
        d["immediate_action_needed"] = bool(d.pop("immediate_action", 0))
        result.append(d)
    return result

def get_survey_by_id(survey_id: int) -> dict | None:
    """Return one survey or None."""
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM surveys WHERE id = ?", (survey_id,)
    ).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["suggested_resources"] = json.loads(d.get("suggested_resources") or "[]")
    d["immediate_action_needed"] = bool(d.pop("immediate_action", 0))
    return d

def get_dashboard_stats() -> dict:
    """Aggregate stats — keys match what frontend StatsGrid expects."""
    conn = get_connection()

    total = conn.execute("SELECT COUNT(*) FROM surveys").fetchone()[0]

    critical = conn.execute(
        "SELECT COUNT(*) FROM surveys WHERE severity = 'CRITICAL'"
    ).fetchone()[0]

    high = conn.execute(
        "SELECT COUNT(*) FROM surveys WHERE severity = 'HIGH'"
    ).fetchone()[0]

    people = conn.execute(
        "SELECT COALESCE(SUM(people_affected), 0) FROM surveys"
    ).fetchone()[0]

    need_rows = conn.execute(
        "SELECT need_category, COUNT(*) as cnt FROM surveys GROUP BY need_category"
    ).fetchall()

    conn.close()

    return {
        "total_surveys":          total,
        "critical_cases":         critical,       # ← frontend StatsGrid key
        "high_priority":          high,            # ← frontend StatsGrid key
        "total_people_affected":  people,          # ← frontend StatsGrid key
        "category_breakdown": [
            {"category": r["need_category"], "count": r["cnt"]}
            for r in need_rows if r["need_category"]
        ],
    }
def get_heatmap_data() -> list:
    """Return surveys that have coordinates for the map."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT village_name, district, need_category, severity, people_affected, lat, lng "
        "FROM surveys WHERE lat IS NOT NULL AND lng IS NOT NULL"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]
