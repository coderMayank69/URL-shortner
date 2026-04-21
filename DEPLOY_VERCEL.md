# Deploy on Vercel

This project is best deployed as **two Vercel projects**:

1. `server` (Express API)
2. `client` (React/Vite frontend)

## 1) Deploy backend (`server`)

- In Vercel, create a new project and set **Root Directory** to `server`.
- Build command: `npm install`
- Output directory: leave empty
- Install command: `npm install`

Set these environment variables in Vercel:

- `DATABASE_URL` (Neon/Supabase/Postgres connection string)
- `REDIS_URL` (Upstash Redis URL, optional but recommended)
- `JWT_SECRET` (strong random string)
- `APP_URL` (your frontend Vercel URL, with trailing slash)
- `CORS_ORIGIN` (your frontend Vercel URL, without trailing slash)
- `COOKIE_SECURE=true`
- `COOKIE_SAME_SITE=None`
- `NODE_ENV=production`

After first deploy, run migrations once:

```bash
cd server
npx prisma migrate deploy
```

## 2) Deploy frontend (`client`)

- Create another Vercel project with **Root Directory** = `client`.
- Framework preset: `Vite`

Set environment variable:

- `VITE_API_BASE_URL=https://<your-backend-vercel-domain>`

Redeploy frontend after setting this variable.

## 3) Important note about BullMQ worker

Vercel Serverless Functions do not run persistent background workers.  
The code is set up so worker startup is skipped on Vercel.

For production-grade async analytics processing, deploy the worker separately
(for example on Render/Railway/Fly) using the same Redis + Postgres.
