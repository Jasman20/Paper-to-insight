import json, re, os
from groq import Groq
from PIL import Image
import pytesseract
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
        # Step 1: OCR with Tesseract
        img = Image.open(image_path)
        extracted_text = pytesseract.image_to_string(img)
        print(f"\n📄 OCR Text:\n{extracted_text[:300]}\n")

        if not extracted_text.strip():
            print("❌ OCR returned empty text")
            return FALLBACK

        # Step 2: Send to Groq text model
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{
                "role": "user",
                "content": f"""You are an expert at reading field survey forms from rural India.
Extract information from this survey text and return ONLY raw JSON with no markdown or explanation.

IMPORTANT RULES:
- primary_need must be exactly one of: MEDICAL, FOOD, WATER, SHELTER, OTHER
- Choose WATER if text mentions: water, pump, hand pump, borewell, drinking water, water shortage
- Choose FOOD if text mentions: food, hunger, ration, dal, rice, famine, starvation  
- Choose MEDICAL if text mentions: medical, disease, hospital, medicine, health, doctor
- Choose SHELTER if text mentions: shelter, house, roof, flood damage, homeless
- people_affected must be a number (just digits) or null

Survey Text:
{extracted_text}

Return this exact JSON structure:
{{
    "village_name": "village name or null",
    "district": "district name or null",
    "state": "state name or null",
    "people_affected": 0,
    "primary_need": "WATER",
    "description": "one sentence summary",
    "urgency_indicators": ["phrase1", "phrase2"],
    "other_needs": [],
    "surveyor_name": "name or null",
    "survey_date": "date or null",
    "raw_text": "full survey text",
    "language_detected": "English",
    "confidence": "HIGH"
}}"""
            }]
        )

        raw = response.choices[0].message.content.strip()
        print(f"\n📋 Groq response:\n{raw[:500]}\n")

        result = None
        try:
            result = json.loads(raw)
        except:
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
