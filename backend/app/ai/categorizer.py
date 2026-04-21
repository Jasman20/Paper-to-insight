import google.generativeai as genai
import json
import os
from app.config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

SEVERITY_PROMPT = """
You are an expert NGO resource allocation specialist working in rural India.
Analyze this community survey data and provide a detailed assessment.

Primary Need: {primary_need}
Description: {description}
People Affected: {people_affected}
Urgency Indicators: {urgency_indicators}
Village: {village_name}, {district}, {state}

Return ONLY this JSON — no extra text, no markdown:
{{
    "need_category": "FOOD or WATER or MEDICAL or SHELTER or EDUCATION or SANITATION or LIVELIHOOD or OTHER",
    "severity": "LOW or MEDIUM or HIGH or CRITICAL",
    "severity_score": number from 1 to 10,
    "severity_reasoning": "one sentence explaining the score",
    "immediate_action_needed": true or false,
    "suggested_resources": [
        {{"item": "resource name", "quantity": "amount with unit", "priority": "IMMEDIATE or WITHIN_WEEK or WITHIN_MONTH"}}
    ],
    "estimated_cost_inr": "range like 50000-80000",
    "allocation_suggestion": "2-3 sentence action plan"
}}

Score guide: LOW=1-3, MEDIUM=4-5, HIGH=6-7, CRITICAL=8-10
"""

def categorize_and_score(extracted_data: dict) -> dict:
    try:
        model  = genai.GenerativeModel("gemini-1.5-flash")
        prompt = SEVERITY_PROMPT.format(
            primary_need       = extracted_data.get("primary_need", "OTHER"),
            description        = extracted_data.get("description", "No description"),
            people_affected    = extracted_data.get("people_affected", "unknown"),
            urgency_indicators = extracted_data.get("urgency_indicators", []),
            village_name       = extracted_data.get("village_name", ""),
            district           = extracted_data.get("district", ""),
            state              = extracted_data.get("state", ""),
        )
        response = model.generate_content(prompt)
        text = response.text.strip()

        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        result = json.loads(text)
        print(f"✅ Categorized: {result.get('need_category')} | {result.get('severity')} ({result.get('severity_score')}/10)")
        return result

    except Exception as e:
        print(f"❌ Categorizer error: {e}")
        return {
            "need_category":          "OTHER",
            "severity":               "MEDIUM",
            "severity_score":         5,
            "severity_reasoning":     "Could not analyze",
            "immediate_action_needed": False,
            "suggested_resources":    [],
            "estimated_cost_inr":     "unknown",
            "allocation_suggestion":  "Manual review required",
        }