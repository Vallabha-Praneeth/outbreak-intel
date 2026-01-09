import os
from dotenv import load_dotenv

# Load env variables FIRST
load_dotenv(".env")

from ingestion.processor import EventProcessor

processor = EventProcessor()

sample_text = """
The Ministry of Health in the Democratic Republic of the Congo (DRC) has reported 15 new confirmed cases of Ebola Virus Disease in the North Kivu province. 
WHO is coordinating with local health officials to set up treatment centers.
"""

print(f"Testing with text: {sample_text.strip()}")
print("-" * 50)

# Create a dummy raw event
raw_event = {
    "title": "Ebola outbreak update in DRC",
    "content": sample_text,
    "id": "test-123"
}

# Process using tier 1 (WHO) assumption
result = processor.process(raw_event, source_tier=1)

print("\n--- AI Extraction Result ---")
print(f"Diseases: {result['diseases']}")
print(f"Locations: {result['locations']}")
print(f"Classification: {result['classification']} (Conf: {result['confidence']})")
print(f"Assessment: {result['assessment_text']}")
