from groq import Groq
import json
import re
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SEVERITY_PROMPT = """
You are an expert NGO resource allocation specialist for rural India.

Analyze and return ONLY JSON:

Survey:
- Primary Need: {primary_need}
- Description: {description}
- People Affected: {people_affected}
- Urgency Words: {urgency_indicators}
- Location: {village_name}, {district}, {state}

{{
    "need_category": "MEDICAL or FOOD or WATER or SHELTER or OTHER",
    "severity": "LOW or MEDIUM or HIGH or CRITICAL",
    "severity_score": 1-10,
    "severity_reasoning": "one sentence explanation",
    "immediate_action_needed": true or false,
    "suggested_resources": ["resource1", "resource2"],
    "estimated_cost_inr": "estimated range",
    "allocation_suggestion": "specific action to take"
}}

Base severity on urgency, people affected, and need type.
"""
FALLBACK = {
    "need_category": "OTHER",
    "severity": "MEDIUM",
    "severity_score": 5,
    "severity_reasoning": "Could not analyze",
    "immediate_action_needed": False,
    "suggested_resources": [],
    "estimated_cost_inr": "unknown",
    "allocation_suggestion": "Manual review required",
}

def categorize_and_score(extracted_data: dict) -> dict:
    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("❌ GROQ_API_KEY not set!")
            return FALLBACK

        prompt = SEVERITY_PROMPT.format(
            primary_need       = extracted_data.get("primary_need") or "OTHER",
            description        = extracted_data.get("description") or "No description",
            people_affected    = extracted_data.get("people_affected") or "unknown",
            urgency_indicators = extracted_data.get("urgency_indicators") or [],
            village_name       = extracted_data.get("village_name") or "",
            district           = extracted_data.get("district") or "",
            state              = extracted_data.get("state") or "",
        )

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )

        raw = response.choices[0].message.content.strip()

        print(f"\n🤖 Groq response:\n{raw[:400]}\n")

        result = None

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
            print(f"✅ Categorized: {result.get('need_category')} | {result.get('severity')}")
            return result
        else:
            return FALLBACK

    except Exception as e:
        print(f"❌ Categorizer exception: {type(e).__name__}: {e}")
        return FALLBACK
