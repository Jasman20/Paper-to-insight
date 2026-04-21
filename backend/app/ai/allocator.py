# allocator.py — now handled inside categorizer.py
# This file just passes through the categorizer result
# No separate call needed since Gemini returns resources in one shot

def suggest_resources(assessment: dict) -> dict:
    """
    Resources are already inside the assessment from categorizer.
    This function just passes them through cleanly.
    """
    return {
        "suggested_resources":   assessment.get("suggested_resources", []),
        "allocation_suggestion": assessment.get("allocation_suggestion", ""),
        "estimated_cost_inr":    assessment.get("estimated_cost_inr", ""),
    }