# PrimeRide — Premium Car Rental Platform (Pakistan)

> A full-stack car rental MVP built with React (Vite) + Node.js/Express + MongoDB

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier)
- Stripe account (test mode)

---

### 1. Clone & Install

```bash
# Install server deps
cd server
npm install

# Install client deps
cd ../client
npm install
```

### 2. Environment Variables

**Server:**
```bash
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, STRIPE keys, Cloudinary keys
```

**Client:**
```bash
cd client
cp .env.example .env
# Fill in VITE_STRIPE_PUBLIC_KEY
```

**Root / Vercel:**
```bash
# Set FRONTEND_URL to your Vercel frontend URL
# Set MONGO_URI, JWT secrets, Cloudinary keys, Stripe keys, and any WhatsApp keys
# If you deploy the frontend and backend in one Vercel project, leave VITE_API_URL unset so the client uses /api
```

### 3. Run Locally

```bash
# Terminal 1 — Server
cd server
npm run dev   # Runs on http://localhost:5000

# Terminal 2 — Client
cd client
npm run dev   # Runs on http://localhost:5173
```

---

## 📁 Project Structure

```
primeride/
├── client/                    # React frontend (Vite + Tailwind)
│   └── src/
│       ├── components/
│       │   ├── ui/            # Button, Input, Modal, Badge, StarRating, etc.
│       │   ├── layout/        # Navbar, Footer, WhatsAppBubble
│       │   ├── cars/          # CarCard, CarFilters
│       │   └── booking/       # BookingSteps
│       ├── context/           # AuthContext, ThemeContext, CurrencyContext
│       ├── hooks/             # Custom hooks
│       ├── pages/             # All route pages
│       │   └── admin/         # Admin dashboard pages
│       ├── services/          # API service modules (axios)
│       └── utils/             # Helpers, constants
│
└── server/                    # Express backend
    ├── models/                # Mongoose models (User, Car, Driver, Booking, Review)
    ├── controllers/           # Business logic
    ├── routes/                # Express routers
    ├── middleware/            # authMiddleware, errorHandler
    ├── utils/                 # jwt.js, whatsapp.js, stripe.js, jazzcash.js, cloudinary.js
    └── config/                # db.js
```

---

## 🗄️ Data Models

| Model    | Key Fields |
|----------|-----------|
| User     | username, email, password (bcrypt), phone, role [customer\|admin] |
| Car      | brand, model, year, category, pricePerDay, city, images, status |
| Driver   | name, licenseNumber, verified, experienceYears, rating |
| Booking  | carId, driverId, pickupDate, dropoffDate, totalPrice, paymentStatus |
| Review   | bookingId, rating, comment, isApproved |

---

## 🛣️ API Routes

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/refresh-token | Public |
| GET | /api/cars | Public |
| GET | /api/cars/:id/availability | Public |
| POST | /api/cars | Admin |
| POST | /api/bookings | Protected |
| GET | /api/bookings/my | Protected |
| POST | /api/payments/create-intent | Protected |
| POST | /api/payments/webhook | Public (Stripe) |
| POST | /api/payments/jazzcash/initiate | Protected |
| GET | /api/admin/dashboard-stats | Admin |

---

## 💳 Payment Integration

### Stripe (International / Cards)
- Full integration via Payment Intents API
- Webhook handler for payment confirmation
- Overseas customers pay in USD (PKR converted at ~280 rate)

### JazzCash / EasyPaisa (Local PK)
- **Status: Sandbox/Stub for MVP**
- Module at `server/utils/jazzcash.js`
- Swap in real JazzCash Merchant API credentials to go live
- Mocked response simulates successful payment in demo

---

## 📱 WhatsApp Integration
- Auto-sends booking confirmation on payment success
- Uses Meta WhatsApp Cloud API
- Floating chat bubble throughout the site
- Configure: `WHATSAPP_API_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID`

---

## 🌙 Light/Dark Mode
- Tailwind `darkMode: 'class'` strategy
- Persisted in `localStorage`
- Respects `prefers-color-scheme` on first visit
- Toggle via sun/moon icon in navbar

---

## 🚢 Deployment

### Vercel Monorepo Setup
- The frontend is built from `client/` and served from `client/dist`.
- The backend runs as a Vercel serverless function through `api/index.js`.
- Keep client API calls relative (`/api`) so frontend and backend can share the same Vercel domain.

### Vercel Environment Variables
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL` set to your deployed Vercel URL
- `CLOUDINARY_*`, `STRIPE_*`, and WhatsApp credentials if you use those features

### Database
- Use MongoDB Atlas with a free M0 cluster for production
- Whitelist access from Vercel, or use Atlas network access settings that fit your deployment policy

---

## 🔑 Creating Admin Account

```bash
# After registering a normal account, update role in MongoDB Atlas:
db.users.updateOne({ email: "admin@primeride.pk" }, { $set: { role: "admin" } })
```

---

## 📦 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS v4, React Router v6 |
| State | Context API + Zustand-ready |
| Animations | Framer Motion |
| HTTP Client | Axios (with token refresh interceptor) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (access + refresh token, httpOnly cookies) |
| Images | Cloudinary + multer-storage-cloudinary |
| Payments | Stripe (cards), JazzCash/EasyPaisa (stub) |
| Notifications | WhatsApp Cloud API (Meta) |
| Validation | express-validator |
