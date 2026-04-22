from groq import Groq
from PIL import Image
import pytesseract
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

# 🔑 Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ⚙️ Tesseract path (IMPORTANT)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

OCR_PROMPT = """
You are an expert at reading handwritten field survey forms from rural India.

Extract ALL information and return ONLY raw JSON.

{
    "village_name": "village name or null",
    "district": "district name or null",
    "state": "state name or null",
    "people_affected": number,
    "primary_need": "MEDICAL",
    "description": "summary",
    "urgency_indicators": [],
    "other_needs": [],
    "surveyor_name": "name or null",
    "survey_date": "date or null",
    "raw_text": "text",
    "language_detected": "Hindi/English/Mixed",
    "confidence": "HIGH/MEDIUM/LOW"
}
"""

def extract_survey_data(image_path: str) -> dict:
    FALLBACK = {
        "raw_text": None, "language_detected": None,
        "confidence": "LOW", "village_name": None,
        "district": None, "state": None,
        "people_affected": None, "primary_need": "OTHER",
        "description": "Could not read survey image",
        "urgency_indicators": [], "other_needs": [],
    }

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("❌ GROQ_API_KEY not set!")
            return FALLBACK

        # 🔹 Step 1: OCR
        img = Image.open(image_path)
        extracted_text = pytesseract.image_to_string(img)

        if not extracted_text.strip():
            return FALLBACK

        # 🔹 Step 2: Send text to Groq
        prompt = f"""
        {OCR_PROMPT}

        Survey Text:
        {extracted_text}
        """

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )

        raw = response.choices[0].message.content.strip()

        print(f"\n📋 Groq raw response:\n{raw[:500]}\n")

        result = None

        # JSON extraction
        try:
            result = json.loads(raw)
        except:
            pass

        if not result:
            match = re.search(r'\{[\s\S]*\}', raw)
            if match:
                try:
                    result = json.loads(match.group())
                except:
                    pass

        if result:
            print(f"✅ Vision OK: {result.get('village_name')} | {result.get('primary_need')} | {result.get('people_affected')} people")
            return result
        else:
            print("❌ JSON parse failed")
            return FALLBACK

    except Exception as e:
        print(f"❌ Vision exception: {type(e).__name__}: {e}")
        return FALLBACK