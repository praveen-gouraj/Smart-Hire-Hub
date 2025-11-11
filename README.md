# Smart Hire-Hub

Full-stack Job Portal application (React + Vite frontend, Node/Express backend, MongoDB). This repository contains a simple job board with user authentication, job posting, and application submission with resume upload.

This README gives quick setup steps for local development and describes the small CI workflow included.

## Tech stack

- Backend: Node.js, Express, Mongoose (MongoDB), Cloudinary for file hosting
- Frontend: React, Vite, TailwindCSS

## Quick start (Windows / PowerShell)

Prerequisites:
- Node.js (>=18), npm
- MongoDB running locally or a connection URI

1. Clone the repo and open a terminal in the project folder.

2. Backend: create env file

```powershell
cd backend
copy .\config\config.env.example .\config\config.env
# edit config/config.env and set MONGO_URI and Cloudinary/JWT values
notepad .\config\config.env
```

3. Install and run backend (development)

```powershell
cd ..\backend
npm install
npm run dev
```

4. Frontend: install and run

```powershell
cd ..\frontend
npm install
npm run dev
# open http://localhost:5173
```

 Notes:
 - Backend server listens on `PORT` from the env (default `4000`).
 - Cloudinary config is read from env variables (see `backend/config/config.env.example`).
 - Resume uploads now support PDF, PNG, JPEG, and WEBP. PDFs are recommended.

## CI (GitHub Actions)

A minimal CI workflow is included at `.github/workflows/ci.yml`. It installs dependencies and runs frontend lint and build. This helps verify the frontend builds correctly on push/PR.

## Recommended improvements for a submission

- Add server-side validation for all inputs (use `Joi` or `express-validator`).
- Add integration tests for critical backend routes (use `supertest` + Jest).
- Add a `.env.example` for the frontend (if it needs public envs).
- Add a `CONTRIBUTING.md` and an ER diagram or brief architecture diagram.

If you'd like, I can add tests and a GitHub Actions step to run them, or implement server-side validation for the application endpoint.
