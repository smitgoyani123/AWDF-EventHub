# 🎟️ EventHub — Ticket Booking System

> A full-stack MERN application for browsing events, booking tickets, and managing bookings — with Docker support.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 19 + Vite + React Router v7 |
| Backend    | Express.js + Node.js (CommonJS)   |
| Database   | MongoDB 7 + Mongoose              |
| Auth       | JWT (jsonwebtoken) + bcryptjs     |
| HTTP Client| Axios                            |
| Containerisation | Docker + Docker Compose     |
| Reverse Proxy | Nginx (in Docker)             |

---

## 📁 Folder Structure

```
itue301-exam-24it026-B1/
├── frontend/                # React SPA (Vite)
│   ├── src/
│   │   ├── components/      # EventCard, Navbar, ProtectedRoute
│   │   ├── context/         # AuthContext (JWT + user state)
│   │   ├── pages/           # LoginPage, EventsPage, MyTicketsPage, OrganizerPanel
│   │   ├── App.jsx          # Root component with routes
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── nginx.conf           # Nginx config for Docker (SPA + API proxy)
│   ├── Dockerfile           # Multi-stage: build + nginx
│   ├── .dockerignore
│   ├── vite.config.js       # Vite config with /api proxy for dev
│   └── package.json
│
├── backend/                 # Express API
│   ├── config/db.js         # Mongoose connection helper
│   ├── models/              # Attendee, Event, Ticket schemas
│   ├── middleware/           # requestLogger, authGuard, errorHandler
│   ├── routes/              # auth, events, tickets route files
│   ├── server.js            # Express entry point
│   ├── seed.js              # Database seeder (3 users + 5 events)
│   ├── Dockerfile           # node:20-alpine production image
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml       # 3 services: mongo, backend, frontend
├── .env                     # Root env vars (gitignored)
├── .env.example             # Template for .env
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Setup

1. Copy the example env file:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. Edit `.env` (and `backend/.env` for local dev) with your values:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/eventhub
   JWT_SECRET=eventhub_super_secret_key_2026
   ```

---

## 🚀 Local Run Steps (without Docker)

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally on port 27017

### Backend
```bash
cd backend
npm install
npm run seed     # Seed the database with demo data
npm start        # Starts Express on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

> The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## 🐳 Docker Run Steps

### Prerequisites
- Docker and Docker Compose installed

### Build & Run
```bash
# Build all 3 containers and start them
docker compose up --build

# In a separate terminal, seed the database
docker compose exec backend npm run seed
```

### Access
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api/v1 (proxied through nginx)
- **Health Check**: http://localhost:3000/api/v1/../health

### Stop
```bash
docker compose down           # Stop containers
docker compose down -v        # Stop and remove volumes (deletes DB data)
```

---

## 🔐 Demo Login Credentials

| Role       | Email                   | Password       |
|------------|-------------------------|----------------|
| Admin      | admin@eventhub.com      | admin123       |
| Organizer  | priya@organizer.com     | organizer123   |
| Attendee   | rahul@example.com       | attendee123    |

---

## 📡 API Endpoint List

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint                    | Auth     | Description                                |
|--------|-----------------------------|-----------|--------------------------------------------|
| GET    | `/health`                   | No       | Health check                               |
| POST   | `/api/v1/auth/login`        | No       | Login with email & password, returns JWT    |
| GET    | `/api/v1/events`            | No       | Get all events                             |
| POST   | `/api/v1/events`            | Yes (org/admin) | Create a new event                  |
| POST   | `/api/v1/tickets`           | Yes      | Book tickets for an event                  |
| GET    | `/api/v1/tickets/my`        | Yes      | Get logged-in user's tickets               |
| PATCH  | `/api/v1/tickets/:id/status`| Yes      | Update ticket status (book/cancel/use)     |

---

## 🧪 Test with cURL

### 1. Login (get a JWT token)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul@example.com","password":"attendee123"}'
```

### 2. Book tickets (returns 201)
```bash
# Replace <TOKEN> with the JWT from step 1
# Replace <EVENT_ID> with a real event _id from GET /api/v1/events
curl -X POST http://localhost:5000/api/v1/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"eventId":"<EVENT_ID>","quantity":2}'
```

### 3. Book too many tickets (returns 400)
```bash
curl -X POST http://localhost:5000/api/v1/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"eventId":"<EVENT_ID>","quantity":9999}'
```

---

## 📸 Screenshot Checklist

- [ ] Login Page with quick demo buttons
- [ ] Events Page with event cards and search box
- [ ] Booking form (quantity selector + confirm)
- [ ] Sold-out event badge
- [ ] My Tickets Page with booked tickets
- [ ] Ticket cancel functionality
- [ ] Organizer Panel (create event form)
- [ ] Docker containers running (`docker ps`)
- [ ] Seed output in terminal
- [ ] curl login response (JSON with token)
- [ ] curl 201 booking response
- [ ] curl 400 error response (not enough tickets)

---

## 👨‍💻 Author

- **Enrollment**: 24IT026
- **Batch**: B1
- **Subject**: ITUE301 — Advanced Web Development Framework

---
