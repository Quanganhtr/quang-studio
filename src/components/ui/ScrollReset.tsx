"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    // Keep native scroll restoration on so the browser restores position on
    // back/forward navigation (App Router relies on this — it doesn't reposition
    // scroll itself when restoring a cached route).
    window.history.scrollRestoration = "auto";

    // This component lives in the root layout, so it mounts once per full document
    // load — never on SPA back/forward. Force the top only on a fresh load/reload,
    // and leave the browser's restored position alone when returning via back/forward.
    const navEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navEntry?.type !== "back_forward") {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
