import requests
import os
from dotenv import load_dotenv
load_dotenv
ABUSEIPBD_KEY= os.getenv("ABUSEIPBD_KEY")
def check_ip(ip):
    if not ip:
        return None
    url = "https://api.abuseipdb.com/api/v2/check"
    headers ={
        "Key": ABUSEIPBD_KEY,
        "Accept": "application/json"
    }
    params ={
        "ipAddress": ip,
        "maxAgeInDays": 90
    }
    try:
        response = requests.get(url, headers= headers, params=params)
        data = response.json()
        return {
            "ip": ip,
            "abuse_score": data["data"]["abuseConfidenceScore"],
            "country": data["data"]["countryCode"],
            "is_malicious": data["data"]["abuseConfidenceScore"]> 50,
            "total_reports": data["data"]["totalReports"]
    }
    except Exception as e:
        print(f"Error checking IP{ip} : {e}")
        return None
if __name__ == "__main__":
    result= check_ip("198.51.100.5")
    print(result)
