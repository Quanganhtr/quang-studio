# Debugging Notes

A record of hard-to-diagnose bugs in this project, so future debugging sessions don't repeat the same investigation.

---

## 1. Linux case-sensitivity breaks Vercel (works on Mac, broken in production)

**Symptom:** Everything works on `npm run dev` (Mac) but on Vercel: letter animation, image sequences, and drag-drop are all completely broken.

**Root cause chain:**
1. Public folder named `/public/images-sequence/Pencil/` (capital P)
2. Code referenced `/images-sequence/pencil/` (lowercase p)
3. macOS filesystem is **case-insensitive** → resolved to the same folder locally, no error
4. Vercel runs **Linux** (case-sensitive) → all 30 pencil frames returned **404**
5. `ctx.drawImage()` called on a 404'd image throws a `DOMException` on every scroll tick
6. This uncaught exception **corrupted the Framer Motion scroll event loop**
7. Everything using `useScroll` stopped working: AboutMe letter fly-in, DragMatchGrid mobile scroll-to-match, image sequences

**Fix:** Match the code reference to the actual folder name on disk (`Pencil` not `pencil`). Also wrap `ctx.drawImage()` in try/catch so a broken image never throws.

**Rule:** Always check public asset folder/file names match their code references exactly. macOS will silently hide case mismatches that will break on Vercel.

---

## 2. React 19 intercepts inline `<style>` tags in component bodies

**Symptom:** On Vercel, entire sections don't render (empty HTML where card grid should be). Works fine locally in dev mode.

**Root cause:** React 19 hoists/intercepts `<style>` tags found inside component JSX. It strips the CSS content and the sibling elements in the same render are dropped from the SSR output.

**Affected files:**
- `DragMatchGrid.tsx` — had `<style>{`.drag-match-grid { ... }`}</style>` inline
- `MyWork.tsx` — had `<style>{`@keyframes floatUpDown { ... }`}</style>` inline

**Fix:** Move all CSS from inline `<style>` tags to `globals.css`. Never use `<style>` tags inside React component bodies.

---

## 3. Browser scroll restoration breaks scroll-driven animations on reload

**Symptom:** First page load works. Pressing reload (Cmd+R) breaks scroll-driven animations — AboutMe letter stays offscreen, DragMatchGrid mobile cards auto-match incorrectly.

**Root cause:** Browser restores scroll position on reload. Framer Motion's `useScroll` hooks initialise with the restored (non-zero) scroll progress, so all scroll-driven transforms start in the wrong state.

**Fix:** In a root-level client component (`ScrollReset.tsx`), set:
```ts
window.history.scrollRestoration = "manual";
window.scrollTo(0, 0);
```
This disables browser scroll restoration and ensures every load starts from the top.

---

## 4. `touchAction: "none"` blocks `useScroll` on mobile

**Symptom:** DragMatchGrid mobile scroll-to-match animation doesn't work on iOS Safari.

**Root cause:** The draggable `motion.div` had `touchAction: "none"` even when `drag={false}` on mobile. This prevented scroll events from reaching Framer Motion's `useScroll` hook, so `scrollYProgress` never updated.

**Fix:** Use `touchAction: "pan-y"` on mobile so vertical scroll events pass through.

---

## 5. `dropToBottom` fires before layout is ready on Vercel

**Symptom:** On Vercel, desktop DragMatchGrid drag image spawns at wrong position (y=0 instead of bottom of card).

**Root cause:** `setTimeout(300)` for the initial `dropToBottom` call was not long enough — on Vercel the component can be below the fold on first load, so `getBoundingClientRect()` returns `height: 0`.

**Fix:** Replace the timeout with a `requestAnimationFrame` retry loop that checks `height > 0` before animating:
```ts
const dropToBottom = () => {
  const containerRect = containerRef.current?.getBoundingClientRect();
  const dragRect = dragRef.current?.getBoundingClientRect();
  if (!containerRect?.height || !dragRect?.height) {
    requestAnimationFrame(dropToBottom);
    return;
  }
  // animate...
};
```
