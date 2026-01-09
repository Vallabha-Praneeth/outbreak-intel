import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Dict, Any, List, Optional

load_dotenv()

class SupabaseClient:
    """
    Wrapper for Supabase operations.
    Handles storage of raw and normalized events.
    """
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            print("Warning: SUPABASE_URL or SUPABASE_KEY not set in environment.")
        self.client: Client = create_client(url, key) if url and key else None

    def upsert_source(self, name: str, url: str, tier: int, source_type: str) -> Optional[str]:
        """Insert or update a source and return its ID."""
        if not self.client: return None
        data = {
            "name": name,
            "url": url,
            "tier": tier,
            "type": source_type
        }
        res = self.client.table("sources").upsert(data, on_conflict="url").execute()
        if res.data:
            return res.data[0]["id"]
        return None

    def insert_raw_event(self, source_id: str, event_data: Dict[str, Any]) -> Optional[str]:
        """Insert a raw event and return its ID."""
        if not self.client: return None
        data = {
            "source_id": source_id,
            "external_id": event_data["external_id"],
            "content": event_data["content"],
            "raw_url": event_data["raw_url"],
            "published_at": event_data["published_at"]
        }
        try:
            res = self.client.table("raw_events").upsert(data, on_conflict="source_id, external_id").execute()
            if res.data:
                return res.data[0]["id"]
        except Exception as e:
            print(f"Error inserting raw event: {e}")
        return None

    def insert_normalized_event(self, raw_event_id: str, processed_data: Dict[str, Any]) -> Optional[str]:
        """Insert normalized event and its relations."""
        if not self.client: return None
        
        # 1. Insert normalized event
        event_data = {
            "raw_event_id": raw_event_id,
            "title": processed_data["title"],
            "summary": processed_data.get("summary", processed_data["title"]),
            "signal_classification": processed_data["classification"],
            "confidence_score": processed_data["confidence"],
            "source_tier": processed_data["source_tier"]
        }
        res = self.client.table("normalized_events").insert(event_data).execute()
        if not res.data: return None
        
        event_id = res.data[0]["id"]
        
        # 2. Insert disease mentions
        for disease in processed_data.get("diseases", []):
            self.client.table("disease_mentions").insert({
                "event_id": event_id,
                "disease_name": disease,
                "is_primary": True
            }).execute()
            
        # 3. Insert location mentions
        for location in processed_data.get("locations", []):
            self.client.table("location_mentions").insert({
                "event_id": event_id,
                "country": location
            }).execute()

        # 4. Insert assessment
        self.client.table("outbreak_assessments").insert({
            "event_id": event_id,
            "assessment_text": processed_data["assessment_text"]
        }).execute()
        
        return event_id
