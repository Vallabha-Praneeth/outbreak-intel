import re
import os
import json
import google.generativeai as genai
from typing import Dict, List, Any, Optional

class EventProcessor:
    """
    Normalizes raw events.
    Uses Google Gemini for entity extraction if available, otherwise falls back to Regex.
    """

    # Expanded disease name mapping (Fallback)
    DISEASE_KEYWORDS = {
        "Cholera": ["Cholera"],
        "Mpox": ["Mpox", "monkeypox"],
        "Ebola": ["Ebola", "EVD"],
        "Dengue": ["Dengue", "DENV"],
        "Nipah": ["Nipah", "NiV"],
        "Avian Influenza": ["Avian Influenza", "H5N1", "H7N9", "H5N6", "H9N2"],
        "COVID-19": ["COVID-19", "Coronavirus", "SARS-CoV-2", "SARS-2"],
        "Oropouche": ["Oropouche", "OROV"],
        "Zika": ["Zika", "ZIKV"],
        "Polio": ["Polio", "Poliomyelitis", "cVDPV2", "WPV1"],
        "Marburg": ["Marburg", "MVD"],
        "Lassa Fever": ["Lassa Fever"],
        "Yellow Fever": ["Yellow Fever"],
        "Anthrax": ["Anthrax"],
        "Measles": ["Measles"]
    }

    COUNTRIES = [
        "Afghanistan", "Angola", "Argentina", "Australia", "Bangladesh", "Benin", "Bolivia", "Brazil", 
        "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", 
        "Chile", "China", "Colombia", "Congo", "Costa Rica", "Côte d'Ivoire", "Cuba", "DRC", "Democratic Republic of the Congo",
        "Ecuador", "Egypt", "Ethiopia", "France", "Gabon", "Gambia", "Germany", "Ghana", "Guinea", "Guyana", 
        "Haiti", "India", "Indonesia", "Iraq", "Italy", "Japan", "Jordan", "Kazakhstan", "Kenya", "Laos", 
        "Liberia", "Madagascar", "Malawi", "Malaysia", "Mali", "Mauritania", "Mexico", "Mongolia", "Morocco", 
        "Mozambique", "Myanmar", "Namibia", "Nepal", "Niger", "Nigeria", "Pakistan", "Panama", "Papua New Guinea", 
        "Paraguay", "Peru", "Philippines", "Rwanda", "Saudi Arabia", "Senegal", "Sierra Leone", "Somalia", 
        "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Tanzania", "Thailand", "Togo", "Uganda", 
        "United Kingdom", "USA", "United States", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
    ]

    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            print("EventProcessor: AI Mode Enabled (Gemini)")
        else:
            self.model = None
            print("EventProcessor: Regex Mode (Fallback) - GEMINI_API_KEY not found")

    def _extract_with_llm(self, text: str) -> Dict[str, Any]:
        """Extract entities using Gemini API."""
        prompt = f"""
        Analyze the following health alert text and extract:
        1. Primary Diseases mentioned (list of strings). Normalize names (e.g., "H5N1" -> "Avian Influenza").
        2. Locations mentioned (list of countries).
        3. A brief 1-sentence assessment reason.
        4. A confidence score (0.0 to 1.0) regarding if this is an active outbreak.

        Output ONLY valid JSON.
        
        Text: "{text[:8000]}"
        
        JSON Structure:
        {{
            "diseases": ["name"],
            "locations": ["Country"],
            "assessment": "reason",
            "confidence": 0.95
        }}
        """
        try:
            response = self.model.generate_content(prompt)
            # Simple cleanup for markdown json blocks if present
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(raw_text)
        except Exception as e:
            print(f"LLM Extraction failed: {e}")
            return None

    def extract_diseases_regex(self, text: str) -> List[str]:
        """Fallback: Extract primary diseases mentioned in the text."""
        found = []
        for disease, keywords in self.DISEASE_KEYWORDS.items():
            for kw in keywords:
                if re.search(rf"\\b{kw}\\b", text, re.I):
                    found.append(disease)
                    break
        return list(set(found))

    def extract_locations_regex(self, text: str) -> List[str]:
        """Fallback: Extract countries mentioned in the text."""
        found = []
        for country in self.COUNTRIES:
            if re.search(rf"\\b{country}\\b", text):
                found.append(country)
        return list(set(found))

    def classify_event(self, source_tier: int, content: str, title: str) -> Dict[str, Any]:
        """Deterministic classification logic (Fallback)."""
        classification = "early_signal"
        confidence = 0.5
        reason = "Initial signal"

        if source_tier == 1:
            classification = "confirmed_outbreak"
            confidence = 1.0
            reason = "Official Tier 1 Source (WHO DONs)"
        elif source_tier == 2:
            case_match = re.search(r"(\d+)\s+(cases|deaths|infections)", content, re.I)
            if case_match:
                classification = "confirmed_outbreak"
                confidence = 0.8
                reason = f"Tier 2 source reporting {case_match.group(0)}"
            else:
                classification = "research_update"
                confidence = 0.9
                reason = "Tier 2 source research update (no case counts detected)"
        
        return {
            "classification": classification,
            "confidence": confidence,
            "reason": reason
        }

    def process(self, raw_event: Dict[str, Any], source_tier: int) -> Dict[str, Any]:
        full_text = f"{raw_event['title']} {raw_event['content']}"
        
        # Try LLM First
        llm_result = None
        if self.model:
            llm_result = self._extract_with_llm(full_text)
            
        if llm_result:
            diseases = llm_result.get("diseases", [])
            locations = llm_result.get("locations", [])
            assessment_text = llm_result.get("assessment", "AI Analyzed")
            confidence = float(llm_result.get("confidence", 0.5))
            
            # Map LLM confidence to classification
            classification = "early_signal"
            if source_tier == 1:
                classification = "confirmed_outbreak"
                confidence = 1.0 # Override for official sources
            elif confidence > 0.8:
                classification = "confirmed_outbreak"
            elif confidence < 0.3:
                classification = "research_update"

        else:
            # Fallback to Regex
            diseases = self.extract_diseases_regex(full_text)
            locations = self.extract_locations_regex(full_text)
            assessment = self.classify_event(source_tier, raw_event['content'], raw_event['title'])
            classification = assessment['classification']
            confidence = assessment['confidence']
            assessment_text = assessment['reason']

        return {
            "title": raw_event['title'],
            "diseases": diseases,
            "locations": locations,
            "classification": classification,
            "confidence": confidence,
            "assessment_text": assessment_text,
            "raw_event_id": raw_event.get("id"),
            "source_tier": source_tier
        }
