# Delivery Phases

> Status: approved 2026-10-21 · Last updated: 2026-10-21

## Phase status values

Use only: `not-started`, `in-progress`, `blocked`, `complete`.

## Phase 0 — Planning documents

- **Objective:** Approved `prd`, `design`, `architecture`, `rules`, `phases` and `memory`.
- **Dependencies:** The approved plan (discovery brief).
- **Deliverables:** The six documents in `agentic/`.
- **Verification:** Owner review.
- **Exit criteria:** Owner approves all six.
- **Status:** complete

## Phase 1 — Backend (FastAPI)

- **Objective:** Replace Flask with a FastAPI app that serves the API and the SPA.
- **Dependencies:** Phase 0.
- **Deliverables:**
  - `backend/app/**`: config, errors, rate limit, security headers, routers (health, contact, github), services, models;
  - `backend/tests/test_api.py`;
  - requirements files.
- **Verification:** `python -m tests.test_api`, `ruff check`, `mypy app`, `pip-audit`.
- **Exit criteria:** All clean, with every API status path in `architecture.md` covered.
- **Status:** complete

## Phase 2 — Frontend (React)

- **Objective:** All sections built from typed resume content, plus the agent-trace hero.
- **Dependencies:** Phase 1 (API contract).
- **Deliverables:** `frontend/` (Vite app, tokens, content, components, the one test file).
- **Verification:** `npm run lint`, `npx tsc --noEmit`, `npx vitest run`, `npm run build`, `npm audit`.
- **Exit criteria:** All clean; the site runs against the local backend.
- **Status:** complete

## Phase 3 — Polish and accessibility

- **Objective:** Meet the quality floor in `design.md` and `frontend-standards`.
- **Dependencies:** Phase 2.
- **Deliverables:** Fixes from a keyboard pass, a reduced-motion check, a contrast check (both themes) and 375/768/1440 layouts; SEO and OG meta.
- **Verification:** Contrast computed for the token pairs. Browser checks where tooling allows; otherwise handed to the owner.
- **Exit criteria:** Findings resolved or recorded.
- **Status:** complete

## Phase 4 — Ship

- **Objective:** A single deployable image; old code removed.
- **Dependencies:** Phase 3.
- **Deliverables:** Dockerfile and `.dockerignore`, rewritten README, Flask files removed, updated `HANDOVER.md`.
- **Verification:** `docker build`, then `docker run` with curl checks of `/`, `/api/v1/health`, `/api/v1/github/repos`, `/resume.pdf`, an unknown path and the security headers.
- **Exit criteria:** The container serves the site and the API; the docs are current.
- **Status:** complete
