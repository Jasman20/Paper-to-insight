# Survey routes — replaces Firebase writes with SQLite inserts
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.db.database import insert_survey, get_all_surveys, get_survey_by_id
from app.services.geocoder import geocode_village
from app.ai.vision import extract_survey_data
from app.ai.categorizer import categorize_and_score
from app.ai.allocator import suggest_resources
import shutil, os, uuid

router = APIRouter(prefix="/api/survey")

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_survey(
    survey_image: UploadFile = File(...),
    uploaded_by: str = Form("Field Worker"),
):
    # Save image to disk
    ext       = os.path.splitext(survey_image.filename)[-1] or ".jpg"
    filename  = f"{uuid.uuid4().hex}{ext}"
    filepath  = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(survey_image.file, f)

    # AI pipeline
    extracted   = extract_survey_data(filepath)      or {}
    assessment  = categorize_and_score(extracted)    or {}
    resources   = suggest_resources(assessment)      or {}

    # Geocode via LocationIQ
    coords = await geocode_village(
        extracted.get("village_name", ""),
        extracted.get("district", ""),
        extracted.get("state", ""),
    )

    # Persist to SQLite
    record = {
        "uploaded_by":            uploaded_by,
        "raw_text":               extracted.get("raw_text"),
        "language":               extracted.get("language_detected"),
        "village_name":           extracted.get("village_name"),
        "district":               extracted.get("district"),
        "state":                  extracted.get("state"),
        "people_affected":        extracted.get("people_affected"),
        "severity":               assessment.get("severity"),
        "severity_score":         assessment.get("severity_score"),
        "need_category":          assessment.get("need_category"),
        "immediate_action_needed":assessment.get("immediate_action_needed", False),
        "allocation_suggestion":  resources.get("allocation_suggestion") or assessment.get("allocation_suggestion"),
        "suggested_resources":    resources.get("suggested_resources", []),
        "lat":                    coords["lat"] if coords else None,
        "lng":                    coords["lng"] if coords else None,
        "image_path":             filepath,
    }
    survey_id = insert_survey(record)

    return {
        "id":         survey_id,
        "extracted":  {
            "raw_text":          extracted.get("raw_text"),
            "language_detected": extracted.get("language_detected"),
            "village_name":      extracted.get("village_name"),
            "district":          extracted.get("district"),
            "people_affected":   extracted.get("people_affected"),
        },
        "assessment": {
            "severity":               assessment.get("severity"),
            "severity_score":         assessment.get("severity_score"),
            "need_category":          assessment.get("need_category"),
            "immediate_action_needed":assessment.get("immediate_action_needed", False),
            "allocation_suggestion":  record["allocation_suggestion"],
            "suggested_resources":    record["suggested_resources"],
        },
    }

@router.get("/all")
def list_surveys():
    return get_all_surveys()

@router.get("/{survey_id}")
def get_survey(survey_id: int):
    survey = get_survey_by_id(survey_id)
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    return survey
