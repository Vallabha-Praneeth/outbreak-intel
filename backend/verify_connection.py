import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load env from .env file explicitly
load_dotenv(".env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

print(f"URL: {url}")
print(f"Key present: {bool(key)}")
print(f"Service Key present: {bool(service_key)}")

if not url or not key:
    print("Error: Missing credentials")
    exit(1)

# Try with Anon Key first
print("\n--- Testing with Anon Key ---")
try:
    client: Client = create_client(url, key)
    # Try to select from sources
    res = client.table("sources").select("*").limit(1).execute()
    print("Success! 'sources' table exists.")
    print(f"Data: {res.data}")
except Exception as e:
    print(f"Error with Anon Key: {e}")
    # Check if it is a missing table error
    if "relation" in str(e) and "does not exist" in str(e):
        print("DIAGNOSIS: Database schema missing.")
    elif "401" in str(e) or "403" in str(e):
        print("DIAGNOSIS: Permission denied (RLS).")

# Try with Service Key if available
if service_key:
    print("\n--- Testing with Service Key ---")
    try:
        client_admin: Client = create_client(url, service_key)
        res = client_admin.table("sources").select("*").limit(1).execute()
        print("Success! Service Role access works.")
        print(f"Data: {res.data}")
    except Exception as e:
        print(f"Error with Service Key: {e}")
