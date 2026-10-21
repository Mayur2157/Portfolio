# Handover

## Completed (2026-10-21)

- **Security:** dependency pins bumped to clear 32 known advisories (Flask, Werkzeug, urllib3, requests, gunicorn, idna, certifi). Debugger now opt-in via `FLASK_DEBUG=1`. No hardcoded secret-key fallback. Log level configurable (default INFO).
- **Contact form:** server-side validation with length limits and email format, field-level errors in the UI, same-origin check, honeypot, per-IP rate limit (5/hour, in-process), clean JSON on SMTP failure. Visitor details are not logged.
- **Privacy:** plain-language privacy notice (v1) shown with the contact form.
- **Projects:** stars/language merged from `github_repos.json`. Scraper now paginates to 100, times out, and no longer overwrites the JSON with `[]` on failure. Hero project count is rendered from the data.
- **Frontend:**
  - Project data is HTML-escaped. The modal reuses loaded data.
  - Loading, empty and error states for the projects list and the skills charts. The duplicated fallback skills data was removed.
  - Keyboard-operable "View Details" button. Labels on icon-only controls. `aria-pressed` on the filters. A visible focus ring.
  - Theme applied before first paint, and follows the system theme until toggled.
  - Chart.js pinned to 4.5.1. Footer year is dynamic.
- **Errors:** real 404/500 page (`templates/error.html`).
- **Hygiene:** `.gitignore`, `__pycache__` untracked, duplicate resume PDF removed (the download keeps its friendly filename). `requirements.txt` re-saved as UTF-8. README and `setup_local.py` aligned with how the app actually runs.

## In Progress

Nothing. All changes are uncommitted in the working tree.

## Next

- Decide whether to add `python-dotenv` so a `.env` file is loaded automatically (new dependency, so this needs a go-ahead).
- Respect `prefers-reduced-motion` (AOS, Typed.js, particles, loading spinner): frontend-standards [H10].
- Give the skills charts a text alternative (canvas content is invisible to screen readers).
- The `python-structure` rule asks for Pydantic models at I/O boundaries and a settings object. Not adopted: it would add dependencies. Decide whether to adopt or record an exception.
- README references a LICENSE file that does not exist.

## Watchouts

- Set `PROXY_COUNT=1` on the host (Heroku/Render) or every visitor shares one rate-limit bucket.
- The rate limit is per process and resets on restart. Upgrade to Flask-Limiter + Redis if spam becomes real.
- The privacy notice wording should be reviewed by the site owner. It is not a compliance claim. The DPDP rule's freshness entry was due for re-verification on 2026-10-24.
- `gunicorn` does not run on Windows. Use `python main.py` locally.
- Restart the app after running `github_scraper.py`; the JSON is read at startup.

## Verification

- `python test_app.py` → "All checks passed.", exit code 0 (Flask 3.1.3 / Werkzeug 3.1.9, Python 3.14).
- `pip-audit -r requirements.txt` → "No known vulnerabilities found".
- `node --check` on `static/js/*.js` → all OK.
- Dev server smoke test: `/`, `/api/projects`, `/api/skills`, static assets → 200. `/nope` → 404 HTML. `/download-resume` → 200 PDF. Cross-origin POST `/contact` → 403. Invalid email → 400 with a field error.
- **Not done:** visual check in a real browser at 375/768/1440 widths (no browser available in this session).
