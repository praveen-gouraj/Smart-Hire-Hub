# Smart Hire‑Hub

Full‑stack job portal: React + Vite + Tailwind (frontend) and Node/Express + MongoDB (backend). Supports Employer and Job Seeker roles, job CRUD, applying with resume (PDF/images), JWT auth, and a simple profile for auto‑prefill.

## Quick start (Windows / PowerShell)

Prereqs: Node.js ≥ 18, npm, MongoDB.

1) Backend
```powershell
cd backend
copy .\config\config.env.example .\config\config.env
notepad .\config\config.env   # set MONGO_URI, JWT/Cloudinary, FRONTEND_URL
npm install
npm run dev
```

2) Frontend (new terminal)
```powershell
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

## Environment (backend)
Create `backend/config/config.env` (see example):
- PORT (default 4000)
- FRONTEND_URL (http://localhost:5173)
- MONGO_URI
- JWT_SECRET_KEY, JWT_EXPIRES (e.g. 7d), COOKIE_EXPIRE (days)
- CLOUDINARY_CLIENT_NAME, CLOUDINARY_CLIENT_API, CLOUDINARY_CLIENT_SECRET

## Scripts
- backend: `npm run dev`, `npm run lint`
- frontend: `npm run dev`, `npm run build`, `npm run lint`

## Notes
- Resumes: PDF, PNG, JPEG, WEBP (Cloudinary folder: resumes/).
- API base: http://localhost:4000 (see routes under `/api/v1/*`).

## CI
GitHub Actions (`.github/workflows/ci.yml`) lints/builds frontend and lints backend. Backend tests run automatically if you add a test script and test files.

## Contributing & License
See `CONTRIBUTING.md`. Licensed under MIT (`LICENSE`).
