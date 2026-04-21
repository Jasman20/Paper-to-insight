# Geocoding via LocationIQ — replaces Google Maps Geocoding API
# Docs: https://locationiq.com/docs
import httpx
from app.config import Config

LOCATIONIQ_BASE = "https://us1.locationiq.com/v1/search"

async def geocode_village(village_name: str, district: str = "", state: str = "") -> dict | None:
    """
    Forward-geocode a village/district name using LocationIQ.
    Returns {"lat": float, "lng": float} or None if not found.
    """
    if not Config.LOCATIONIQ_API_KEY or Config.LOCATIONIQ_API_KEY.startswith("REPLACE"):
        return None

    query_parts = [p for p in [village_name, district, state, "India"] if p]
    query = ", ".join(query_parts)

    params = {
        "key":    Config.LOCATIONIQ_API_KEY,
        "q":      query,
        "format": "json",
        "limit":  1,
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(LOCATIONIQ_BASE, params=params)
            resp.raise_for_status()
            results = resp.json()
            if results:
                return {
                    "lat": float(results[0]["lat"]),
                    "lng": float(results[0]["lon"]),
                }
    except Exception as e:
        print(f"[geocoder] LocationIQ error: {e}")

    return None
