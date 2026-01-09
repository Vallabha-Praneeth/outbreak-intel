import pandas as pd
import os
import time
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(".env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: Missing credentials")
    exit(1)

client: Client = create_client(url, key)

file_path = "List of infectious diseases.xlsx"

print(f"Reading {file_path}...")
try:
    df = pd.read_excel(file_path)
    # Clean NaN values
    df = df.fillna("")
except Exception as e:
    print(f"Error reading Excel: {e}")
    exit(1)

records_to_insert = []
print(f"Preparing {len(df)} records...")

for index, row in df.iterrows():
    # Map CSV columns to Schema columns
    record = {
        "name": row.get("Common name", "Unknown"),
        "pathogen_agent": row.get("Infectious agent", ""),
        "diagnostic_protocols": row.get("Diagnosis", ""),
        "treatment": row.get("Treatment", ""),
        "vaccine_status": row.get("Vaccine(s)", ""),
        # Defaults
        "symptoms": "Not specified in dataset",
        "classification_reason": "Manual Import",
        "severity_score": 5.0, # Default medium severity
        "total_case_count": 0,
        "total_death_count": 0,
        "tags": ["imported"]
    }
    records_to_insert.append(record)

# Batch insert in chunks of 50 to avoid timeouts/limits
BATCH_SIZE = 50
total_inserted = 0

print("Starting ingestion...")
for i in range(0, len(records_to_insert), BATCH_SIZE):
    batch = records_to_insert[i:i + BATCH_SIZE]
    try:
        # upsert based on name (which is unique in schema)
        res = client.table("diseases").upsert(batch, on_conflict="name").execute()
        total_inserted += len(batch)
        print(f"Inserted batch {i // BATCH_SIZE + 1} ({len(batch)} records). Total: {total_inserted}")
    except Exception as e:
        print(f"Error inserting batch {i}: {e}")
        # If bulk fails, try one by one for this batch (optional, but good for debugging)
        
print(f"Done! Successfully processed {total_inserted} records.")
