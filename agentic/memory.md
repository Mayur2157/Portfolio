# Project Memory

> Last updated: 2026-10-21
> Durable product decisions and state. Session-level state belongs in `HANDOVER.md`.

## Approved decisions and rationale

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-21 | FastAPI backend replaces Flask | Matches the owner's stack and this repo's Python/FastAPI rules |
| 2026-10-21 | One Docker service serves both the SPA and the API | Single deploy, no CORS |
| 2026-10-21 | Compressed kickoff: approved plan = discovery brief; six docs approved in one pass | Owner's choice |
| 2026-10-21 | All 13 projects in one filterable grid, newest first | Owner's choice |
| 2026-10-21 | The site shows the existing contact email and the phone number from the new resume | Owner's choice. Values live in the frontend content and backend settings only, not in these docs |
| 2026-10-21 | Self-rated skill percentages and Chart.js dropped | Self-ratings carry no information; saves bundle weight |
| 2026-10-21 | Profile says "M.Tech … (2026)" rather than "M.Tech candidate" | The resume's own education section says the degree was completed in September 2026 |
| 2026-10-21 | The VLM project says "written up in IEEE conference format" | Faithful to the resume; doesn't overstate it as "published" |
| 2026-10-21 | CGPA dropped | Not on the new resume |
| 2026-10-21 | `motion` library removed; scroll reveal uses IntersectionObserver + CSS | ~35 KB gzipped for one effect; enables a strict CSP without `'unsafe-inline'` |
| 2026-10-21 | Resume skills grouped into 8 categories and de-duplicated | The resume lists several items twice; nothing was added |
| 2026-10-21 | Hosting on Render (free Docker web service, Singapore) | Owner's choice; Singapore is the closest region to India |
| 2026-10-21 | Rate-limit key read from `CF-Connecting-IP` on Render | Render appends to `X-Forwarded-For`, so its first entry is client-spoofable |
| 2026-10-21 | Site updated to the owner's revised resume (new phone number, reworded Outlier and IGurus bullets) | The resume is the source of truth for site content |
| 2026-10-21 | ESLint pinned to 9.x though it is marked unsupported | `eslint-plugin-jsx-a11y` doesn't support ESLint 10 yet; dev-only tooling |

## Current progress

All phases complete (2026-10-21). The Flask site has been removed; the React + FastAPI site ships as one Docker image. Verification evidence is in `HANDOVER.md`.

## Important context

- The Flask hardening done earlier this session (validation, rate limit, honeypot, same-origin check, escaping, accessibility fixes, dependency bumps) is ported, not discarded.
- `github_repos.json` and the scraper are replaced by a live cached fetch in Phase 1.

## Active risks

- The rate-limit and GitHub caches are per process. Fine for one instance; revisit if scaled out.
- The DPDP rule's freshness entry was due for re-verification on 2026-10-24.

## Unresolved noncritical questions

- Resume PDF still prints a mistyped email domain. SMTP credentials (deferred by the owner). Privacy-notice wording review. `og:image` for link previews.

## Changes affecting future work

- Content edits happen in `frontend/src/content/*.ts` and need a rebuild.

---

**Never record here:** secrets, credentials, access tokens, API keys, connection strings, or personal data.
