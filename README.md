# Mayur Gadekar — AI/ML Engineer Portfolio

Personal portfolio: a React + TypeScript site served by a FastAPI backend, shipped as one Docker image.

- **Frontend** (`frontend/`): React 19, TypeScript, Vite, Tailwind CSS v4. All resume content lives in typed modules under `frontend/src/content/`.
- **Backend** (`backend/`): FastAPI, Pydantic v2 and pydantic-settings. It serves the built site, a contact-form API (SMTP), a cached GitHub repo-stats API and a health check.
- **Planning docs** (`agentic/`): the approved PRD, design, architecture, engineering rules, phases and decision log.

## Run it locally

You need Python 3.12 and Node 24.

```bash
# Backend: http://127.0.0.1:8000
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Mac/Linux
pip install -r requirements-dev.txt
uvicorn app.main:app --reload

# Frontend, in a second terminal: http://localhost:5173 (proxies /api to the backend)
cd frontend
npm ci
npm run dev
```

After `npm run build`, the backend serves `frontend/dist` itself at http://127.0.0.1:8000.

## Configuration

Settings are read from environment variables or a `.env` file at the repo root or in `backend/` (see `backend/app/core/config.py`). All are optional.

| Variable | Purpose |
|---|---|
| `SMTP_HOST`, `SMTP_PORT` | Mail server (default `smtp.gmail.com:587`, STARTTLS) |
| `SMTP_USERNAME`, `SMTP_PASSWORD` | Mail account. For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833). Without these, the contact form returns "couldn't be sent" |
| `SMTP_SENDER` | From address (defaults to `SMTP_USERNAME`) |
| `CONTACT_EMAIL` | Inbox that receives contact-form messages |
| `GITHUB_USERNAME`, `GITHUB_TOKEN` | Account whose public repos show star counts. The token is optional and only raises GitHub's rate limit |
| `CONTACT_RATE_LIMIT`, `CONTACT_RATE_WINDOW_SECONDS` | Messages allowed per visitor IP per window (default 5 per hour) |
| `LOG_LEVEL` | `DEBUG`, `INFO` (default), `WARNING`, `ERROR` |
| `ENABLE_DOCS` | `true` exposes OpenAPI docs at `/api/v1/docs` |
| `FORWARDED_ALLOW_IPS` | Read by uvicorn. Set it to your host's proxy IPs (or `*` when the container is reachable only through the platform proxy) so the original `https` scheme is honoured |
| `CLIENT_IP_HEADER` | Header holding the real visitor IP for the contact rate limit, when an edge proxy sets it (`cf-connecting-ip` on Render). Leave unset elsewhere |

## Checks

```bash
cd backend
python -m tests.test_api                  # API self-check (12 checks)
ruff check . && ruff format --check .
mypy app tests
pip-audit -r requirements.txt

cd frontend
npm run lint                              # ESLint incl. jsx-a11y and react-hooks
npm run typecheck
npm test                                  # Vitest
npm run build
npm audit
```

## Docker

```bash
docker build -t portfolio .
docker run -p 8000:8000 --env-file .env portfolio
```

The image builds the site with Node, then runs `uvicorn` on `$PORT` (default 8000) as a non-root user, with a health check on `/api/v1/health`.

## Deploy on Render

`render.yaml` is a Render Blueprint for a free Docker web service in Singapore.

1. Push this repository to GitHub.
2. In Render: **New → Blueprint**, then pick the repository. Render reads `render.yaml` and creates the service. It redeploys on every push to the branch.
3. **Contact email (later):** in the service's **Environment** tab, add `SMTP_USERNAME` (your Gmail address) and `SMTP_PASSWORD` (a Gmail [App Password](https://support.google.com/accounts/answer/185833), not your normal password), then save. Until then, the contact form tells visitors their message couldn't be sent and points them to your email.

On the free plan the service sleeps when idle, so the first visit after a quiet spell takes longer to load.

## Updating content

| What | Where |
|---|---|
| Profile, tagline, impact metrics, contact details | `frontend/src/content/profile.ts` |
| Roles | `frontend/src/content/experience.ts` |
| Projects (ordered automatically, most recent first) | `frontend/src/content/projects.ts` |
| Skills, education, courses | `frontend/src/content/skills.ts` |
| Resume PDF | `frontend/public/resume.pdf` (the download buttons appear only when this file exists at build time) |

GitHub star counts are fetched live and cached for an hour, so there's no manual refresh step.
