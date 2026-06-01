from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
app = Flask(__name__)
CORS(app)
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
if __name__=="__main__":
    app.run(debug=True, port=5000)

