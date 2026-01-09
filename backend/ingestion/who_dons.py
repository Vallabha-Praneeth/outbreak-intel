import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any
import datetime
import re
import dateutil.parser
from processor import EventProcessor
from db_client import SupabaseClient

class WHODonIngestor:
    """
    Ingestor for WHO Disease Outbreak News (DONs).
    Uses the official RESTful API as the primary source.
    """
    API_URL = "https://www.who.int/api/news/diseaseoutbreaknews"
    BASE_URL = "https://www.who.int"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.processor = EventProcessor()
        self.db = SupabaseClient() if not dry_run else None

    def fetch_latest(self) -> List[Dict[str, Any]]:
        """Fetch and parse the latest DONs from the official API."""
        print(f"Fetching WHO DONs via API from {self.API_URL}...")
        
        try:
            response = requests.get(self.API_URL, headers=self.HEADERS, timeout=15)
            if response.status_code == 200:
                data = response.json()
                return self._parse_api_response(data)
            else:
                print(f"API returned status {response.status_code}. Falling back to scraping...")
                return self._fetch_via_scraping()
        except Exception as e:
            print(f"API Error: {e}. Falling back to scraping...")
            return self._fetch_via_scraping()

    def _parse_api_response(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse the WHO API JSON response."""
        events = []
        items = data.get("value", []) if isinstance(data, dict) else data
        
        for item in items:
            url = item.get("Url") or item.get("link") or item.get("OData__ItemUrl") or item.get("ItemDefaultUrl")
            
            if url and not url.startswith("http"):
                u = url.lstrip("/")
                url = f"{self.BASE_URL}/{u}"
            
            events.append({
                "external_id": str(item.get("Id") or url),
                "title": item.get("Title") or item.get("title"),
                "content": item.get("Summary") or item.get("Title"),
                "raw_url": url,
                "published_at": item.get("PublicationDate") or item.get("date")
            })
        return events

    def _fetch_via_scraping(self) -> List[Dict[str, Any]]:
        """Verified scraping method as fallback."""
        index_url = "https://www.who.int/emergencies/disease-outbreak-news"
        try:
            response = requests.get(index_url, headers=self.HEADERS, timeout=15)
            response.raise_for_status()
            return self._parse_html(response.text)
        except Exception as e:
            print(f"Scraping Error: {e}")
            return []

    def _parse_html(self, html: str) -> List[Dict[str, Any]]:
        """Parse the WHO DONs index page HTML."""
        soup = BeautifulSoup(html, "lxml")
        events = []
        items = soup.find_all("a", class_=re.compile(r"list-vertical__item|list-view--item"))
        
        if not items:
            items = soup.find_all("a", href=re.compile(r"/emergencies/disease-outbreak-news/item/"))

        for item in items:
            url = item.get("href")
            if url and not url.startswith("http"):
                url = self.BASE_URL + url if url.startswith("/") else url
            
            title_elem = item.find("span", class_="full-title") or item.find("h4")
            title = title_elem.get_text(strip=True) if title_elem else item.get_text(strip=True)
            
            date_match = re.search(r"(\d{1,2}\s+[A-Z][a-z]+\s+\d{4})", item.get_text())
            date_str = date_match.group(1) if date_match else ""

            events.append({
                "external_id": url,
                "title": title,
                "content": title,
                "raw_url": url,
                "published_at": date_str
            })
        return events

    def _parse_date(self, date_str: str) -> str:
        """Parse WHO date strings into ISO format."""
        if not date_str:
            return datetime.datetime.now().isoformat()
        try:
            # Handle formats like "8 January 2024" or API ISO strings
            dt = dateutil.parser.parse(date_str)
            return dt.isoformat()
        except Exception:
            return datetime.datetime.now().isoformat()

    def run(self):
        raw_events = self.fetch_latest()
        print(f"Fetched {len(raw_events)} events.")
        
        source_id = None
        if not self.dry_run:
            source_id = self.db.upsert_source(
                name="WHO Disease Outbreak News",
                url="https://www.who.int/emergencies/disease-outbreak-news",
                tier=1,
                source_type="Web"
            )

        for e in raw_events:
            # Clean up published_at
            e['published_at'] = self._parse_date(e['published_at'])
            
            # Normalize and classify
            processed = self.processor.process(e, source_tier=1)
            
            if self.dry_run:
                print(f"--- Event: {processed['title']} ---")
                print(f"    Date: {e['published_at']}")
                print(f"    Diseases: {', '.join(processed['diseases']) or 'None detected'}")
                print(f"    Locations: {', '.join(processed['locations']) or 'None detected'}")
                print(f"    Classification: {processed['classification']} (Conf: {processed['confidence']})")
                print(f"    Reason: {processed['assessment_text']}\n")
            else:
                if source_id:
                    print(f"Storing: {processed['title']}...")
                    raw_id = self.db.insert_raw_event(source_id, e)
                    if raw_id:
                        self.db.insert_normalized_event(raw_id, processed)
                else:
                    print("Error: Could not obtain source_id. Check Supabase connection.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Fetch and print without saving to DB")
    args = parser.parse_args()
    
    ingestor = WHODonIngestor(dry_run=args.dry_run)
    ingestor.run()
