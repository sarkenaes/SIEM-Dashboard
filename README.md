## Description


A full-stack Security Information and Event Management (SIEM) platform built from scratch. Ingests authentication logs in real time, detects brute force attacks through correlation rules, checks source IPs with threat intelligence and visualizes security incidents on an interactive React dashboard.

## Features

- **Real-time log ingestion** — monitors Linux `auth.log` files using Python Watchdog, processing new events the moment they're written
- **Brute force detection** — correlation engine flags IPs with 3+ failed login attempts automatically
- **Threat intelligence** — integrates AbuseIPDB API to check source IPs against a global database of known malicious addresses
- **Interactive dashboard** — React frontend with live charts, severity filtering, IP search, and pagination
- **Alert banner** — prominent real-time display of active security incidents
- **REST API** — Flask backend with endpoints for events, alerts, and threat intel lookups
- **Dockerized** — runs with a single `docker-compose up` command

---
##  Quick Start

### Prerequisites
- Docker Desktop installed and running

### Run with Docker
```bash
git clone https://github.com/sarkenaes/SIEM-Dashboard.git
cd SIEM-Dashboard
cp .env.example .env   # add your AbuseIPDB API key
docker-compose up --build
```

Then open `http://localhost` in your browser.

### Run locally (without Docker)

**Backend:**
```bash
pip install -r requirements.txt
python database.py      # populate database with sample events
python app.py           # start Flask API on port 5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev             # start React on port 5173
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
ABUSEIPDB_KEY=your_api_key_here
```

Get a free API key at [abuseipdb.com](https://www.abuseipdb.com/register).

---

## API Endpoints
| Endpoint | Description |
|---|---|
| `GET /api/events` | All security events |
| `GET /api/events/severity/<level>` | Events filtered by severity |
| `GET /api/alerts` | Active brute force alerts |
| `GET /api/threat/<ip>` | AbuseIPDB lookup for an IP |
| `GET /api/health` | Health check |

---

## How Brute Force Detection Works

The correlation engine queries the database for any IP address with 3 or more failed password attempts:

```sql
SELECT source_ip, COUNT(*) as attempts
FROM events
WHERE severity = 'high'
AND message LIKE '%Failed password%'
GROUP BY source_ip
HAVING COUNT(*) >= 3
```

Detected IPs trigger an alert that appears in the dashboard banner and the `/api/alerts` endpoint.

---

## Project Structure

```
SIEM-Dashboard/
├── app.py              # Flask REST API
├── parser.py           # Log file parser
├── database.py         # SQLite database layer
├── watcher.py          # Real-time log file monitor
├── alerts.py           # Brute force detection engine
├── threat_intel.py     # AbuseIPDB integration
├── requirements.txt    # Python dependencies
├── Dockerfile          # Backend container
├── docker-compose.yml  # Multi-container orchestration
└── frontend/
    ├── src/
    │   ├── App.jsx     # Main dashboard component
    │   └── main.jsx    # React entry point
    └── Dockerfile      # Frontend container (Nginx)
```

---

## Use With Real Linux Logs

To monitor a real Linux system, update `LOG_PATH` in `watcher.py`:

```python
LOG_PATH = "/var/log/auth.log"
```

And update the volume in `docker-compose.yml`:

```yaml
volumes:
  - /var/log/auth.log:/app/sample_auth.log
```

SSH into the machine a few times to generate real authentication events.
## Demonstrataion 
[Watch Dashboard Demo](screenshots/For%20you%20_%20Loom%20-%202%20July%202026.mp4)
![Dashboard Preview](/screenshots/Screenshot%201.png)
![Charts Preview](/screenshots/Screenshot%202.png)



    
