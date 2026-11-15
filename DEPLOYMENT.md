# 💖 DilSe VibeMatch — Deployment & Production Guide

This document provides complete instructions for running, testing, and deploying **DilSe VibeMatch** locally and to cloud production environments (Vercel + Render/Railway + MongoDB Atlas).

---

## 🛠️ Tech Stack Overview

- **Frontend**: Next.js 14 (App Router, TypeScript, Tailwind CSS, Framer Motion, HTML5 Canvas QR Poster, Radix UI, Zustand, TanStack Query)
- **Backend**: NestJS 10 (TypeScript, Mongoose, Passport Google OAuth2, JWT, WebSockets Socket.io, Helmet, Throttler)
- **Database**: MongoDB Atlas
- **Security**: Single-scan cryptographically hashed tokens (`SHA-256`), HttpOnly SameSite signed session cookies, replay guards

---

## ⚡ 1. Local Development Setup

### Prerequisites
- Node.js 20+ installed
- MongoDB running locally (`mongodb://localhost:27017`) or MongoDB Atlas URI

### Step-by-Step

1. **Install Dependencies**
   ```bash
   # From root directory
   npm install --workspace=apps/api
   npm install --workspace=apps/web
   ```

2. **Configure Environment Variables**
   - Backend: Copy `.env.example` to `apps/api/.env`
   - Frontend: Copy `.env.example` to `apps/web/.env.local`

3. **Start NestJS Backend**
   ```bash
   npm run start:dev --workspace=apps/api
   # Server runs on http://localhost:4000/api
   ```

4. **Start Next.js Frontend**
   ```bash
   npm run dev --workspace=apps/web
   # Web runs on http://localhost:3000
   ```

---

## 🔑 2. Instant Testing Without Google Cloud (Dev Fast Login)

To test immediately without setting up Google OAuth credentials:
1. Open [http://localhost:3000](http://localhost:3000)
2. On any login button, click **"Test without Google credentials? (One-Click Dev Login)"**
3. Enter any name and email, and you're instantly logged in with authentic JWT cookies!

---

## 🌐 3. Google OAuth 2.0 Production Setup

1. Open **[Google Cloud Console](https://console.cloud.google.com/)**
2. Go to **APIs & Services > Credentials**
3. Create an **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (local)
     - `https://your-frontend-domain.com` (production)
   - Authorized redirect URIs:
     - `http://localhost:4000/api/auth/google/callback` (local)
     - `https://your-api-domain.com/api/auth/google/callback` (production)
4. Copy `Client ID` and `Client Secret` into `apps/api/.env`.

---

## 🐳 4. Docker & Docker Compose Deployment

Run the entire stack with MongoDB in one command:

```bash
docker-compose up --build
```

- Web UI: `http://localhost:3000`
- API Backend: `http://localhost:4000/api`
- MongoDB: `mongodb://localhost:27017`

---

## 🚀 5. Cloud Production Deployment

### Frontend (Vercel)
1. Push this repository to GitHub.
2. Import project into **Vercel**:
   - Root directory: `apps/web`
   - Framework preset: `Next.js`
   - Environment variables:
     - `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com/api`
     - `NEXT_PUBLIC_APP_URL`: `https://yourdomain.com`

### Backend (Render / Railway / AWS EC2)
1. Deploy `apps/api`:
   - Build command: `npm install && npm run build`
   - Start command: `node dist/main.js`
   - Environment variables:
     - `NODE_ENV`: `production`
     - `PORT`: `4000`
     - `MONGODB_URI`: `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/dilse_vibematch`
     - `FRONTEND_URL`: `https://yourdomain.com`
     - `JWT_ACCESS_SECRET`: `64_char_secure_random_string`
     - `JWT_REFRESH_SECRET`: `64_char_secure_random_string`
     - `GOOGLE_CLIENT_ID`: `your_client_id`
     - `GOOGLE_CLIENT_SECRET`: `your_client_secret`
     - `GOOGLE_CALLBACK_URL`: `https://api.yourdomain.com/api/auth/google/callback`

---

## 🛡️ Security Architecture

| Security Layer | Implementation |
| :--- | :--- |
| **Token Generation** | 256-bit cryptographically secure raw token (`crypto.randomBytes(32).toString('base64url')`) |
| **Database Storage** | Raw token is never stored in DB. Only `SHA-256` hash is indexed. |
| **Atomic Claim Lock** | Single-scan lock using atomic MongoDB `findOneAndUpdate({ status: 'ACTIVE', usedCount: 0 })`. Second scans immediately trigger `403 Forbidden (QR_ALREADY_USED)`. |
| **Device Cookie** | Scanners receive an `HttpOnly`, `SameSite=Lax` signed `claim_session` cookie allowing them to refresh or continue without losing access. |
| **Automatic Dual-Sync** | Post-OAuth atomic sync links `MatchConnection` to both users' profiles. |
