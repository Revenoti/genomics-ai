# Railway Deployment Guide

This guide covers deploying the Functional Genomics AI Chat Interface to Railway from GitHub.

## Prerequisites

- GitHub account with repository access
- Railway account (sign up at railway.app with GitHub)
- Supabase project with:
  - PostgreSQL database for chat sessions, messages, and leads
  - RAG documents table (optional, has fallback)
- OpenAI API key

## Quick Deploy

### 1. Push to GitHub

Ensure your code is pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click "Deploy from GitHub repo"
3. Authorize Railway to access your repository
4. Select your repository

### 3. Configure Environment Variables

In the Railway dashboard, go to your project's **Variables** tab and add:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `DATABASE_URL` | Supabase PostgreSQL connection string | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes (for RAG) |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes (for RAG) |
| `SESSION_SECRET` | Random string for session encryption | Recommended |
| `NODE_ENV` | Set to `production` | Optional |

### 4. Generate Domain

1. Go to **Settings > Networking**
2. Click "Generate Domain"
3. Your app will be available at `https://your-app.up.railway.app`

## Configuration Files

### railway.json

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30
  }
}
```

### nixpacks.toml

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[start]
cmd = "npm run start"
```

## Features Optimized for Railway

- **Full Streaming**: Real-time AI responses via Server-Sent Events (SSE)
- **No Timeout Limits**: Unlike serverless platforms, Railway supports long-running requests
- **Health Checks**: `/api/health` endpoint for monitoring and auto-restart
- **Auto-Deploy**: Every push to GitHub triggers automatic deployment

## Health Check Endpoint

The app includes a health check endpoint at `/api/health`:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5,
  "environment": "production"
}
```

## Database Setup

The app uses Supabase for:

1. **Chat Storage** (via DATABASE_URL):
   - `chat_sessions` - Session tracking
   - `messages` - Chat history
   - `leads` - Form submissions

2. **RAG Knowledge Base** (via SUPABASE_URL):
   - `documents` - Knowledge base with text search

### Running Migrations

After deployment, run database migrations:

```bash
npm run db:push
```

Or manually in Supabase SQL editor using the schema in `shared/schema.ts`.

## Troubleshooting

### Build Failures

- Ensure `package.json` has valid `build` and `start` scripts
- Check Node.js version compatibility (requires Node 20+)

### Connection Issues

- Verify all environment variables are set correctly
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`

### Streaming Not Working

- Ensure no proxy is buffering responses
- The app sets `X-Accel-Buffering: no` header for nginx compatibility

## Monitoring

Railway provides:
- Real-time logs in the dashboard
- Metrics for CPU, memory, and network usage
- Automatic restarts on health check failures

## Costs

Railway offers:
- Free tier with limited usage
- Pay-per-usage model for production
- See [railway.app/pricing](https://railway.app/pricing) for details
