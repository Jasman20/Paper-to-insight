import json, re, os, base64
from groq import Groq
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
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")

        ext = image_path.split(".")[-1].lower()
        mime = "image/jpeg" if ext in ["jpg", "jpeg"] else "image/png"

        response = client.chat.completions.create(
            model="llama-4-scout-17b-16e-instruct",
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime};base64,{image_data}"
                        }
                    },
                    {
                        "type": "text",
                        "text": """You are an expert at reading handwritten field survey forms from rural India.
Read this survey image carefully and return ONLY raw JSON, no markdown, no explanation:

{
    "village_name": "village name or null",
    "district": "district name or null",
    "state": "state name or null",
    "people_affected": number or null,
    "primary_need": "MEDICAL or FOOD or WATER or SHELTER or OTHER",
    "description": "summary of the problem",
    "urgency_indicators": ["urgent phrases from form"],
    "other_needs": [],
    "surveyor_name": "name or null",
    "survey_date": "date or null",
    "raw_text": "all text you can read from the image",
    "language_detected": "Hindi/English/Mixed",
    "confidence": "HIGH/MEDIUM/LOW"
}

Choose primary_need based on content: WATER if water/pump issues, MEDICAL if health/disease, FOOD if hunger/rations, SHELTER if housing."""
                    }
                ]
            }]
        )

        raw = response.choices[0].message.content.strip()
        print(f"\n📋 Groq Vision response:\n{raw[:500]}\n")

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
