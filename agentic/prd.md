# Product Requirements Document

> Status: approved 2026-10-21 · Last updated: 2026-10-21

## Product vision

A personal portfolio that reads as the work of a production AI/ML engineer: specific, credible and polished. The site and its backend are themselves evidence of the owner's engineering practice.

## Problem statement

The current site reflects an outdated resume: it lists the wrong current role, omits the M.Tech and leaves out all production GenAI work. It also uses generic "AI portfolio" styling: glassmorphism, particles, a fake loading screen and self-rated skill percentages. Recruiters and hiring managers get an inaccurate and undifferentiated picture.

## Target users and needs

| User | Need |
|---|---|
| Recruiters / hiring managers | Within about 30 s: current role, depth of GenAI experience, measurable impact, a resume download and a way to make contact |
| Technical interviewers | Project detail: architecture, stack and results; links to code where public |
| Site owner | Content kept current by editing typed content files, not markup |

## Goals

1. Accurately present the new resume: profile, 5 roles, 5 resume projects, skills, education and courses.
2. A distinctive, modern visual identity grounded in the owner's domain (agentic and RAG systems).
3. A React frontend and a FastAPI backend that follow this repo's rules pack.
4. A single deployable service.

## Non-goals

- Blog, CMS, admin UI or authentication.
- Server-side rendering or a static-site generator.
- Analytics or tracking scripts.
- Storing contact-form submissions (they are only emailed).

## Use cases and user stories

- As a recruiter, I can download the resume from the first screen.
- As a recruiter, I can send a message through the contact form and see clear confirmation or errors.
- As an interviewer, I can filter projects by area and open a project to read its details.
- As any visitor, I can use the whole site by keyboard, with a screen reader, on a phone and with reduced motion.

## Functional requirements

1. **Sections:** hero with the agent-trace signature element, impact metrics, experience timeline, projects, skills, education and courses, contact, footer.
2. **Projects:** 13 projects (5 from the resume plus 8 public GitHub repos) in one grid, newest first, with category filters and a details dialog. Live star counts and languages for public repos.
3. **Contact form:**
   - validated server-side (required fields, length limits, email format, single-line subject);
   - field-level errors in the UI;
   - same-origin check, honeypot and per-IP rate limit;
   - delivered by SMTP to the configured contact address.
4. **Resume:** downloadable as a PDF.
5. **Theme:** light/dark toggle. Follows the system setting until the visitor chooses, with no flash of the wrong theme.
6. **Health:** a health endpoint for the host.

## Non-functional requirements

- **Accessibility:** WCAG 2.2 AA.
- **Motion:** respects `prefers-reduced-motion`.
- **Responsive:** works at 375 / 768 / 1440 px with no horizontal scroll.
- **Security:**
  - strict CSP (`script-src 'self'`) and standard security headers;
  - no secrets in the client;
  - no internal error details leaked.
- **Dependencies:** no known vulnerabilities in pinned dependencies (`pip-audit`, `npm audit`).
- **Performance:** fonts self-hosted, no third-party CDN at runtime, small JS bundle (no chart or UI-kit libraries).

## Success metrics

- All content matches the resume, with the documented wording exceptions in `memory.md`.
- Lint, typecheck, tests, build and audits are clean.
- Keyboard, reduced-motion and three-width checks pass.

## Constraints and dependencies

- **Stack:** React + TypeScript + Vite; FastAPI (Python 3.12) for the backend.
- **Deployment:** one Docker image.
- **Mail:** SMTP credentials are provided at deploy time.
- **GitHub:** the public API, unauthenticated (60 requests/hour), cached for 1 hour.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| GitHub API down or rate-limited | Last-good cache; the UI hides stars when there's no data |
| Contact-form spam | Honeypot, same-origin check, per-IP rate limit |
| Rate limit sees the proxy IP instead of the visitor's | uvicorn `--proxy-headers` with `FORWARDED_ALLOW_IPS`, documented per host |
| Overstated claims in copy | Copy taken from the resume; deliberate wording changes recorded in `memory.md` |

## Open questions

| Question | Critical? | Owner | Status |
|---|---|---|---|
| Updated resume PDF placed at `frontend/public/resume.pdf` | No | Site owner | Done (email typo in the PDF still open) |
| Hosting provider | No | Site owner | Done: Render |
| Privacy-notice wording review | No | Site owner | Open |

## Acceptance criteria

- Every functional requirement is implemented and passes the checks in `phases.md`.
- No Flask code remains.
- `docker run` serves both the site and the API.

## Release scope

The full site in one release. Nothing ships partially.
