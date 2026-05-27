# AviClear

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

**AI-powered aviation preflight briefing that translates dense aviation data into plain English — so pilots spend less time decoding jargon and more time making sound go/no-go decisions.**

---

## The Problem

> *"NOTAMs are just a bunch of garbage that nobody reads."*
> — Robert Sumwalt, NTSB Chairman

Aviation information overload is a documented safety hazard. Before every flight, pilots must parse raw METARs, TAFs, and NOTAM packages that can run to dozens of pages — written in arcane shorthand that demands years of training to interpret quickly and reliably.

**Two accidents that this kind of tool is designed to prevent:**

| Incident | Year | Casualties | Root Cause |
|---|---|---|---|
| **Air Canada Flight 759** — SFO | 2017 | 0 (near-miss) | Crew nearly landed on a taxiway with 4 aircraft holding. The relevant NOTAM was buried on **page 8 of a 27-page package**. |
| **Comair Flight 5191** — Lexington, KY | 2006 | 49 killed | Aircraft took off from the wrong runway. A NOTAM about the primary runway closure existed — but its safety significance was lost in the noise. |

Both accidents had warnings in the data. Neither warning was acted on.

AviClear addresses this directly: live aviation data, AI-translated into plain English, with automated severity classification to surface what matters before every flight.

---

## What AviClear Does

- Fetches live METARs from aviationweather.gov and translates them into plain-English weather summaries
- Classifies flight rules (VFR / MVFR / IFR / LIFR) using deterministic FAA logic — no AI involved in safety-critical categorization
- Retrieves NOTAMs via the SkyLink API and classifies each as `CRITICAL`, `SIGNIFICANT`, or `ROUTINE` with an AI-generated plain-English summary
- Generates a unified preflight briefing for departure and destination airports in a single API call
- Secures all endpoints with JWT authentication and role-based access (`ROLE_PILOT` / `ROLE_VIEWER`)

---

## Before / After

### METAR Translation

**Raw:**
```
METAR KBNA 261853Z 18019G30KT 7SM BKN022 BKN029TCU BKN060 25/19 A2999
```

**AviClear:**
```
Nashville is currently MVFR. Winds from the south at 19 knots gusting to 30kt —
significant crosswind potential. Visibility 7SM with broken clouds at 2,200ft.
A towering cumulus at 2,900ft indicates convective activity to the south. Exercise
caution — conditions are marginal and deteriorating.
```

---

### NOTAM Classification

**Raw:**
```
!BNA 442/2026 NAV ILS RWY 20R U/S
```

**AviClear — severity: `CRITICAL`:**
```
The instrument landing system for Runway 20R at Nashville is out of service —
instrument approaches to this runway are not available.
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│              (React 18 + TypeScript + Vite + Tailwind)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST (JWT)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Spring Boot REST API                          │
│         (Spring Boot 4.0 · Spring Security 7 · Spring AI 2.0)  │
│                                                                 │
│  ┌────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │  Auth Service  │  │  Weather Service │  │  NOTAM Service │  │
│  │  (JWT / JPA)   │  │  (METAR + AI)    │  │  (Fetch + AI)  │  │
│  └────────┬───────┘  └────────┬─────────┘  └───────┬────────┘  │
│           │                  │                     │            │
└───────────┼──────────────────┼─────────────────────┼───────────┘
            │                  │                     │
            ▼                  ▼                     ▼
     ┌────────────┐   ┌─────────────────┐   ┌──────────────────┐
     │ PostgreSQL │   │aviationweather  │   │  SkyLink NOTAM   │
     │            │   │    .gov API     │   │  API (RapidAPI)  │
     └────────────┘   └────────┬────────┘   └────────┬─────────┘
                               │                     │
                               └──────────┬──────────┘
                                          ▼
                               ┌──────────────────────┐
                               │   Groq API           │
                               │  (Llama 3.3 70B)     │
                               └──────────────────────┘
```

---

## Features

| Feature | Description |
|---|---|
| Live METAR fetch | Real-time weather data from aviationweather.gov — no API key required |
| AI weather translation | Llama 3.3 70B converts raw METAR codes into plain-English briefings |
| Flight rules classification | Pure Java deterministic logic — VFR / MVFR / IFR / LIFR per FAA minimums |
| NOTAM fetch + classification | Retrieves NOTAMs and assigns CRITICAL / SIGNIFICANT / ROUTINE severity |
| AI NOTAM summarization | Each NOTAM gets a one-sentence plain-English explanation of its operational impact |
| Unified preflight briefing | Single endpoint returns departure + destination weather and NOTAMs with AI narrative |
| JWT authentication | Stateless auth with role-based access control |
| Containerized deployment | Multi-stage Docker builds with Docker Compose orchestration |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | Spring Boot 4.0 |
| AI integration | Spring AI 2.0 + Groq API (Llama 3.3 70B) |
| Security | Spring Security 7 + JWT |
| Persistence | PostgreSQL + Spring Data JPA |
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Containerization | Docker + Docker Compose (multi-stage builds) |
| Weather data | aviationweather.gov (free, unauthenticated) |
| NOTAM data | SkyLink NOTAM API via RapidAPI |
| Build tool | Maven (Maven Wrapper) |
| Runtime | Java 21 |

---

## API Endpoints

### Authentication

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/auth/register` | `{ username, password, role }` | Register a new user |
| `POST` | `/auth/login` | `{ username, password }` | Returns a signed JWT token |

### Weather

| Method | Endpoint | Params | Description |
|---|---|---|---|
| `GET` | `/api/weather/metar` | `icao=KBNA` | Raw METAR data for an airport |
| `GET` | `/api/weather/metar/translate` | `icao=KBNA` | AI plain-English translation of current METAR |

### NOTAMs

| Method | Endpoint | Params | Description |
|---|---|---|---|
| `GET` | `/api/notam/classify` | `icao=KBNA` | NOTAMs with severity classification and AI summary |

### Briefing

| Method | Endpoint | Body | Description |
|---|---|---|---|
| `POST` | `/api/briefing` | `{ departure, destination, departureTime }` | Unified preflight briefing for both airports |

All `/api/*` endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

---

## Local Setup

### Prerequisites

- Java 21
- Docker + Docker Compose
- Maven (or use the included `./mvnw` wrapper)

### Environment Variables

Create a `.env` file in the project root (never commit this):

```env
GROQ_API_KEY=your_groq_api_key
RAPIDAPI_KEY=your_rapidapi_key
JWT_SECRET=a_long_random_secret_string
POSTGRES_PASSWORD=your_postgres_password
```

### Run

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Start the Spring Boot backend
./mvnw spring-boot:run

# 3. In a separate terminal, start the React frontend
cd frontend
npm install
npm run dev
```

The backend will be available at `http://localhost:8080` and the frontend at `http://localhost:5173`.

### Docker (full stack)

```bash
docker-compose up --build
```

---

## Key Design Decisions

### Flight Rules Classification: Pure Java, No AI

Flight rules classification (VFR / MVFR / IFR / LIFR) is implemented entirely in Java using deterministic FAA minimums — no AI call is made for this step.

**Why:** AI models can hallucinate. A pilot making a go/no-go decision based on an incorrectly classified flight category could fly IFR conditions under VFR minimums. Safety-critical logic that has a defined, deterministic specification belongs in code — not in a language model. AI is reserved for tasks where nuance and natural language interpretation add value: translating METARs and summarizing NOTAMs into human-readable text.

### Groq + Llama 3.3 70B over OpenAI

Groq's inference API provides very low latency on Llama 3.3 70B, which matters when a pilot is doing a quick preflight check. The free tier is sufficient for demonstration, and Spring AI's provider-agnostic abstraction makes swapping models trivial if requirements change.

### aviationweather.gov for METAR Data

The FAA's aviationweather.gov API is free, requires no authentication, and is the authoritative source pilots and dispatchers actually use. Using it directly — rather than a third-party weather aggregator — keeps the data trustworthy and the cost zero.

---

## Screenshots

> _Screenshots coming soon. Run the app locally with the setup instructions above._

---

## Portfolio Context

AviClear was built to demonstrate end-to-end full-stack Java + AI integration on a domain where data quality and reliability genuinely matter.

Key skills demonstrated:

- **Spring AI integration** — prompt engineering, structured AI responses, provider abstraction
- **Spring Security + JWT** — stateless auth with role-based endpoint access
- **External API integration** — error handling across multiple third-party data sources with different authentication models
- **Domain-aware design** — understanding when to use AI and when deterministic code is the correct choice
- **Containerization** — multi-stage Docker builds with Compose orchestration for a realistic local dev environment
- **React + TypeScript** — typed frontend consuming a secured REST API

---

## License

MIT
