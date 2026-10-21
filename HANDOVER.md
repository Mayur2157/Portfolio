# Handover

## Completed (2026-10-21)

**Portfolio rebuilt** as a React + TypeScript frontend with a FastAPI backend, shipped as one Docker image. Planning docs in `agentic/` were approved by the owner. All phases 0–4 are complete; see `agentic/phases.md`.

**Content:**
- Updated to the new resume: 5 roles, the M.Tech, 5 production and research projects plus 8 GitHub projects in one filterable grid, and 8 skill groups.
- The new resume PDF moved from `static/assets/` to `frontend/public/resume.pdf`.

**Backend** (`backend/`):
- Settings object; typed routers under `/api/v1` with response models.
- Domain errors mapped to 422 / 403 / 429 / 503, with safe messages only.
- Contact form: validation, honeypot, same-origin check, rate limit, async SMTP.
- GitHub stats with a 1-hour cache and last-good fallback.
- Strict CSP and security headers; request-size guard; health endpoint.

**Frontend** (`frontend/`):
- Agent-trace hero (the signature element), impact strip, experience timeline, project filters with a native `<dialog>`, skills, education and a contact form with field-level errors.
- Light/dark theme with no flash on load; reduced motion respected throughout.
- No animation library: IntersectionObserver plus CSS.

**Old code removed:** the Flask app (`app.py`, `routes.py`, `templates/`, `static/`, `Procfile`, `setup_local.py`, scraper and JSON).

## Update (2026-10-21, later)

- **Resume update applied:** the owner replaced `frontend/public/resume.pdf`. The site now matches it: phone `+91 99757 11324`, reworded Outlier and IGurus bullets, and the 2501 email (already used).
- **Render chosen:** added `render.yaml` (free Docker web service, Singapore, health check, auto-deploy on commit).
- **Rate limit on Render:** Render appends to `X-Forwarded-For`, so its first entry is spoofable. Added a `CLIENT_IP_HEADER` setting (`cf-connecting-ip` on Render); a spoofed `X-Forwarded-For` no longer resets the limit. New backend check covers this (12/12 pass). Verified in Docker with Render's environment: 5 × 503 (SMTP unset), then 429.
- **SMTP:** deferred by the owner; set it in the Render Environment tab later.

## In Progress

Nothing. All changes are uncommitted in the working tree.

## Next

- **Resume PDF:** it still prints `mayurgadekar2501@gmail.comom`. The domain should be `.com`; fix it in the PDF.
- **Deploy:** deploy on Render via the Blueprint; add `SMTP_USERNAME` and `SMTP_PASSWORD` there when ready. After the first deploy, confirm `CF-Connecting-IP` reaches the app (the rate limit falls back to the proxy IP if it doesn't).
- **Social preview:** consider an `og:image` (1200×630 PNG) for link previews; there isn't one yet.
- **Privacy notice:** owner review of the wording (v1).
- **DPDP rule:** its freshness entry was due 2026-10-24; re-verify before relying on it.

## Watchouts

- **Rate limit and cache:** the contact rate limit and GitHub cache are in-process. Fine for one instance; use Redis if the site is scaled out.
- **ESLint 9:** pinned although it is marked unsupported, because `eslint-plugin-jsx-a11y` doesn't support ESLint 10 yet. Revisit when it does.
- **TypeScript 6.0.3:** pinned because `typescript-eslint` doesn't support TS 7 yet.
- **Lockfile freeze:** `backend/requirements.txt` was frozen on Windows. `uvloop` is pinned with a Linux-only marker; the Docker build confirmed it installs.
- **Resume buttons:** they render only when `frontend/public/resume.pdf` exists at build time.

## Verification

**Backend:**
- `python -m tests.test_api` → 11/11 checks passed.
- `ruff check` / `ruff format --check` → clean.
- `mypy --strict app tests` → no issues (23 files).
- `pip-audit` → no known vulnerabilities.

**Frontend:**
- `eslint` (jsx-a11y strict, react-hooks, typescript-eslint strict) → clean. A probe file confirmed the a11y rules fire.
- `tsc --noEmit` → clean.
- Vitest → 5/5 passed.
- `vite build` → OK; JS is 85 KB gzipped.
- `npm audit` → 0 vulnerabilities.

**Browser** (headless Edge driven over the DevTools protocol, against the local server and the Docker container):
- 375 / 768 / 1440 px in both themes with no horizontal overflow.
- 45 tab stops, all with a visible focus ring.
- Dialog: focus moves in, Escape closes, focus returns. Mobile menu: same.
- Agent trace completes with live GitHub data; all reveals end visible.
- Zero console errors and zero CSP violations.

**Contrast:** all text token pairs are ≥ 4.5:1 in both themes. Form-control borders are ≥ 3:1.

**Docker:**
- `docker build` → OK.
- The container is healthy and runs as non-root.
- `/`, `/api/v1/health`, `/api/v1/github/repos` and `/resume.pdf` → 200. Unknown page → 404 HTML; unknown API path → 404 JSON. Security headers are present.

**Not verified:** real SMTP delivery (no credentials in this environment) and screen-reader output (only the semantics were checked).
