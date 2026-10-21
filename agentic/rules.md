# Engineering Rules

> Status: approved 2026-10-21 · Last updated: 2026-10-21
> Project-specific rules. These sit above `.agents/rules/**` in the precedence hierarchy — see `.agents/PRIORITY.md`.

## Mandatory conventions

- **[H1]** Site content (profile, roles, projects, skills) lives only in `frontend/src/content/*.ts`. Components never hardcode resume facts.
- **[H2]** Every API route sits under `/api/v1`, declares a `response_model`, and returns safe error bodies.
- **[H3]** Configuration is read only through `backend/app/core/config.py:Settings`.
- **[S1]** One component per file, named after its export. Section components live in `components/sections/`.

## Coding and naming standards

- **[H4]** TypeScript in `strict` mode, with no `any`. Python has full type hints and passes `mypy`.
- **[S2]** Naming: Python uses snake_case; TS uses camelCase for values and PascalCase for components and types. CSS uses design tokens, never raw hex values in components.

## Testing requirements

- **[H5]** `backend/tests/test_api.py` covers every API status path listed in `architecture.md`.
- **[H6]** The frontend test covers contact-form error mapping and filter state.

## Security requirements

- **[H7]** No `dangerouslySetInnerHTML`. No inline `<script>` (the CSP is `script-src 'self'`).
- **[H8]** Never log contact-form field values.
- **[H9]** No secrets in the repository; `.env` stays gitignored.

## Dependency and version constraints

- **[H10]** Exact pins in `requirements*.txt` and `package-lock.json`. Each new package is checked for its real name, maintenance status, license and advisories before it's added.
- **[S3]** Prefer versions released at least 2 weeks ago.

## Verification tooling

| Tool | Invocation | When it runs | Reporting requirements |
|---|---|---|---|
| pip-audit | `pip-audit -r backend/requirements.txt` | Before completing a phase that changes Python dependencies | Report the findings count |
| npm audit | `npm audit --omit=dev` (in `frontend/`) | Before completing a phase that changes JS dependencies | Report the findings count |

No automated code-review tool is configured.

## Documentation expectations

- The README covers local development, environment variables, Docker and deployment.
- `HANDOVER.md` is updated at the end of each session.

## Definition of done

Lint, typecheck, tests, build and audits are all clean, with the exact commands and outcomes reported. Manual checks (keyboard, reduced motion, three widths) are reported as done or explicitly handed to the owner.

## Forbidden practices

- Placeholder content, `#` links or dead buttons.
- Self-rated skill percentages.
- Overstating claims beyond the resume.

## Approved exceptions to `.agents/rules/**`

| Rule ID | Exception | Reason | Approved by | Date |
|---|---|---|---|---|
| ui-redesign [H2] | The frontend migrates from Jinja/Bootstrap to React | Explicitly requested by the owner | Site owner | 2026-10-21 |
| minimal-change [H3] | The frontend check uses Vitest (a test framework) | jsdom is needed to test React components; there is no assert-only alternative | Site owner | 2026-10-21 |
