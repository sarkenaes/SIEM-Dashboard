from flask import Flask, jsonify, request
from flask_cors import CORS
from alerts import check_brute_force
import sqlite3
import os
from threat_intel import check_ip
app = Flask(__name__)
CORS(app,origins=["http://localhost:3000"])
DB_PATH ="siem.db"
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory =sqlite3.Row
    return conn
@app.route("/api/health")
def health():
    return jsonify({"status":"ok"})
@app.route("/api/events")
def get_events():
    conn = get_db()
    cursor =conn.cursor()
    cursor.execute("SELECT * FROM events ORDER BY id DESC")
    rows= cursor.fetchall()
    conn.close()
    events=[]
    for row in rows:
        events.append(dict(row))
    return jsonify({"events": events, "total": len(events)})
@app.route("/api/events/severity/<severity>")
def get_by_severity(severity):
    conn =get_db()
    cursor =conn.cursor()
    cursor.execute("SELECT * FROM events WHERE severity = ? ORDER BY id DESC",(severity,))
    rows = cursor.fetchall()
    conn.close()
    events= [dict(row) for row in rows]
    return jsonify({"events": events, "total" : len(events)})
@app.route("/api/threat/<ip>")
def get_threat(ip):
    result =check_ip(ip)
    return jsonify(result)
@app.route("/api/alerts")
def get_alerts():
     alerts= check_brute_force()
     return jsonify({"alerts": alerts, "total": len(alerts)})
if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    host = os.environ.get("HOST", "127.0.0.1")
    app.run(debug=debug_mode, host=host, port=5000)
