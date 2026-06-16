SIEM Dashboard
A full-stack Security Information and Event Management (SIEM) platform built from scratch. Ingests authentication logs in real time, detects brute force attacks through correlation rules, enriches source IPs with threat intelligence and visualizes security incidents on an interactive React dashboard.
Features
    Real-time log ingestion — monitors Linux auth.log files using Python Watchdog, processing new events the moment they're written
    Brute force detection — correlation engine flags IPs with 3+ failed login attempts automatically
    Threat intelligence — integrates AbuseIPDB API to check source IPs against a global database of known malicious addresses
    Interactive dashboard — React frontend with live charts, severity filtering, IP search, and pagination
    Alert banner — prominent real-time display of active security incidents
    REST API — Flask backend with endpoints for events, alerts, and threat intel lookups
    Dockerized — runs with a single docker-compose up command
Structure
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
Tech Stack

LayerTechnologyBackendPython, Flask, SQLiteFrontendReact, RechartsReal-timePython WatchdogThreat IntelAbuseIPDB APIDeploymentDocker, Docker Compose