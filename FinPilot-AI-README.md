# FinPilot-AI

A full-stack fintech banking application with a React frontend, a Spring Boot banking API, PostgreSQL persistence, and a FastAPI fraud-detection service.

> **Important:** This repository is an educational/demo project. It is not production banking software and must not be used to process real money, customer data, or financial transactions. Review the security notes below before exposing it beyond a local development machine.

## Architecture

| Component | Technology | Local URL / Port |
|---|---|---|
| Web frontend | React 19, Vite 8 | http://localhost:5173 |
| Banking API | Java 17, Spring Boot 3.5.3, Spring Security, JWT, Spring Data JPA | http://localhost:8080 |
| Fraud detection API | Python 3.10, FastAPI, scikit-learn | http://localhost:8000 |
| Database | PostgreSQL 14 | localhost:5434 (container port 5432) |

The frontend calls the banking API at `http://localhost:8080`. The banking service connects to PostgreSQL and calls the AI service using Docker Compose service names.

## Requirements

- Docker Engine with the Docker Compose v2 plugin, or Docker Desktop with Compose enabled
- A terminal
- Enough free disk space for the container images and database volume

You do **not** need to install Java, Maven, Node.js, Python, or PostgreSQL locally when using the Docker Compose setup.

## Run with Docker Compose

1. Extract the ZIP archive.
2. Open a terminal in the extracted `FinPilot-AI` project directory (the directory containing `docker-compose.yml`).
3. Build and start the services:

   ```bash
   docker compose up --build -d
   ```

4. Check service status:

   ```bash
   docker compose ps
   ```

5. Open the frontend:

   - Web application: http://localhost:5173
   - Banking API: http://localhost:8080
   - Fraud service health endpoint: http://localhost:8000/health
   - Fraud service API documentation: http://localhost:8000/docs

The first build can take several minutes while Docker downloads base images and installs dependencies.

## Useful Docker commands

View logs for all services:

```bash
docker compose logs -f
```

View logs for one service:

```bash
docker compose logs -f banking-service
docker compose logs -f frontend
docker compose logs -f ai-service
docker compose logs -f postgres
```

Stop the services without deleting database data:

```bash
docker compose down
```

Rebuild after changing source code:

```bash
docker compose up --build -d
```

**Reset warning:** The following command deletes the PostgreSQL Docker volume and all data stored in it:

```bash
docker compose down -v
```

Use it only when you intentionally want a fresh local database.

## Fraud detection API

The FastAPI service exposes:

- `GET /` - basic service status
- `GET /health` - health response
- `POST /predict` - transaction risk prediction

Interactive API documentation is available at http://localhost:8000/docs while the service is running.

Example request body for `POST /predict`:

```json
{
  "step": 1,
  "type": "TRANSFER",
  "amount": 5000,
  "oldbalanceOrg": 10000,
  "newbalanceOrig": 5000,
  "oldbalanceDest": 2000,
  "newbalanceDest": 7000,
  "device_trusted": 1,
  "location_match": 1,
  "velocity": 2,
  "failed_login_count": 0,
  "ip_risk_score": 10,
  "account_age_days": 365,
  "hour": 14
}
```

The service loads its model artifacts from `ai-service/models/`. Keep the model files in that directory when packaging or moving the project.

## Database behavior and sample data

The Compose configuration creates a PostgreSQL database named `finpilot` and persists it in a Docker volume. The Spring Boot service is configured to connect to that database and uses Hibernate schema update behavior.

The SQL files under `database/` are included as project database/reference assets. **The current `docker-compose.yml` does not mount or automatically execute those SQL files.** Do not assume the sample records in those files will be loaded on first startup. Some SQL files are legacy database dumps and may target a different database layout.

For a clean local reset, stop the stack and remove the volume with `docker compose down -v`, then start it again. This deletes all local database data.

## Troubleshooting

### A service is not running

Check its logs:

```bash
docker compose logs --tail=200 banking-service
```

The Compose file starts services in dependency order, but its current dependency configuration does not wait for PostgreSQL to pass a readiness check. If the banking service fails during the initial database startup, inspect the logs and retry it after PostgreSQL is ready:

```bash
docker compose up -d banking-service
```

### Frontend cannot reach the banking API

- Confirm the banking service is running: `docker compose ps`
- Check the API logs: `docker compose logs -f banking-service`
- Confirm port `8080` is not already in use.
- The frontend currently uses `http://localhost:8080` as its API base URL.

### A port is already in use

Stop the other application using the conflicting port, or update the relevant host-side port mapping in `docker-compose.yml`. If you change a port, update any frontend/API URLs that refer to it.

### Fraud prediction endpoint fails

- Confirm the AI service is running: `docker compose logs -f ai-service`
- Confirm the files under `ai-service/models/` are present.
- Open http://localhost:8000/health and http://localhost:8000/docs.

## Security and production limitations

This configuration is intended for local demonstration only.

- The repository contains demo credentials and a hardcoded JWT signing secret. Replace these with securely supplied environment variables before any deployment; never reuse the included values.
- The PostgreSQL Compose configuration uses a simple local development password. Change it and use secret management for any non-local environment.
- CORS is configured for the local frontend origin.
- The included SQL seed/backup files contain sample records. Review and anonymize them before redistribution, and never include real customer or account information.
- Fraud predictions are model outputs, not guarantees or financial advice. Do not use them as the sole basis for real-world financial decisions.

## Project structure

```text
FinPilot-AI/
├── ai-service/          # FastAPI fraud detection service and model artifacts
├── banking-service/     # Spring Boot banking backend
├── database/            # SQL schema, seed, migration, and reference files
├── frontend/             # React + Vite application
└── docker-compose.yml    # Local multi-service setup
```

## License and support

Confirm the licence and redistribution rights for every source file and model artifact before distributing or reusing this project. Unless a separate licence is supplied, no third-party rights are granted by this README.

This package is provided as source code. It does not include a hosted banking service, production infrastructure, financial integrations, or a warranty of fitness for a particular purpose.
