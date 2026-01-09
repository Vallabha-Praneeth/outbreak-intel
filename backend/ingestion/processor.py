import re
from typing import Dict, List, Any, Optional

class EventProcessor:
    """
    Normalizes raw events using deterministic, explainable rules.
    Extracts diseases, locations, and assigns classifications.
    """

    # Expanded disease name mapping
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

    # Basic country and region mapping
    # In a real app, this would use a database or GeoJSON, but for this MVP, we'll use common ones
    # or just extract capitalized words that aren't disease names.
    # For now, let's add a list of common countries appearing in DONs.
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
        pass

    def extract_diseases(self, text: str) -> List[str]:
        """Extract primary diseases mentioned in the text."""
        found = []
        for disease, keywords in self.DISEASE_KEYWORDS.items():
            for kw in keywords:
                if re.search(rf"\b{kw}\b", text, re.I):
                    found.append(disease)
                    break
        return found

    def extract_locations(self, text: str) -> List[str]:
        """Extract countries mentioned in the text."""
        found = []
        for country in self.COUNTRIES:
            if re.search(rf"\b{country}\b", text):
                found.append(country)
        return found

    def classify_event(self, source_tier: int, content: str, title: str) -> Dict[str, Any]:
        """
        Deterministic classification logic.
        Tier 1 (WHO) is always confirmed_outbreak.
        """
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
        diseases = self.extract_diseases(full_text)
        locations = self.extract_locations(full_text)
        assessment = self.classify_event(source_tier, raw_event['content'], raw_event['title'])

        return {
            "title": raw_event['title'],
            "diseases": diseases,
            "locations": locations,
            "classification": assessment['classification'],
            "confidence": assessment['confidence'],
            "assessment_text": assessment['reason'],
            "raw_event_id": raw_event.get("id"), # To be filled after DB insertion
            "source_tier": source_tier
        }
