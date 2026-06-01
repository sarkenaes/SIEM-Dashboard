import sqlite3
DB_PATH= "siem.db"
def init_db():
    conn =sqlite3.connect(DB_PATH)
    cursor =conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            host   TEXT,
            message TEXT,
            severity TEXT,
            source_ip TEXT,
            log_type TEXT    )""")
    conn.commit()
    conn.close()
def insert_event(event):
    conn =sqlite3.connect(DB_PATH)
    cursor =conn.cursor()
    cursor.execute("""
        INSERT INTO events (timestamp,host,message,severity,source_ip,log_type)
        VALUES (?,?,?,?,?,? )
""",(
    event["timestamp"],
    event["host"],
    event["message"],
    event["severity"],
    event["source_ip"],
    event.get("log_type","auth"),
    ))
    conn.commit()
    conn.close()
if __name__ == "__main__":
    init_db()
    print("Database created")
    from parser import parse_auth_file
    events= parse_auth_file("sample_auth.log")
    for event in events:
        insert_event(event)
    print(f"Inserted {len(events)} events into database")