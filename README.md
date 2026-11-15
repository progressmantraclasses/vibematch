# 💖 DilSe VibeMatch

> **Single-Use Secured QR Crush & Friend Compatibility Platform**  
> *Next.js 14 • NestJS 10 • MongoDB • Google OAuth 2.0 • Framer Motion • WebSockets*

---

## ✨ Features

- 🔒 **Cryptographically Secured Single-Scan QR**: A private 1-of-1 QR code that atomically locks to the first scanner's device and burns upon quiz submission. Replays and unauthorized scans are instantly blocked.
- ⏳ **Custom Expiry Timers**: Choose from 15m, 1h, 6h, 24h, 7d, or indefinite single-use lock with live ticking frontend countdown badges.
- 🎯 **Same True/False Question Deck**: 8 curated Hinglish/English dating & vibe questions + support for custom questions.
- 🤝 **Conditional Mutual Contact Exchange**: Unlock Instagram (`@handle`) and WhatsApp phone numbers based on mutual interest, score thresholds, or completion rules.
- 💌 **3D Flip Secret Confessions**: Both people leave secret notes revealed only when the compatibility gauge unlocks.
- 🔄 **Automatic Dual-Profile Sync**: When either participant signs in with Google, matches automatically sync to both users' permanent dashboards.
- 🌟 **Ultra-Premium Dark Glass UI**: Velvet Night (`#0b0714`), Rose Neon (`#ff3366`), Electric Violet (`#a855f7`), 3D tilt preview cards, circular SVG compatibility gauge, Canvas confetti explosions, and HTML5 Canvas downloadable QR posters.

---

## 📁 Monorepo Structure

```
Lets Friends/
├── apps/
│   ├── api/                   # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/          # Google OAuth2 + JWT Auth + Dev Login
│   │   │   ├── common/        # Filters, Interceptors, Hinglish Questions
│   │   │   ├── gateway/       # Socket.io Real-time WebSocket Gateway
│   │   │   ├── invites/       # QR Invite Generation, Single-Use Claim Lock
│   │   │   ├── matches/       # Quiz Submission, Grading, Contact Unlocking
│   │   │   ├── schemas/       # User, QrInvite, MatchConnection (Mongoose)
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── Dockerfile
│   └── web/                   # Next.js 14 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── create/    # 3-Step Wizard + QR Poster Generator
│       │   │   ├── dashboard/ # Dual-Profile Dashboard (Sent & Answered)
│       │   │   ├── invite/    # Single-Use QR Scanner & Quiz Experience
│       │   │   ├── match/     # Animated Circular Gauge & Reveal
│       │   │   └── page.tsx   # Premium Hero with 3D Tilt Card
│       │   ├── components/    # 15+ Framer Motion & UI Components
│       │   ├── lib/           # API fetch client, constants, utils
│       │   ├── providers/     # React Query & Theme Providers
│       │   └── store/         # Zustand Stores
│       └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── DEPLOYMENT.md
└── README.md
```

---

## 🚀 Quick Start

### 1. Run with Docker Compose
```bash
docker-compose up --build
```
Open [http://localhost:3000](http://localhost:3000)

### 2. Run Manually
```bash
# Terminal 1 - Backend
cd apps/api
npm install
npm run start:dev

# Terminal 2 - Frontend
cd apps/web
npm install
npm run dev
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment configurations.

---

## 📜 License
MIT © 2026 DilSe VibeMatch
