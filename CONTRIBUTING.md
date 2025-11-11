# Contributing to Smart Hire-Hub

Thanks for your interest in contributing! This guide explains how to set up your environment, follow the coding style, and open pull requests.

## Development setup

Prerequisites:
- Node.js 18+
- npm
- MongoDB (local or a connection string)

Backend:
1. Copy env template and configure secrets
   - `backend/config/config.env.example` → `backend/config/config.env`
2. Install and run
   - `cd backend`
   - `npm install`
   - `npm run dev`

Frontend:
1. Install and run
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Coding guidelines

- Use ESLint to keep code consistent.
  - Frontend: `npm run lint` from `frontend/`
  - Backend: `npm run lint` from `backend/`
- Prefer small, focused PRs.
- Include helpful descriptions and screenshots when a UI changes.

## Commits & branches

- Create feature branches from `main` like `feat/short-desc` or `fix/short-desc`.
- Use clear commit messages (e.g., `feat(auth): add password visibility toggle`).

## Tests

- Backend tests (Jest or similar) can live under `backend/test/`.
- The CI will run backend tests if a `test` script exists in `backend/package.json` and test files are present.

## Pull requests

1. Ensure `npm run lint` passes in both `frontend/` and `backend/`.
2. Ensure the frontend builds with `npm run build` in `frontend/`.
3. Add context in the PR description: What changed, why, and how to verify.

## Reporting issues

- Open an issue describing the bug/feature with clear steps and expected behavior.
- Include environment and version details when possible.

Thank you for contributing!
