import requests
ABUSEIPBD_KEY ="ff43cb8f8d93b87e26ec8b4caa80d44ec0798744e6ed4b422e763c901bfc5a8135bee187752b5372"
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
