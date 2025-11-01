# MERN + OAuth Image Search (Unsplash)

Full-stack MERN app with OAuth login, Unsplash image search, multi-select grid, top searches, and per-user history.

## Stack
- Client: React (Vite), React Router, Tailwind, Axios, Lucide
- Server: Node.js, Express 5, Passport, MongoDB (Mongoose)
- External: Unsplash Search API

## Structure
```
/client
/server
```

## Features
- OAuth login (Google, Facebook, GitHub) with sessions
- Top 5 searches banner across all users
- Unsplash search results in responsive grid (1–4 cols)
- Image multi-select with live counter
- Per-user search history with timestamps

## Setup
1) Install
```bash
cd server && npm install
cd ../client && npm install
```

2) Env files
```bash
copy server/.env.example server/.env
copy client/.env.example client/.env
# fill values in both .env files
```

3) Run
```bash
# terminal 1
cd server && npm run dev
# terminal 2
cd client && npm run dev
```
- Server: http://localhost:4000
- Client: Vite dev (e.g., http://localhost:5173)

## Env variables
- Server (server/.env): PORT, CLIENT_URL, MONGODB_URI, SESSION_SECRET, OAuth keys/callbacks, UNSPLASH_ACCESS_KEY
- Client (client/.env): VITE_API_URL

## API
- GET /api/top-searches
- POST /api/search { term }
- GET /api/history
- GET /auth/user, POST /auth/logout
- OAuth: /auth/google, /auth/facebook, /auth/github (+ /callback)

## Proof
Add screenshots/GIFs (login, banner, results+multi-select, history) under /screenshots and reference here.

## Production recommendations
- Use connect-mongo session store, helmet, express-rate-limit
- app.set('trust proxy', 1) and secure cookies behind HTTPS
- CORS allowlist your client origins

## License
MIT
