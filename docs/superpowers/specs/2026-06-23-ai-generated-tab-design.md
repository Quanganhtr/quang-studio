# AI Generated tab: design

## Problem

The `/work` page has three tabs (`Showcase`, `AI Generated`, `Behind the UI`),
but only `Showcase` renders content — the other two fall through to an empty
placeholder section. `AI Generated` already shows a badge count of 3 in the
tab bar with no backing data.

We want the `AI Generated` tab to render a vertical list of full-width cards,
each pairing a short title header with a 16:9 video or image, linking out to
an external X (Twitter) post where the full piece lives.

## Non-goals

- `Behind the UI` stays an empty placeholder (count is 0, no content yet).
- No new detail page/route — these cards link externally, not to `/work/[slug]`.
- Not reusing `ProjectRow`'s scroll-driven width animation (5/12 ↔ 7/12 column
  resize tied to `useScroll`/`useTransform`) — these cards are static and
  full-width, so that machinery doesn't apply.
- Not sourcing real content for all 3 cards. Only `public/ai-1.mp4` exists
  today; the other two entries are placeholders for the user to fill in later.

## Data model

New type and array in `src/lib/projects.ts`, alongside `Project`:

```ts
export type AIGeneratedItem = {
  eyebrow: string;                      // e.g. "My Proudest Child"
  title: string;                        // e.g. "Minswap"
  media: { type: "video" | "image"; src: string };
  linkUrl: string;                      // external X/Twitter post URL
};

export const AI_GENERATED: AIGeneratedItem[] = [
  {
    eyebrow: "My Proudest Child",
    title: "Minswap",
    media: { type: "video", src: "/ai-1.mp4" },
    linkUrl: "#", // TODO: real X post URL
  },
  // 2 more placeholder entries (TODO: real eyebrow/title/media/linkUrl)
];
```

## Component

A new `AIGeneratedCard` component, defined in `src/app/work/page.tsx`
alongside `ProjectRow` (small enough not to warrant its own file, and only
used on this page). Markup mirrors `ProjectRow`'s header structure but drops
the diagonal decoration and scroll-width animation:

- Outer wrapper: `border-b border-ui cursor-pointer`, full width, stacked
  vertically (no 50/50 split, no mobile/desktop branching — same markup at
  every breakpoint).
- Header row: `border-b border-ui px-2 py-2 md:px-8 md:py-8 lg:px-14 lg:py-14
  flex flex-row items-end justify-between`, eyebrow + title on the left
  (`text-base-bold text-muted-foreground` / `type-h3`, matching `ProjectRow`),
  a `Button` on the right — `label="View the full on X"`,
  `href={item.linkUrl}`, `target="_blank"`, `rel="noopener noreferrer"`.
- Media block: `relative aspect-video w-full` (16:9, vs. `ProjectRow`'s
  `aspect-square`) — `video` (if `media.type === "video"`: `autoPlay muted
  loop playsInline`) or `img` (if `"image"`), both `w-full h-full
  object-cover`.

## Interaction

- Whole card `onClick` opens `item.linkUrl` in a new tab
  (`window.open(item.linkUrl, "_blank", "noopener")`).
- Hover dispatches the existing `cursor-pill` custom event, with text
  `"VIEW ON X"` (vs. `ProjectRow`'s `"CLICK TO JUDGE"`).
- The header `Button` already opens the link itself via `href`/`target`; its
  click handler calls `e.stopPropagation()` to avoid double-handling the
  click, matching the existing pattern in `ProjectRow`.

## Wiring into the page

In `src/app/work/page.tsx`, replace the current placeholder branch:

```tsx
) : (
  <section className="w-full" style={{ minHeight: "100dvh" }} />
)}
```

with a tab-aware render — `ai-generated` maps `AI_GENERATED` through
`AIGeneratedCard`; `behind-the-ui` keeps the existing empty placeholder.

## Mobile

No separate mobile markup. Unlike `ProjectRow` (whose mobile block swaps out
the diagonal decorator for a spacer), `AIGeneratedCard` has no decorator to
swap — the same full-width markup works at all breakpoints via the existing
responsive padding scale.
