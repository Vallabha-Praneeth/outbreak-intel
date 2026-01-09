import os
import math
from datetime import datetime, timedelta
from db_client import SupabaseClient
from ingestion.notifier import Notifier

class IntelligenceAnalyzer:
    def __init__(self):
        self.db = SupabaseClient()
        self.notifier = Notifier()

    def detect_anomalies(self, lookback_days=30):
        """
        Detects anomalies by comparing signal frequency in the last 24h 
        against the average frequency of the lookback period.
        """
        # 1. Fetch historical counts by day
        # In a real app, this would be a GROUP BY query on published_at
        # For now, we'll fetch all events in range and aggregate in Python
        cutoff = (datetime.now() - timedelta(days=lookback_days)).isoformat()
        
        try:
            response = self.db.client.table("normalized_events") \
                .select("id, published_at, classification") \
                .gt("published_at", cutoff) \
                .execute()
            
            events = response.data
            if not events:
                return []

            # 2. Aggregate counts by day
            daily_counts = {}
            for event in events:
                date_str = event['published_at'][:10] # YYYY-MM-DD
                daily_counts[date_str] = daily_counts.get(date_str, 0) + 1

            # 3. Calculate Mean and Standard Deviation
            counts = list(daily_counts.values())
            if len(counts) < 2:
                return []

            mean = sum(counts) / len(counts)
            variance = sum((x - mean) ** 2 for x in counts) / len(counts)
            std_dev = math.sqrt(variance)

            # 4. Check if today's count is an anomaly (Z-score > 2)
            today_str = datetime.now().isoformat()[:10]
            today_count = daily_counts.get(today_str, 0)
            
            z_score = (today_count - mean) / std_dev if std_dev > 0 else 0
            
            results = []
            if z_score > 2:
                anomaly = {
                    "type": "global_spike",
                    "severity": "critical" if z_score > 3 else "high",
                    "message": f"Global signal volume spike detected. Current volume: {today_count}, Z-score: {z_score:.2f}",
                    "timestamp": datetime.now().isoformat()
                }
                results.append(anomaly)
                # Send alert immediately
                self.notifier.send_alert("anomaly_volume", anomaly["severity"], anomaly["message"])

            return results

        except Exception as e:
            print(f"Analysis Error: {e}")
            return []

if __name__ == "__main__":
    analyzer = IntelligenceAnalyzer()
    anomalies = analyzer.detect_anomalies()
    for a in anomalies:
        print(f"[{a['severity'].upper()}] {a['message']}")
