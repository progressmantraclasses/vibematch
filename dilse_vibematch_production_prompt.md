# DilSe VibeMatch — Production-Ready Full-Stack Master Prompt (Next.js + NestJS + MongoDB + Google OAuth + Single-Use Secured QR)

Yeh document aapke **DilSe VibeMatch (Known-Crush & Friend Compatibility App)** ko **100% Production-Ready aur Deployment-Ready** banane ke liye ek complete **Copy-Paste Master Prompt** aur **Step-by-Step Engineering Blueprint** hai. Aap neeche diye gaye Master Prompt ko seedha apne AI IDE (Google Antigravity, Cursor, Claude, ya Windsurf) mein paste karke poora full-stack project generate karwa sakte hain.

---

## Copy-Paste Master Prompt (For AI IDE / Full-Stack Code Generation)

```markdown
You are a Principal Full-Stack Architect and Senior UI/UX Motion Designer. Build a complete, production-ready, deployment-ready full-stack web application called **"DilSe VibeMatch"** — a high-security, romantic friend-to-date compatibility & secret confession platform where a user generates a **single-use, optionally time-expiring, cryptographically secured QR code** for someone they already know (a friend or crush). Both answer the exact same True/False questions, exchange "About Me" bios and secret messages, optionally share their Instagram (`@handle`) or Phone/WhatsApp number if they like each other, and upon Google OAuth signup/login, the completed match and contact details automatically sync into **both users' permanent profiles**.

Build the project step-by-step with zero placeholders, complete TypeScript strictness, production security guards, and ultra-polished animations.

---

### 1. TECH STACK & MONOREPO STRUCTURE
Use a clean monorepo or two-folder structure (`/apps/api` for NestJS and `/apps/web` for Next.js):

1. **Frontend (`/apps/web`)**:
   - **Framework**: Next.js 15 (App Router, TypeScript)
   - **Styling & UI**: Tailwind CSS + Shadcn UI + Custom Glassmorphism Design System (Velvet Night `#0b0714`, Rose Neon `#ff3366`, Electric Violet `#a855f7`, Warm Amber `#fbbf24`)
   - **Animations & Micro-interactions**: `framer-motion` (3D True/False card flips, spring transitions, page transitions, lock-to-unlock contact card morphing) + `canvas-confetti` (match celebration)
   - **QR Code Generation & Scanning**: `qrcode.react` (high-DPI styled QR with center heart logo & downloadable PNG poster via HTML5 Canvas) + `html5-qrcode` (in-app camera scanner)
   - **State & Data Fetching**: TanStack React Query v5 + Zustand (for quiz progress & optimistic UI)
   - **Authentication Client**: Google OAuth 2.0 integrated with backend JWT (`HttpOnly`, `Secure`, `SameSite=Lax` cookies)

2. **Backend (`/apps/api`)**:
   - **Framework**: NestJS (TypeScript, Modular Architecture)
   - **Database**: MongoDB Atlas with `@nestjs/mongoose` and Mongoose Transactions
   - **Authentication**: `@nestjs/passport`, `passport-google-oauth20`, `@nestjs/jwt` (Access Token + Refresh Token rotation in `HttpOnly` cookies)
   - **Security & Validation**: `class-validator`, `class-transformer`, `helmet`, `@nestjs/throttler` (strict rate-limiting on QR token verification endpoints), `crypto` (HMAC-SHA256 & SHA-256 token hashing)
   - **Real-time Events**: `@nestjs/websockets` + `socket.io` (notify the creator in real time when their friend scans the QR, completes the quiz, or unlocks mutual IG/Phone)

---

### 2. CORE PRODUCT & SECURITY REQUIREMENTS (MUST IMPLEMENT EXACTLY)

#### A. Google OAuth 2.0 Authentication & Dual-Profile Sync
1. **Google Login Flow**:
   - Users sign in or sign up using **Google OAuth 2.0** (`GET /api/auth/google` -> `GET /api/auth/google/callback`).
   - On first Google login, create a `User` document in MongoDB storing `googleId`, `email`, `name`, `avatarUrl`, and default profile fields (`bio`, `tagline`, `instagramHandle`, `phoneNumber`).
2. **Pre-Signup Quiz Play + Automatic Dual-Profile Binding**:
   - If the person scanning the QR (the Friend/Crush) is **not logged in yet**, allow them to view the personalized invite, fill in their name (or confirm the pre-filled name), write their "About Me", answer all True/False questions, add a secret message, and enter their Instagram/Phone number.
   - Store this pending submission against a signed `claimSessionToken` (`HttpOnly` cookie).
   - Prompt the friend with **"Sign in with Google to Reveal Compatibility % & Save Match to Both Profiles"**.
   - The moment the friend completes Google OAuth login/signup, execute an **atomic MongoDB transaction** that:
     - Links `responderUserId` to the friend's newly created/authenticated `User` profile.
     - Links `creatorUserId` to the quiz creator's `User` profile.
     - Appends the `MatchConnection` reference to **both** `creator.matches` and `responder.matches` arrays so both users permanently see the full compatibility breakdown, secret notes, and shared IG/Phone in their respective dashboards!

#### B. Highly Secured, Single-Person, One-Time-Use QR Code (`maxUses: 1`)
1. **Cryptographic Token Generation**:
   - When a logged-in Creator creates an invite, generate a 256-bit random raw token (`crypto.randomBytes(32).toString('base64url')`).
   - Never store the raw token in plaintext in MongoDB; store only its `SHA-256` hash (`tokenHash`) in the `QrInvite` collection.
   - Encode the URL `https://<domain>/invite/<inviteId>?t=<rawToken>` into the QR code.
2. **Strict One-Person Claim Lock (Single-Scan Enforcement)**:
   - A QR code is strictly valid for **1 person / 1 use only** (`maxUses: 1`).
   - **First Scan (`ACTIVE` -> `CLAIMED`)**: When the first person opens `/invite/<inviteId>?t=<rawToken>`, the backend atomically transitions the invite from `status: 'ACTIVE'` to `status: 'CLAIMED'`, generates a cryptographic `claimSessionId` (set in an `HttpOnly` signed cookie on that device's browser), and binds `claimedBySessionHash` to that scanner.
   - **Same Person Refresh**: If that exact same device/browser (matching `claimSessionId` or authenticated `responderUserId`) refreshes the page before submitting, allow them to continue their quiz seamlessly.
   - **Second Person / Replay Blocked**: If **any other device, browser, or person** scans the same QR code after it is `CLAIMED` or `COMPLETED`, immediately return `403 Forbidden (QR_ALREADY_USED)` and render a sleek locked screen: *"🔒 This Private QR Invite was created for one specific person and has already been used."*
   - **Submission (`CLAIMED` -> `COMPLETED`)**: Once the friend submits the True/False quiz, atomically set `status: 'COMPLETED'`, `usedCount: 1`, and `completedAt: new Date()`, permanently burning the QR token.

#### C. Optional Custom Expiry Timer on QR Invite
1. When generating a QR code, the Creator can toggle **"Set Expiry Timer"** with presets:
   - `15 Minutes`, `1 Hour`, `6 Hours`, `24 Hours`, `7 Days`, `Custom Date/Time`, or `No Time Limit (Valid until 1st use)`.
2. Store `expiresAt: Date | null` in the `QrInvite` document.
3. Enforce expiry at three levels:
   - **Backend Guard**: Reject any scan or submission where `expiresAt !== null && new Date() > expiresAt`, updating status to `'EXPIRED'`.
   - **Frontend Live Countdown**: Show a real-time countdown badge (`⏳ Expires in 00:14:32`) on both the Creator's QR management card and the Friend's quiz screen.
   - **Instant Revoke Button**: Allow the Creator to click **"Revoke QR Now"** at any time before completion to immediately invalidate the QR (`status: 'REVOKED'`).

#### D. Pre-Filled Friend Name OR Dynamic Friend Name Entry
1. When creating the QR invite, give the Creator two flexible options for the recipient's name:
   - **Option 1 (Creator Pre-fills Recipient Name/Nickname)**: Creator types the friend's name (e.g., `"Riya"` or `"Mere Special Friend Kabir"`). When the friend scans the QR, the welcome screen greets them personally by that exact name (*"Hey Riya! Aarav made this secret quiz just for you ✨"*) and pre-fills their name field (with an option for the friend to edit/confirm their full name).
   - **Option 2 (Open Name — Friend Enters Name on Scan)**: Creator leaves the recipient name blank. When the friend scans the QR, they enter their own name and "About Me" bio before answering the True/False questions, and the Creator sees the friend's entered name + Google profile name once submitted.

#### E. Same True/False Quiz, Secret Message & Mutual IG/Phone Unlock
1. **True/False Questions**:
   - Provide 8 curated Hinglish/English dating & vibe True/False questions by default, plus allow the Creator to add custom True/False questions or toggle which ones to include.
   - Creator records their `true` / `false` answer for every question when creating the QR invite.
   - Friend answers the **exact same questions** (`true` / `false`) without seeing the Creator's answers until submission.
2. **About Me & Secret Messages**:
   - Both Creator and Friend write an **"About Me"** bio and an optional **"Secret Message / Confession"** for each other.
3. **Conditional Instagram & Phone/WhatsApp Exchange**:
   - Creator enters their `@instagram` and/or `phone/WhatsApp` and selects an unlock rule:
     - `MUTUAL_ONLY`: Unlock Creator's IG/Phone only if the Friend also toggles **"I like you! Share my IG/Number"** and provides their contact.
     - `SCORE_THRESHOLD`: Unlock if compatibility score >= `X%` (e.g. 70%).
     - `ALWAYS_ON_COMPLETE`: Unlock as soon as Friend finishes the quiz.

---

### 3. MONGODB / MONGOOSE SCHEMAS (`/apps/api/src/schemas/`)

Implement these 4 Mongoose schemas with proper indexes:

1. **`User` Schema (`users`)**:
   - `_id`: ObjectId
   - `googleId`: String (unique, indexed)
   - `email`: String (unique, indexed)
   - `name`: String
   - `avatarUrl`: String
   - `customAvatarEmoji`: String (default `'😎'`)
   - `tagline`: String
   - `bio`: String
   - `instagramHandle`: String
   - `phoneNumber`: String
   - `createdInvites`: `[ObjectId]` (ref `'QrInvite'`)
   - `matches`: `[ObjectId]` (ref `'MatchConnection'`)
   - `createdAt`, `updatedAt`

2. **`QrInvite` Schema (`qr_invites`)**:
   - `_id`: ObjectId
   - `shortCode`: String (unique, indexed, e.g. `'VIBE-8492X'`)
   - `tokenHash`: String (unique, indexed — SHA-256 hash of raw secret token)
   - `creatorId`: ObjectId (ref `'User'`, indexed)
   - `prefilledFriendName`: String | null (optional name fed by creator)
   - `creatorSnapshot`: `{ name, avatarEmoji, tagline, bio, secretMessage, instagramHandle, phoneNumber, unlockRule: 'MUTUAL_ONLY' | 'SCORE_THRESHOLD' | 'ALWAYS_ON_COMPLETE', minScorePercent: Number }`
   - `questions`: `[{ questionId: String, text: String, creatorAnswer: Boolean }]`
   - `status`: `'ACTIVE' | 'CLAIMED' | 'COMPLETED' | 'EXPIRED' | 'REVOKED'` (indexed)
   - `maxUses`: Number (default `1`, immutable)
   - `usedCount`: Number (default `0`)
   - `claimedBySessionHash`: String | null
   - `claimedByUserId`: ObjectId | null (ref `'User'`)
   - `claimedAt`: Date | null
   - `expiresAt`: Date | null (indexed for expiry checks)
   - `completedMatchId`: ObjectId | null (ref `'MatchConnection'`)
   - `createdAt`, `updatedAt`

3. **`MatchConnection` Schema (`match_connections`)**:
   - `_id`: ObjectId
   - `inviteId`: ObjectId (ref `'QrInvite'`, unique)
   - `creatorUserId`: ObjectId (ref `'User'`, indexed)
   - `responderUserId`: ObjectId | null (ref `'User'`, indexed — populated immediately or upon Google OAuth signup)
   - `responderDisplayName`: String (either pre-filled by creator or entered by responder)
   - `responderMoodTag`: String
   - `responderAboutMe`: String
   - `responderSecretMessage`: String
   - `responderSharedContact`: Boolean
   - `responderInstagram`: String | null
   - `responderPhone`: String | null
   - `creatorContactUnlocked`: Boolean
   - `questionComparisons`: `[{ questionId: String, text: String, creatorAnswer: Boolean, responderAnswer: Boolean, isMatch: Boolean }]`
   - `sameCount`: Number
   - `totalQuestions`: Number
   - `compatibilityPercent`: Number
   - `isSyncedToBothProfiles`: Boolean (default `false`, set to `true` once responder completes Google OAuth)
   - `createdAt`, `updatedAt`

---

### 4. NESTJS BACKEND API ENDPOINTS (`/apps/api/src/`)

Implement these controllers and services with DTO validation:

1. **Auth Module (`/api/auth`)**:
   - `GET /api/auth/google` — Initiates Google OAuth2 login (accepts optional `?claimToken=...` state parameter so a friend signing up right after answering a quiz automatically binds that quiz to their new account).
   - `GET /api/auth/google/callback` — Verifies Google user, issues `HttpOnly` JWT cookies, executes dual-profile sync if a `claimToken` or `pendingMatchId` exists, and redirects to `/dashboard` or `/match/:matchId`.
   - `GET /api/auth/me` — Returns current authenticated user profile + summary counts.
   - `POST /api/auth/logout` — Clears auth cookies.

2. **QR Invites Module (`/api/invites`)**:
   - `POST /api/invites` (Auth Guard) — Creates a new single-use `QrInvite` with custom/default True/False questions, optional `prefilledFriendName`, optional `expiresInMinutes` / `expiresAt`, secret message, and contact unlock rule. Returns the one-time raw share URL and QR payload.
   - `GET /api/invites/my` (Auth Guard) — Lists all QR invites created by the logged-in user with live statuses (`ACTIVE`, `CLAIMED`, `COMPLETED`, `EXPIRED`, `REVOKED`) and expiry countdowns.
   - `PATCH /api/invites/:id/revoke` (Auth Guard) — Immediately revokes an active QR invite.
   - `POST /api/invites/:id/claim` (Public + Rate Limited) — Verifies the raw token `t`, checks expiry and single-use status, atomically locks the invite (`status: 'CLAIMED'`) to the scanner's `HttpOnly` `claimSessionId` cookie, and returns sanitized invite metadata (`creatorSnapshot` WITHOUT secret message, WITHOUT creator answers, and WITHOUT creator IG/Phone) plus `prefilledFriendName` and `questions` text list.

3. **Matches & Quiz Submission Module (`/api/matches`)**:
   - `POST /api/invites/:id/submit` — Validates `claimSessionId`, grades responder's True/False answers against creator's answers, calculates `compatibilityPercent`, evaluates contact unlock rules, creates `MatchConnection`, burns the QR invite (`status: 'COMPLETED'`, `usedCount: 1`), and if the responder is already logged in with Google, immediately adds the `MatchConnection` to both `creatorUserId` and `responderUserId` profiles (otherwise issues a `pendingMatchClaimToken` to bind on Google signup).
   - `POST /api/matches/:matchId/bind-google-profile` (Auth Guard) — Binds a completed quiz session to the responder's Google account after OAuth signup and syncs the match to both profiles.
   - `GET /api/matches/my-connections` (Auth Guard) — Returns all matches where the logged-in user is **either** `creatorUserId` **or** `responderUserId` so both people see the shared card in their profile!
   - `GET /api/matches/:matchId` — Returns the full match breakdown, unlocked secret messages, and unlocked IG/Phone details for authorized participants.

---

### 5. UI/UX DESIGN & FRAMER MOTION ANIMATION SPECS (`/apps/web`)

Build an unforgettable, ultra-attractive romantic dark-glass UI:
1. **Landing & Onboarding Hero**:
   - Animated floating gradient orbs, interactive 3D tilt preview card, and one-click **"Continue with Google"** button with glowing rose-violet border.
2. **Creator Studio (`/create`)**:
   - Step-by-step interactive wizard:
     - **Step 1**: Profile, Pre-fill Friend's Name (optional input: *"Friend ka naam daalein ya blank chhodein"*), Secret Message, and IG/Phone Unlock Rule.
     - **Step 2**: Interactive True/False question deck with tactile neon toggle pills (`TRUE ✓` / `FALSE ✕`) and ability to add custom questions.
     - **Step 3**: **Security & Expiry Selector** (Single-Use Lock badge + Expiry Timer pills: `15m`, `1h`, `24h`, `Custom`, `No Expiry`) -> Generates a downloadable high-DPI **Unique QR Poster Card** with live countdown timer.
3. **Single-Use Scanner Experience (`/invite/[id]`)**:
   - **Personalized Welcome**: If `prefilledFriendName` exists, animate *"Hey [Name]! [Creator] sent a 1-of-1 Private QR Invite just for you 💌"* (with ability to edit/confirm name). If blank, show a sleek input: *"Apna Naam aur Apne Baare Mein Batayein"*.
   - **Swipe/Tap True-False Deck**: Framer Motion card stack where each True/False answer animates smoothly to the next question with a glowing progress bar.
   - **Confession & Mutual Contact Toggle**: Animated switch *"💖 Mujhe tumhari vibe pasand aayi! Share my Instagram / Phone Number"*.
   - **Google Signup Sync CTA**: Prominent button to sign in with Google so the match is permanently saved to both users' profiles.
4. **Match Reveal & Dual-Profile Dashboard (`/dashboard` & `/match/[id]`)**:
   - Animated SVG circular gauge counting up from `0%` to `compatibilityPercent%` + confetti burst if `>= 70%`.
   - 3D flip animation unlocking the Creator's Secret Note and Mutual Instagram/WhatsApp contact cards.
   - Unified **"Our Shared Vibe Cards"** tab in `/dashboard` showing both "Invites I Sent" and "Quizzes I Answered" synced across both users' profiles.

---

### 6. DELIVERABLES TO GENERATE STEP-BY-STEP
Generate the full working implementation in this exact order:
1. Folder structure, `package.json` files, and `.env.example` for both `/apps/api` and `/apps/web`.
2. NestJS MongoDB schemas (`User`, `QrInvite`, `MatchConnection`) with indexes and atomic single-use claim transaction logic.
3. NestJS Google OAuth2 Strategy, JWT Guard, QR Invite Controller/Service (with HMAC hashing, single-scan lock, and expiry enforcement), and Match Sync Service.
4. Next.js App Router pages (`/`, `/dashboard`, `/create`, `/invite/[id]`, `/match/[id]`) with Framer Motion animations, QR poster generator, and Google Auth integration.
5. Production deployment configurations (`Dockerfile`, `docker-compose.yml`, Vercel + Render/Railway deployment checklist).
```

---

## Step-by-Step Production Architecture & Deployment Roadmap

Agar aap is project ko khud step-by-step build aur deploy karna chahte hain, toh yeh raha poora flow:

| Step | Component | Key Production Implementation Details |
| :--- | :--- | :--- |
| **Step 1** | **Google Cloud OAuth Setup** | Google Cloud Console -> *APIs & Services > Credentials* mein OAuth 2.0 Client ID banayein. Authorized Redirect URI mein `http://localhost:4000/api/auth/google/callback` (local) aur `https://api.yourdomain.com/api/auth/google/callback` (production) add karein. |
| **Step 2** | **MongoDB Atlas & Indexes** | MongoDB Atlas cluster banayein. `qr_invites` collection mein `tokenHash` (unique) aur `expiresAt` par index lagayein. Single-use QR lock ke liye `findOneAndUpdate({ _id, status: 'ACTIVE', usedCount: 0 }, { $set: { status: 'CLAIMED', claimedBySessionHash } })` atomic query use karein taaki race condition na ho. |
| **Step 3** | **One-Time QR Security & Expiry** | Har QR link mein raw 32-byte token (`?t=...`) bhejein aur DB mein sirf uska `SHA-256` hash save karein. Jab pehla user scan kare, uske browser mein `HttpOnly` signed cookie (`claim_session`) set ho jaye. Dusra koi bhi scan kare toh `403 QR_ALREADY_CLAIMED` screen dikhe. |
| **Step 4** | **Pre-Filled vs Custom Name Logic** | `QrInvite` schema mein `prefilledFriendName` optional rakhein. Agar Creator ne naam dala hai (jaise *"Riya"*), toh scan hote hi *"Hey Riya!"* dikhega; warna Friend khud apna naam feed karega aur woh Creator ke dashboard mein update ho jayega. |
| **Step 5** | **Dual-Profile Sync on Signup** | Jab Friend quiz submit karne ke baad Google Login/Signup kare, NestJS callback mein `MatchConnection.responderUserId = friendUser._id` set karein aur dono users (`creatorUserId` aur `responderUserId`) ke `matches` array mein `match._id` push kar dein. |
| **Step 6** | **Cloud Deployment** | **Frontend (Next.js)** ko **Vercel** par deploy karein, **Backend (NestJS)** ko **Render / Railway / AWS EC2** par deploy karein, aur **Cloudflare** DNS + Full (Strict) SSL lagayein. |

---

## Environment Variables Template (`.env.example`)

```ini
# ===== BACKEND (/apps/api/.env) =====
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dilse_vibematch?retryWrites=true&w=majority

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback

# JWT & QR Cryptographic Secrets
JWT_ACCESS_SECRET=super_long_random_64_char_access_secret
JWT_REFRESH_SECRET=super_long_random_64_char_refresh_secret
QR_HMAC_SECRET=super_long_random_64_char_qr_hmac_secret
CLAIM_COOKIE_SECRET=super_long_random_64_char_cookie_secret

FRONTEND_URL=https://yourdomain.com

# ===== FRONTEND (/apps/web/.env.local) =====
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```
