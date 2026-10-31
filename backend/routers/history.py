"""
History and Ephemeral Session Router
Provides in-memory temporary session helper for privacy-first, guest-first usage.
All permanent user lists and configured routines are persisted client-side in localStorage.
Zero server-side accounts or databases are maintained.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
import time

router = APIRouter(prefix="/api/history", tags=["Guest Session & Privacy"])

# In-memory ephemeral session store (temporary, non-account-linked)
HISTORY_STORE: Dict[str, List[Dict[str, Any]]] = {
    "skin_analyses": [],
    "hair_analyses": [],
    "saved_looks": [],
    "saved_routines": []
}

class SaveLookRequest(BaseModel):
    title: str
    category: str
    effect_id: str
    styled_image_url: str
    parameters: Dict[str, Any] = {}

@router.get("/summary")
def get_history_summary():
    """Returns counts of saved consultations and looks."""
    return {
        "skin_analyses_count": len(HISTORY_STORE["skin_analyses"]),
        "hair_analyses_count": len(HISTORY_STORE["hair_analyses"]),
        "saved_looks_count": len(HISTORY_STORE["saved_looks"]),
        "storage_mode": "Guest-First (Local browser persistence; zero server user accounts)"
    }

@router.post("/looks")
def save_look(payload: SaveLookRequest):
    """Saves a beauty look to the user's history."""
    item = {
        "id": f"look_{int(time.time()*1000)}",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        **payload.dict()
    }
    HISTORY_STORE["saved_looks"].insert(0, item)
    return {"status": "success", "look": item}

@router.get("/looks")
def list_saved_looks():
    """Lists saved beauty looks."""
    return HISTORY_STORE["saved_looks"]

@router.delete("/purge")
def purge_user_data():
    """
    Permanently deletes all stored consultation records, saved looks, and image references.
    """
    HISTORY_STORE["skin_analyses"].clear()
    HISTORY_STORE["hair_analyses"].clear()
    HISTORY_STORE["saved_looks"].clear()
    HISTORY_STORE["saved_routines"].clear()
    return {
        "status": "success",
        "message": "All session data, photos, and analysis history have been permanently purged."
    }
