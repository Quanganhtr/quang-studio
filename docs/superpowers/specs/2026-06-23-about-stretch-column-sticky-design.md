# About page StretchColumn: sticky title + shrink-to-reveal design

## Problem

The `/about` page's 3-column content section (`StretchColumn`,
`src/app/about/page.tsx:215-279`) currently animates its decorative
cross/ellipse shape by *growing* it from 0 height up to a fixed size, and
only *after* the column's title has fully scrolled past the top of the
viewport. The title itself never sticks — it scrolls normally with
everything else. The trigger math is computed manually from
`getBoundingClientRect()` + absolute `window.scrollY`, via a
`useLayoutEffect` that measures `triggerStart`/`triggerEnd`.

We want the opposite interaction: as each column's title bar reaches the
top of the viewport, it pins there (real CSS `position: sticky`). While
pinned, continued scrolling shrinks the decor shape from its current
height down to `0`, and the content paragraphs below it rise up to sit
directly under the title (a free side-effect of the decor losing height,
since content already follows decor in visual order). The title stays
pinned until the column's content has fully revealed — i.e. until the
content's bottom edge reaches the *bottom of the viewport* — at which
point it un-pins and the page resumes normal scrolling.

## Non-goals

- Mobile is unaffected. It keeps today's fixed 156px decor height and no
  scroll-driven animation or sticky positioning at all.
- Not changing the cross/ellipse SVGs, paragraph content, or the
  `OriginStorySection`/`HowISurviveSection`/`ArchHauntsSection` components.
- Not changing column widths, borders, or the overall 3-column grid.

## Why a naive "equalize wrapper heights" approach doesn't work

An earlier draft of this design proposed measuring each column's natural
total height (title + decor + content) and padding the shorter columns
to match the tallest, relying on native CSS sticky's own release point.
That doesn't produce the desired behavior, for two reasons:

1. **Native sticky releases at the wrong edge.** A sticky element's
   containing block "runs out" — and the element un-sticks — when the
   block's bottom edge reaches the *sticky offset* (here, the viewport's
   *top*, just past the title). That moment is "content's bottom is at
   the top of the viewport, right under the title," not "content's
   bottom is at the bottom of the viewport." These are different points
   in the scroll, and conflating them would release the pin far too
   early.
2. **Self-referential height.** If the column's wrapper height is left
   as "auto" (derived from its children), then as the decor's *visual*
   height shrinks via the scroll-linked transform, the wrapper's *live
   layout height* shrinks too — which changes exactly when sticky
   release fires, mid-animation, as a moving target. There's no clean
   closed-form scroll-distance for "release point" if the thing
   defining the scroll room is itself changing size during the scroll.

## Behavior (corrected mechanism)

Each column splits into two nested elements, the same outer/inner split
already used for scroll-pinned sections elsewhere in this codebase
(`OverviewVideo.tsx`'s extra-height outer + `app-sticky-screen` inner):

- **Outer wrapper** — `position: relative`, with an explicit pixel
  height set once (on mount/resize, via `ResizeObserver`/measurement),
  *not* derived from live/animated content. Its height is
  `titleHeight + sharedScrollRoom` (see below). This height alone
  defines how much scroll distance the pin phase consumes, decoupled
  from anything that animates during scroll.
- **Inner block** — `position: sticky; top: 0` (`md:` and up), holding
  the title, decor, and content stacked normally. Its own rendered
  height naturally decreases as decor shrinks, but that's irrelevant to
  *when* it releases, because release timing is governed by the outer
  wrapper's fixed height, not the inner block's fluctuating one.
- **Decor height** is driven by `useScroll({ target: outerWrapperRef })`
  scoped to that column's own outer wrapper, mapping the *first*
  `decorFullHeight` pixels of scroll progress through the wrapper to
  decor height `[measuredDecorHeight → 0]`, then holding at `0` for any
  remaining scroll room in that wrapper.
- **Content** needs no explicit animation — it already sits after decor
  in flex order (`md:order-3` vs decor's `md:order-2`), so as decor
  shrinks, content rises into place via normal block reflow.

## Computing `sharedScrollRoom`

For a column to release exactly when its content's bottom reaches the
viewport's bottom, the scroll room must cover both shrinking the decor
*and* however much of the content overflows past one viewport's worth of
space below the title:

```
availableSpace   = viewportHeight - titleHeight
overflowReveal    = max(0, contentHeight - availableSpace)
requiredScrollRoom (per column) = decorFullHeight + overflowReveal
```

`decorFullHeight` and `contentHeight` are measured per column (today:
433px / 398px / 398px decor; content height varies slightly with each
column's paragraph lengths). Per the agreed approach, all three columns
release **together**, timed to whichever needs the most room:

```
sharedScrollRoom = max(requiredScrollRoom across the 3 columns)
```

Every column's outer wrapper uses this same `sharedScrollRoom` (not its
own individual value) for its height calculation
(`titleHeight + sharedScrollRoom`). Because all three outer wrappers end
up the same height and start at the same scroll position (same grid
row), they pin and release in sync with no cross-column coordination
logic beyond sharing this one computed number.

Columns whose own `requiredScrollRoom` is less than the shared value
will finish shrinking their decor to `0` and fully reveal their content
*before* the shared release point, then simply sit static (decor at 0,
content fully visible, possibly with empty space below it) for the
remainder of the pinned phase. This is expected, not a bug — it's the
direct tradeoff of releasing in sync rather than independently.

## Implementation note

This replaces the existing measurement/trigger logic in `StretchColumn`
(the `wrapperRef`/`titleRef` `getBoundingClientRect` measurement,
`triggerStart`/`triggerEnd` state, and the `scrollY`-based
`useTransform`, roughly lines 216-248) with: a new outer wrapper ref measured
via `ResizeObserver` for `titleHeight` and `contentHeight`, a shared
`sharedScrollRoom` value lifted to the parent (`AboutPage`) and passed
down to all three `StretchColumn` instances (since it depends on all
three columns' measurements), and a per-column `useScroll(target:
outerWrapperRef)` driving the decor-height transform. The existing
`isDesktop` gating (fixed 156px decor height, no animation, below `md:`)
stays as-is.
