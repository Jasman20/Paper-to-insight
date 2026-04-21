import google.generativeai as genai
from PIL import Image
import json
import os
from app.config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

OCR_PROMPT = """
You are an expert at reading handwritten field survey forms from rural India.
Look at this image carefully and extract ALL information you can read.

Return ONLY this JSON — no extra text, no markdown backticks, no explanation:
{
    "village_name": "village name or null",
    "district": "district name or null",
    "state": "state name or null",
    "people_affected": number or null,
    "primary_need": "FOOD or WATER or MEDICAL or SHELTER or EDUCATION or SANITATION or OTHER",
    "description": "full problem description in English",
    "urgency_indicators": ["list of urgent words found"],
    "other_needs": ["any secondary needs"],
    "surveyor_name": "name if mentioned or null",
    "survey_date": "date if mentioned or null",
    "raw_text": "complete text you could read from the image",
    "language_detected": "Hindi or English or Marathi etc",
    "confidence": "HIGH or MEDIUM or LOW"
}
If you cannot read something clearly, use null.
"""

def extract_survey_data(image_path: str) -> dict:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        img   = Image.open(image_path)
        response = model.generate_content([OCR_PROMPT, img])
        text = response.text.strip()

        # Clean markdown fences if Gemini wraps in ```json
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        result = json.loads(text)
        print(f"✅ Vision extracted: {result.get('village_name')} | {result.get('primary_need')}")
        return result

    except Exception as e:
        print(f"❌ Vision error: {e}")
        return {
            "raw_text": None,
            "language_detected": None,
            "confidence": "LOW",
            "village_name": None,
            "district": None,
            "state": None,
            "people_affected": None,
            "primary_need": "OTHER",
            "description": "Could not read survey",
            "urgency_indicators": [],
            "other_needs": [],
        }
