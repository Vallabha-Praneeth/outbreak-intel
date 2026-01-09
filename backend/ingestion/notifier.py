import os
from datetime import datetime
from db_client import SupabaseClient

class Notifier:
    def __init__(self):
        self.db = SupabaseClient()

    def send_alert(self, type: str, severity: str, message: str):
        """
        Logs an alert to the database.
        Future: Integrate Email/Slack here.
        """
        print(f"[{severity.upper()}] ALERT: {message}")
        
        try:
            data = {
                "type": type,
                "severity": severity,
                "message": message,
                "created_at": datetime.now().isoformat(),
                "is_read": False
            }
            res = self.db.client.table("alerts").insert(data).execute()
            print(f"Alert saved to DB: {res.data}")
            return True
        except Exception as e:
            print(f"Failed to save alert to DB: {e}")
            return False

# Usage Example:
# notifier = Notifier()
# notifier.send_alert("confirmed_outbreak", "critical", "New Ebola case detected in DRC.")
