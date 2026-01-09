import os
import sys
from datetime import datetime
from who_dons import WHODonIngestor
from analyzer import IntelligenceAnalyzer

def run_pipeline():
    print(f"[{datetime.now().isoformat()}] Starting Outbreak Intel Pipeline...")
    
    # 1. Scraping & Ingestion
    print("Step 1: Running WHO DONs Scraper...")
    scraper = WHODonIngestor()
    scraper.run()
    
    # 2. Analysis & Anomaly Detection
    print("Step 2: Analyzing signals for anomalies...")
    analyzer = IntelligenceAnalyzer()
    anomalies = analyzer.detect_anomalies()
    
    if anomalies:
        print(f"Found {len(anomalies)} anomalies!")
        # In the future, this could trigger email alerts or push to a 'alerts' table
        for a in anomalies:
            print(f"ALERT: {a['message']}")
    else:
        print("No critical anomalies detected.")

    print(f"[{datetime.now().isoformat()}] Pipeline complete.")

if __name__ == "__main__":
    run_pipeline()
