import os
from dotenv import load_dotenv
from supabase import create_client, Client
import time

load_dotenv(".env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: Missing credentials")
    exit(1)

client: Client = create_client(url, key)

print("--- Checking 'diseases' table ---")
try:
    res = client.table("diseases").select("count", count="exact").execute()
    print(f"Diseases count: {res.count}")
except Exception as e:
    print(f"Error checking diseases: {e}")

print("\n--- Checking Write Permissions (Anon) ---")
try:
    # Try to insert a dummy source that will conflict or just be deleted
    # actually, use a random url to avoid conflict
    dummy_url = f"https://example.com/test_{int(time.time())}"
    res = client.table("sources").insert({
        "name": "Test Source",
        "url": dummy_url,
        "tier": 4,
        "type": "Web"
    }).execute()
    print("Write SUCCESS! Anon key has write permissions.")
    # cleanup
    if res.data:
        rid = res.data[0]['id']
        client.table("sources").delete().eq("id", rid).execute()
        print("Test record deleted.")
except Exception as e:
    print(f"Write FAILED: {e}")
