# Lynk.io — Scalable URL Management & Analytics Platform

A production-ready URL shortener built with Node.js, PostgreSQL, Redis, BullMQ, and React.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js + Express 5 |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache** | Redis (ioredis) |
| **Queue** | BullMQ (on Redis) |
| **Auth** | JWT (cookie-based) |
| **Frontend** | React 19 + Vite + Tailwind v4 |
| **State** | Redux Toolkit + TanStack Query |
| **Routing** | TanStack Router |
| **Charts** | Recharts |
| **Testing** | Vitest |

## 🏗 Architecture

```
Client (React/Vite)
  │
  ├─ Redux (auth state)
  ├─ TanStack Query (server state)
  └─ TanStack Router (routing + auth guards)
        │
        ▼
Server (Express.js :3000)
  │
  ├─ REST API Layer
  │   ├─ POST /api/auth/register | /login | /logout
  │   ├─ GET  /api/auth/me
  │   ├─ POST /api/url/shorten
  │   ├─ GET  /api/url/user
  │   ├─ DELETE /api/url/:shortCode
  │   └─ GET  /api/analytics/:urlId
  │
  ├─ GET /:shortCode  → redirect (Redis cache-aside)
  │
  ├─ Redis (ioredis)       ← 24h TTL cache, BullMQ transport
  ├─ BullMQ Worker         ← async click recording (non-blocking)
  └─ PostgreSQL (Prisma)
        ├─ users
        ├─ urls   (indexed: short_code, user_id)
        └─ analytics (indexed: url_id, timestamp)
```

## 🚀 Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+ (running on port 5432)
- Redis 7+ (running on port 6379)

### 1. Clone & install

```bash
git clone <repo>
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment

```bash
cd server
cp .env.example .env
```

Edit `.env` — replace `YOUR_PG_PASSWORD` with your PostgreSQL password.

### 3. Create the database

```sql
-- In psql or pgAdmin:
CREATE DATABASE urlshortener;
```

### 4. Run Prisma migration

```bash
cd server
npx prisma migrate dev --name init
```

This creates the `users`, `urls`, and `analytics` tables with proper indexes.

### 5. Start servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:5173

## 🐳 Docker Deployment

### Prerequisite
- Docker Desktop (with Docker Compose)

### 1. Build and start all services

```bash
docker compose up --build -d
```

This starts:
- Frontend (Nginx + React build): http://localhost:5173
- Backend (Express API): http://localhost:3000
- PostgreSQL and Redis as internal Docker services (not published to host ports)

### 2. Check logs

```bash
docker compose logs -f backend
```

### 3. Stop everything

```bash
docker compose down
```

### 4. Stop and remove database/cache volumes

```bash
docker compose down -v
```

Notes:
- Backend runs `prisma migrate deploy` automatically on container startup.
- For real production, set a strong `JWT_SECRET` in `docker-compose.yml`.
- `COOKIE_SECURE` is set to `false` for local HTTP testing. Set it to `true` behind HTTPS.
- If you need host access to Postgres/Redis, add port mappings in `docker-compose.yml`.

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ❌ | Create account |
| POST | /api/auth/login | ❌ | Login |
| POST | /api/auth/logout | ✅ | Logout |
| GET | /api/auth/me | ✅ | Get current user |
| POST | /api/url/shorten | Optional | Create short URL |
| GET | /api/url/user | ✅ | List user's URLs |
| DELETE | /api/url/:shortCode | ✅ | Delete a URL + invalidate cache |
| GET | /:shortCode | ❌ | Redirect (cached) |
| GET | /api/analytics/:urlId | ✅ | Get click analytics |

## ⚡ Redis Caching Strategy

**Cache-aside pattern** on every redirect:

```
GET /:shortCode
  ├── Redis HIT  → return immediately (< 1ms)
  └── Redis MISS → query PostgreSQL → SET in Redis (24h TTL) → return
```

Cache invalidation on URL delete: `DEL url:{shortCode}`

## 🧠 BullMQ Analytics Queue

Click events are pushed to a BullMQ queue so the redirect stays fast:

```
Redirect → addClickJob() → [Redis Queue] → Worker → PostgreSQL INSERT
```
The main response is sent before the analytics write completes.

## 🧪 Tests

```bash
cd server && npm test
```

Covers: URL creation, cache HIT/MISS, expired URLs, delete with ownership check.

## 📁 Project Structure

```
├── server/
│   ├── prisma/
│   │   └── schema.prisma       ← DB schema
│   ├── src/
│   │   ├── config/             ← prisma.client, redis.client
│   │   ├── dao/                ← database access layer
│   │   ├── services/           ← business logic
│   │   ├── controller/         ← HTTP handlers
│   │   ├── routes/             ← Express routers
│   │   ├── middleware/         ← auth, attachUser
│   │   ├── queue/              ← BullMQ queue + worker
│   │   └── utils/              ← helpers, error classes
│   └── app.js
└── client/
    └── src/
        ├── api/                ← axios API functions
        ├── components/         ← React components
        ├── pages/              ← Route pages
        ├── routing/            ← TanStack Router config
        └── store/              ← Redux store + slices
```
