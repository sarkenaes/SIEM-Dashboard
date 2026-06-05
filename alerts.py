import sqlite3
DB_PATH="siem.db"
def check_brute_force():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory= sqlite3.Row
    cursor =conn.cursor()
    cursor.execute("""
        SELECT source_ip, COUNT(*) as attempts
        FROM events
        WHERE severity ='high'
        AND message LIKE '%Failed password%'
        GROUP BY source_ip
        HAVING COUNT(*) >=3
""")
    rows =cursor.fetchall()
    conn.close()
    alerts =[]
    for row in rows:
        alerts.append({
            "type":"brute_force",
            "source_ip" : row["source_ip"],
            "attempts" : row["attempts"],
            "message" : f"Brute force detected from {row["source_ip"]}"
        })
    return alerts
if __name__ == "__main__":
        alerts =check_brute_force()
        for alert in alerts:
            print(alert)