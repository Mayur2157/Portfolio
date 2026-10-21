# Product Design

> Status: approved 2026-10-21 · Last updated: 2026-10-21

## Design principles

1. **Specific over generic.** Real metrics, real stack names and real project detail, with no decorative filler.
2. **One signature, everything else quiet.** The hero agent trace spends the design's boldness; every other section stays restrained.
3. **Accessible by construction.** Semantic HTML, a visible focus indicator, and reduced motion as a first-class state.

## User journeys and flows

- **Recruiter:** hero → resume download, or contact form.
- **Interviewer:** hero → projects → filter → details dialog → GitHub (where public).
- **Contact:** fill the form → submit (button shows a loading state) → success toast and form reset, or field errors with focus moved to the first invalid field.

## Information architecture

A single page with anchor sections:

`#home` (hero) · `#impact` · `#experience` · `#projects` · `#skills` · `#education` · `#contact`

The sticky top nav links to Experience, Projects, Skills and Contact, plus a theme toggle and a Resume button. On mobile the nav collapses into a disclosure menu.

## Screens and states

| Area | Loading | Empty | Error | Success |
|---|---|---|---|---|
| Agent trace | Plays the static steps | — | GitHub step omitted | Full trace including the repo count |
| Project stars | Hidden until data arrives | Hidden | Hidden (the card is still complete) | Star count and language shown |
| Project grid | — (content is static) | "No projects in this category" message | — | Cards |
| Contact form | Submit disabled, showing "Sending…" | — | Field errors, or a banner (rate limit, server, network) | Toast, form reset |

## Interaction behavior

- **Filters:** toggle buttons with `aria-pressed`; one active at a time.
- **Project details:** a native `<dialog>`. Focus moves into it, Escape closes it, and focus returns to the opening card's button.
- **Theme toggle:** its `aria-label` names the theme it switches to.
- **Motion:** sections fade and rise once on scroll. With reduced motion, everything shows its final state with no animation.

## Responsive behavior

| Width | Layout |
|---|---|
| < 768 px | Single column, nav collapsed |
| ≥ 768 px | Projects in 2 columns |
| ≥ 1024 px | Hero splits into intro and trace panel |
| ≥ 1440 px | Content capped at 1200 px wide |

Touch targets are at least 44 × 44 px.

## Accessibility

- WCAG 2.2 AA throughout.
- Landmarks (`header`, `nav`, `main`, `footer`), one `h1`, and headings in order.
- Every form control has a `<label>`; errors are linked with `aria-describedby` and `aria-invalid`.
- Toasts use `role="status"` or `role="alert"`.
- Decorative icons are `aria-hidden`.
- A skip link goes to `#main`.
- The agent trace is announced once as its final text (`aria-live="off"`, with an `sr-only` summary).

## Visual direction

"Inference console": a calm ink-blue canvas, teal as the signal colour, amber reserved for live trace activity. Monospace is used only for labels, metadata and the trace.

## Design system

### Colors

| Token | Dark | Light |
|---|---|---|
| `bg` | `#0B1120` | `#F7F8FB` |
| `surface` | `#111A2E` | `#FFFFFF` |
| `line` | `#22304D` | `#DCE1EA` |
| `field` (form-control borders, ≥3:1) | `#62739A` | `#7D879C` |
| `text` | `#E6EBF5` | `#0E1526` |
| `muted` | `#93A1BC` | `#4A5670` |
| `primary` | `#2DD4BF` | `#0F766E` |
| `accent` | `#F5B54A` | `#B45309` |

Text pairs are checked against AA contrast during Phase 3.

### Typography scale

- **Fonts:** Instrument Sans (UI and headings), JetBrains Mono (labels, trace). Both self-hosted.
- **Scale (rem):** 0.8125 · 0.9375 · 1.0625 · 1.375 · 2 · 3.25.
- **Weights:** 400 for body, 600 for headings. Tight tracking on display sizes.

### Spacing

A 4 px base, using the Tailwind default scale. Sections are padded 96 px vertically on desktop and 64 px on mobile.

### Radii

`sm` 6 px (chips) · `md` 10 px (buttons, inputs) · `lg` 16 px (cards, dialog).

### Shadows

Mostly none. Dark theme uses a 1 px `line` border instead. Light theme uses one soft elevation for cards and the dialog.

### Icons

`lucide-react` at 1.5 px stroke, plus inline SVG for the LinkedIn and GitHub logos.

### Components and variants

- **Button:** primary, secondary, ghost.
- **Chip:** neutral, active.
- **Badge:** "Production · private", category.
- **Card:** project card.
- **Dialog:** project details.
- **Field:** input, textarea; each with label, error and hint.
- **Toast.**
- **TraceLine:** pending, running, done.

### Interactive states

Every interactive element has default, hover, `focus-visible` (2 px `primary` outline with 2 px offset), active, disabled and loading states where applicable.

## Diagrams

```
[Nav] ─ sticky
[Hero: intro | AgentTrace]
[Impact: 3 metrics]
[Experience timeline]
[Filters] [Project grid] → <dialog>
[Skills groups]
[Education | Courses]
[Contact form | direct links]
[Footer]
```
