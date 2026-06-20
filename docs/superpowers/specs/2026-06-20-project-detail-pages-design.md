# Project detail pages: design

## Problem

Project detail content currently lives in `ProjectModal`, a client-state-driven
overlay opened from `MyWork.tsx` (home) and `work/page.tsx` (list). It has no
URL of its own — everything happens inside `/` or `/work` — and the content is
still a placeholder ("COMING SOON" + a live-site link).

We want each project to be a real, shareable, directly-loadable page
(`quang.studio/work/minswap`), entered/exited with a specific choreographed
transition, with a defined structural skeleton (not final content design).

## Goals

- Each project gets a real Next.js route: `/work/[slug]`.
- Clicking "View details" (from home cards or the `/work` list) navigates
  there with a transition: the page being left scales down while the new
  page's containers fade in and slide up, all simultaneously, same duration.
- Closing (X button or browser back) reverses the transition and returns to
  whichever page the user actually came from.
- Navigating to the next/previous project (a dedicated in-page section) reuses
  the same choreography between two detail pages.
- Direct loads / refreshes / shared links render the same page correctly
  (just without an "outgoing page" to animate).
- `/about` and `/contact` are unaffected — this is scoped to work pages only.

## Non-goals

- Designing real case-study content (galleries, write-ups, etc.). Each detail
  page gets a defined structural skeleton (see below); content stays
  placeholder/minimal.
- Touching `src/data/projects.ts` — that's an unused template file, not the
  active data source (`src/lib/projects.ts` is, and stays so).

## Routing & data

- New route: `src/app/work/[slug]/page.tsx` — a server component that calls
  `generateStaticParams()` from `PROJECTS` (in `src/lib/projects.ts`) and
  `generateMetadata()` per project (title, OG image from `thumbnail`). It
  renders a client component (`ProjectDetail`) for the actual UI.
- `src/lib/projects.ts` gains a small helper to get the next/previous project
  by slug, wrapping around at the ends.
- `MyWork.tsx` and `work/page.tsx`: `onSelect(project)` changes from
  `setSelected(project)` to navigating to `/work/${project.slug}` (via
  `router.push`), flagging the navigation as a work-flow transition (see
  below) before pushing.
- `ProjectModal.tsx` and the `selected` state in both files are removed. Its
  easing (`[0.22, 1, 0.36, 1]`) and panel-slide values carry over into the new
  transition code.

## Page structure

Every `/work/[slug]` page renders as:

```
Page Container   — fixed, inset-0, bg = var(--foreground), padding = var(--section-padding)
  Body Container — fills remaining space, bg = var(--background), padding = var(--section-padding), overflow-y: auto
    Section 1 — 100dvh — project name only
    Section 2 — 100dvh — image/video overview
    Section 3 — 100dvh — previous/next project navigation
    Section 4 — 100dvh — Footer (reuse existing <Footer/> as-is)
  Close (X) button — overlaid top-right on the Page Container, calls router.back()
```

`var(--section-padding)` already resolves to 8px/32px/56px (mobile/tablet/
desktop) — exactly the spec — so no new tokens are introduced. No global
`Navbar` on this page (kept minimal/immersive, matching the current modal's
header treatment); just the close control.

Section 3 shows both a "previous project" and "next project" link, wrapping
around at the ends of `PROJECTS`.

## Transition choreography

A single duration `D` (~0.6s, ease `[0.22, 1, 0.36, 1]`, matching values
already used elsewhere in the codebase) governs all three concurrent
animations on open:

- Outgoing page (home or work list) scales down, 1 → ~0.92.
- Incoming Page Container fades in, opacity 0 → 100%.
- Incoming Body Container slides up, translateY 100% → 0.

Closing (X button or back) is the symmetric reverse: Body Container slides
back down, Page Container fades out, and the page underneath (whichever the
user actually came from — `router.back()` handles this naturally) scales back
up to 1.

Previous/next (detail → detail) reuses the same choreography: current detail
page treated as "outgoing" (fades out + slides down), next/prev detail page
"incoming" (fades in + slides up).

Direct load / refresh / shared link: there's no outgoing page, so that part
is simply skipped; the Page/Body Container entrance still plays.

### Implementation note

This lives in one scoped client component mounted once in the root layout,
wrapping `{children}` in an `AnimatePresence` keyed by pathname. It only
distinguishes three route "kinds" — list (`/`, `/work`), detail
(`/work/[slug]`), and other (`/about`, `/contact`) — and only plays the
special choreography for list↔detail and detail↔detail transitions; "other"
routes pass through untouched, exactly as they behave today. Because Framer
Motion decides an outgoing element's exit animation at the moment it was last
rendered (not at the moment it's removed), each trigger (open/close/prev/next)
sets a small shared flag right before navigating, the same way `ProjectModal`
already tracks swipe `direction` today — this tells the wrapper "this
navigation is part of the work flow" so it knows to animate rather than swap
instantly.

## File changes

- `src/app/work/[slug]/page.tsx` — new, server component (metadata + static
  params), renders `ProjectDetail`.
- `src/components/sections/ProjectDetail.tsx` — new, client component with the
  Page/Body Container structure, 4 sections, close button, prev/next links.
- `src/components/ui/WorkTransition.tsx` — new, client component, the scoped
  root-layout transition coordinator described above.
- `src/app/layout.tsx` — wrap `{children}` with `<WorkTransition>`.
- `src/components/sections/MyWork.tsx` — replace modal state with navigation.
- `src/app/work/page.tsx` — replace modal state with navigation.
- `src/lib/projects.ts` — add next/previous helper.
- `src/components/ui/ProjectModal.tsx` — deleted (retired).
