# BuildX Backend (App Router Edition)

## 🚀 Overview
This is the **official backend for BuildX**, a modular, AI-powered construction bidding platform built with modern Next.js App Router architecture.

## 🧱 Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL (via Prisma ORM)
- **Auth**: JWT + Role-Based Access
- **Storage**: AWS S3 (Presigned Uploads)
- **Caching/Queue**: Redis (ioredis)
- **Billing**: Stripe Subscriptions
- **Email**: Nodemailer (SMTP + branded templates)
- **Infra Ready**: Deploys to Railway, Vercel, or AWS

---

## ⚙️ Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/buildxhq/buildx-backend.git
cd buildx-backend
npm install
```

### 2. Create `.env` File
Create a `.env` file in the root:
```env
DATABASE_URL=postgresql://your-db-url
REDIS_URL=redis://your-redis-url
JWT_SECRET=supersecretkey
STRIPE_SECRET_KEY=sk_test_...
EMAIL_FROM=no-reply@buildxbid.com
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
FRONTEND_URL=https://buildxbid.com
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Dev Server
```bash
npm run dev
```

You’re now running locally on `http://localhost:3000`.

---

## 📁 Project Structure
```
/app/api           ← API Routes (modular, secure)
/lib               ← Shared utils (auth, redis, email, plan logic)
/prisma/schema.prisma ← DB schema
.env               ← Environment config (not committed)
```

---

## 🧪 Scripts
```bash
npm run dev        # Start local dev server
npm run build      # Build for production
npm run start      # Start production server
npx prisma studio  # Open Prisma DB GUI
```

---

## 🚢 Deployment Ready
- ✅ **Works on Railway** (DB + Redis ready)
- ✅ **Prepped for AWS** via Dockerfile
- ✅ Easy to move to Vercel or Render

---

## 🔐 Auth Roles & Plans
| Role | Plans |
|------|-------|
| `gc` | `starter`, `growth`, `unlimited` |
| `sub` | `free`, `verified_pro`, `elite_partner` |
| `ae` | `professional`, `enterprise` |
| `supplier` | `free`, `pro` |

---

## 🧠 Feature Highlights
- AI Takeoffs, Smart Proposals, Schedule Generator
- Internal Messaging, Bids, Rebid Requests
- Stripe Plan Enforcement
- Email Verification, Magic Invite Links
- Fully Replace Express/Knex — No `server.js`, No `routes/`, No `controllers/`

---

## 👑 Created by PatriotX
Built to scale the future of construction — modern, fast, and founder-ready.

