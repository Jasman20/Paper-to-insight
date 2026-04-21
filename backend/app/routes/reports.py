# Report generation route
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.db.database import get_all_surveys
import io, csv

router = APIRouter(prefix="/api/reports")

@router.get("/generate")
def generate_report():
    surveys = get_all_surveys()
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=[
        "id", "uploaded_at", "uploaded_by", "village_name", "district",
        "severity", "severity_score", "need_category", "people_affected",
        "immediate_action_needed", "allocation_suggestion",
    ])
    writer.writeheader()
    for s in surveys:
        writer.writerow({k: s.get(k, "") for k in writer.fieldnames})

    buf.seek(0)
    return StreamingResponse(
        io.BytesIO(buf.read().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=surveys_report.csv"},
    )
