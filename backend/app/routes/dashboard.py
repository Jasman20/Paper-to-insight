# Dashboard routes — reads from SQLite instead of Firestore
from fastapi import APIRouter
from app.db.database import get_dashboard_stats, get_heatmap_data
from app.utils.severity_colors import SEVERITY_COLORS

router = APIRouter(prefix="/api/dashboard")

@router.get("/stats")
def dashboard_stats():
    return get_dashboard_stats()

@router.get("/heatmap-data")
@router.get("/heatmap-data")
def heatmap_data():
    rows = get_heatmap_data()
    COLORS = {
        "CRITICAL": "#ef4444",
        "HIGH":     "#f97316",
        "MEDIUM":   "#eab308",
        "LOW":      "#22c55e",
    }
    markers = []
    for row in rows:
        markers.append({
            "lat":         row["lat"],
            "lng":         row["lng"],
            "village":     row.get("village_name"),
            "need":        row.get("need_category"),
            "severity":    row.get("severity"),
            "people":      row.get("people_affected"),
            "description": row.get("description", ""),
            "color":       COLORS.get(str(row.get("severity", "")).upper(), "#94a3b8"),
        })
    return {"markers": markers}  # ← frontend HeatMap expects {markers: [...]}