# Technical Architecture

> Status: approved 2026-10-21 · Last updated: 2026-10-21
> This is the architecture of record. Do not maintain a second copy at the repository root.

## System context

Browser → one container running uvicorn/FastAPI. FastAPI does three things:
- serves the built React app (`frontend/dist`);
- handles `/api/v1/*`;
- makes outbound calls to SMTP (contact mail) and the GitHub REST API (repository stats).

## Technology stack and rationale

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + TypeScript + Vite | Requested; typed content; fast builds |
| Styling | Tailwind CSS v4 with `@theme` tokens | The design tokens live in one place |
| Motion | IntersectionObserver + CSS transitions (no library) | `motion` was tried and removed in Phase 2: ~35 KB gzipped for one fade-in effect, and dropping it allowed a strict `style-src 'self'` CSP |
| Backend | FastAPI, Pydantic v2, pydantic-settings | Matches the owner's stack; typed contracts; `.env` support |
| HTTP client | httpx (async) | Non-blocking GitHub calls |
| Mail | stdlib `smtplib` via `asyncio.to_thread` | No extra dependency |
| Runtime | Python 3.12, uvicorn | Stable; proxy-header support |

## Component and service boundaries

```
backend/app/
  main.py          app factory, lifespan, middleware, exception handlers, SPA static mount
  core/            config (Settings), errors (AppError tree), rate_limit, security headers
  api/deps.py      dependency providers
  api/routers/     health, contact, github — validate → call service → return typed response
  models/          Pydantic request/response models
  services/        email (SMTP), github (fetch + TTL cache)
frontend/src/
  content/         typed static content (resume data)
  components/      sections and UI primitives
  lib/             api client, hooks
```

Routers contain no business logic (`fastapi-structure` [H1]).

## Data model and storage

There is no database.
- **Content:** static TypeScript modules in the frontend.
- **GitHub stats:** in memory, with a 1-hour TTL and a last-good fallback.
- **Rate-limit counters:** in memory, per process.

## API contracts

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api/v1/health` | — | `200 {status:"ok"}` |
| POST | `/api/v1/contact` | JSON `{name, email, subject, message, website?}` | See below |
| GET | `/api/v1/github/repos` | — | `200 {repos:[{name,url,stars,language}]}`; the list is empty if GitHub is unavailable |

**`POST /api/v1/contact` responses:**

| Status | Meaning | Body |
|---|---|---|
| 202 | Accepted | `{message}` |
| 422 | Validation failed | `{message, errors:{field:msg}}` |
| 403 | Cross-origin request | `{message}` |
| 429 | Rate limited | `{message}` |
| 503 | Mail unavailable | `{message}` |

Error bodies never include internal details.

## External integrations

- **SMTP:** host, port, user, password and recipient come from `Settings`. A 15 s timeout.
- **GitHub REST:** `/users/{user}/repos?per_page=100`. An optional token raises the rate limit. A 10 s timeout.

## Authentication and authorization

None. The site is public and the API is read-only apart from the contact form.

## Security and privacy

- **Headers:**
  - strict CSP `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:`, with no inline scripts or styles;
  - `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY`;
  - HSTS when served over HTTPS.
- **Contact form:** validated at the boundary; visitor details are never logged.
- **Privacy:** the `dpdp-compliance` rule applies. The privacy notice is versioned (v1). Submissions aren't stored, only emailed.
- **Secrets:** only in environment variables or `.env` (gitignored).

## Performance and scalability

- Static assets are content-hashed and served with long cache headers; `index.html` uses `no-cache`.
- There are no runtime third-party requests from the browser.
- One process is enough for portfolio traffic. The in-memory rate limit and cache are per process (documented ceiling).

## Observability

- Standard `logging` at INFO; level set in config.
- Startup and shutdown are logged.
- SMTP and GitHub failures are logged with `exc_info`, without personal data.

## Deployment and environments

- **Build:** multi-stage Dockerfile — Node builds `frontend/dist`, then a `python:3.12-slim` runtime runs `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers`.
- **Host:** Render (`render.yaml` Blueprint; free Docker web service, Singapore).
- **Configuration:** environment variables are documented in the README. On Render: `FORWARDED_ALLOW_IPS=*` for the scheme, and `CLIENT_IP_HEADER=cf-connecting-ip` for the rate-limit key, because Render appends to `X-Forwarded-For` and its first entry is spoofable.
- **Local development:** uvicorn `--reload` on :8000, and Vite on :5173 with `/api` proxied to it.

## Testing strategy

- **Backend:** `backend/tests/test_api.py` — plain asserts using FastAPI `TestClient`, with SMTP and GitHub mocked. Plus ruff, mypy and pip-audit.
- **Frontend:** one Vitest + Testing Library file for the contact form's error mapping and the filters' `aria-pressed`. Plus ESLint (including jsx-a11y), `tsc --noEmit`, the production build and `npm audit`.
- **Manual:** keyboard, reduced motion, three widths, both themes.

## Architectural decisions and consequences

1. **Content is static in the frontend, not served by the API.** No loading flash and no fetch failure for core content. Editing content means a rebuild.
2. **One service instead of a split deploy.** No CORS and a single deploy. Static files are served by uvicorn rather than a CDN, which is acceptable at this scale.
3. **Live GitHub fetch replaces the scraper and its JSON file.** No manual step; depends on GitHub, which is mitigated by the cache.
4. **In-process rate limit instead of Redis.** Simple; resets on restart. Upgrade path: a Redis-backed limiter.

## Diagrams

```
Browser ──HTTPS──▶ [proxy/host] ──▶ uvicorn/FastAPI
                                     ├─ /            → frontend/dist (static)
                                     ├─ /api/v1/health
                                     ├─ /api/v1/contact ──▶ SMTP
                                     └─ /api/v1/github/repos ──▶ GitHub API (cached 1 h)
```
