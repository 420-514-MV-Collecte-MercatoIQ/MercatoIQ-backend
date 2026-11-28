<div align="center">

# ⚽ MercatoIQ Backend API

**European Football Performance & Financial Intelligence REST API**  
*Connecting on-pitch metrics with transfer market realities across the UEFA Champions League & Top 5 European Leagues (2012 to present).*

[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:3000/api/docs)
[![Jest](https://img.shields.io/badge/Jest-Tests-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

[Quick Start](#-quick-start) · [Architecture](#-architecture) · [API Overview](#-api-overview) · [Environment](#-environment-variables) · [Scripts](#-useful-commands)

</div>

## 🧭 Architecture

The API serves pre-aggregated **Gold** analytics (cached in **Redis** for high-request traffic), manages **Silver** domain CRUD (`players`, `transfers`), enforces **JWT + RBAC** security, and orchestrates the **Python Medallion Pipeline** directly via `child_process.spawn`.

```mermaid
flowchart LR
    Client["React Client<br/>/dashboard & /admin"] -->|HTTPS + JWT| API["NestJS API<br/>/api/v1"]
    API <-->|Hot Reads & TTL| Redis[("Redis Cache<br/>Gold & Lists")]
    API <-->|Silver CRUD & Gold Reads| Mongo[("MongoDB<br/>Bronze · Silver · Gold")]
    API -->|child_process.spawn<br/>Cron · Admin · CRUD| Py["Python Pipeline<br/>pandas · NumPy · scikit-learn"]
    Py -->|Upsert & Logs| Mongo
```

## 🚀 Quick Start

### 1. Start MongoDB & Redis *(from monorepo root)*
```bash
cp .env.example .env
docker compose up -d
```

### 2. Configure & Run the Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### 3. Verify It Works
- **Health Check:** [`http://localhost:3000/api/v1/health`](http://localhost:3000/api/v1/health)
- **Swagger UI:** [`http://localhost:3000/api/docs`](http://localhost:3000/api/docs)

## 🔌 API Overview

All routes are versioned under **`/api/v1`**. By default, `JwtAuthGuard` protects all endpoints unless decorated with `@Public()`.

| Domain | Endpoints | Access (RBAC) | Status |
| :--- | :--- | :--- | :---: |
| **Health** | `GET /health` | Public (`@Public()`) | ✅ Live |
| **Auth** | `POST /auth/register`, `POST /auth/login` | Public (`@Public()`) | ✅ Live |
| **Players** | `GET /players`, `GET /players/:id`, `POST /players`, `PATCH /players/:id`, `DELETE /players/:id` | JWT Bearer (`user` / `admin`) | ✅ Live |
| **Transfers** | `GET /transfers`, `GET /transfers/:id`, `POST /transfers`, `PATCH /transfers/:id`, `DELETE /transfers/:id` | JWT Bearer (`user` / `admin`) | ✅ Live |
| **Analytics (Gold)** | `GET /analytics/kpis`, `/club-roi`, `/scouting-u23`, `/ucl-vs-domestic`, `/super-subs` | JWT Bearer (`user` / `admin`) | ✅ Live |
| **Clubs & Competitions** | `GET /competitions`, `GET /clubs`, `GET /clubs/:id` | JWT Bearer (`user` / `admin`) | 🔄 PR `#7` |
| **Admin & Pipeline** | `POST /admin/pipeline/trigger`, `GET /admin/metrics` | **`admin` only** (`403` for `user`) | 🔜 Planned (`OPS-01`) |

> **Security Built-In:** Global `JwtAuthGuard` + `RolesGuard`, `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`), `bcrypt` password hashing, and strict CORS. *(Rate limiting with `@nestjs/throttler` and `helmet` are tracked in `SEC-02`.)*

## 📖 Swagger / OpenAPI Documentation

Interactive API documentation is served at [`http://localhost:3000/api/docs`](http://localhost:3000/api/docs) with:
- Persistent JWT Bearer authorization (`persistAuthorization: true`) — authenticate via `POST /api/v1/auth/login` or `/register` and click **Authorize**.
- Typed request and response DTO schemas (`AuthResponseDto`, `SilverPlayer`, `SilverTransfer`, `GoldClubTransferRoi`, `GoldUclVsDomestic`, `GoldUndervaluedScouting`, `GoldSuperSubs`, `KpisResponseDto`, `Paginated*ResponseDto`, `ErrorResponseDto`).
- Verified OpenAPI generation test (`src/swagger.spec.ts`) and runnable Postman artifacts under `docs/postman/`.

## 📂 Project Structure

```text
backend/
├── docs/
│   └── postman/
│       ├── MercatoIQ.postman_collection.json   # API collection
│       └── MercatoIQ.postman_environment.json  # Local environment variables
├── src/
│   ├── main.ts                                 # Bootstrap (/api/v1, ValidationPipe, CORS, Swagger /api/docs)
│   ├── app.module.ts                           # Root module (ConfigModule, MongooseModule, feature modules, guards)
│   ├── app.controller.ts                       # GET /api/v1/health (@Public)
│   ├── app.service.ts                          # Health status service
│   ├── config/
│   │   └── database.config.ts                  # MongoDB connection factory
│   ├── common/
│   │   └── dto/
│   │       ├── pagination-query.dto.ts         # Shared ?page=1&limit=20 validation DTO
│   │       └── paginated-response.dto.ts       # Shared response, pagination meta, and error DTOs
│   ├── database/
│   │   ├── database.module.ts                  # Registers Silver & Gold Mongoose models
│   │   └── schemas/
│   │       ├── silver/                         # SilverPlayer, SilverAppearance, SilverTransfer
│   │       └── gold/                           # GoldClubTransferRoi, GoldUclVsDomestic, GoldUndervaluedScouting, GoldSuperSubs
│   ├── auth/                                   # JWT auth, login/register, @Public/@Roles, JwtAuthGuard & RolesGuard
│   ├── users/                                  # Users schema & lookup/creation service
│   ├── players/                                # Silver Players CRUD controller, service & DTOs
│   ├── transfers/                              # Silver Transfers CRUD controller, service & DTOs
│   ├── analytics/                              # Gold Q1-Q4 + KPIs controller, service, query & response DTOs
│   └── swagger.spec.ts                         # OpenAPI schema & route coverage test
├── test/
│   └── jest-e2e.json                           # E2E Jest configuration
├── .env.example                                # Environment template
└── package.json                                # Dependencies & npm scripts
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `PORT` | `3000` | HTTP server port |
| `API_PREFIX` | `api/v1` | Global URI version prefix |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed React frontend origin |
| `MONGO_URI` | `mongodb://admin:...@localhost:27017/mercatoiq?authSource=admin` | MongoDB connection URI |
| `REDIS_HOST` / `REDIS_PORT` | `localhost` / `6379` | Redis cache server |
| `REDIS_TTL_SECONDS` | `300` | Default cache expiration (seconds) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | `change_me_...` / `24h` | JWT signing secret & lifetime |
| `BCRYPT_SALT_ROUNDS` | `10` | Password hashing cost factor |
| `PYTHON_BIN` / `PIPELINE_SCRIPT_PATH` | `python3` / `../pipeline/run_pipeline.py` | Python runtime & pipeline entrypoint |

## 🛠️ Useful Commands

```bash
npm run start:dev   # Start API in watch mode
npm run build       # Compile TypeScript to dist/
npm run start:prod  # Run compiled production build
npm test            # Run Jest unit tests
npm run test:cov    # Run tests with coverage report (target >= 70%)
npm run test:e2e    # Run Supertest end-to-end suite
npm run format      # Format codebase with Prettier
```

## 🌿 Git Flow

1. Always branch off **`develop`**: `git checkout develop && git pull origin develop`
2. Create a feature branch: `git checkout -b feature/<ticket>-<short-name>` *(e.g. `feature/back-02-schemas`)*
3. Ensure `npm run build` and `npm test` pass before merging back into **`develop`**.
