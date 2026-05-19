"use client";

import { useEffect } from "react";

export default function ViewportHeight() {
  useEffect(() => {
    let frame = 0;

    const set = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const layoutHeight = window.innerHeight;
        const visibleHeight = document.documentElement.clientHeight || layoutHeight;
        const chromeTop = Math.max(0, layoutHeight - visibleHeight, 56);

        document.documentElement.style.setProperty("--screen-height", `${layoutHeight}px`);
        document.documentElement.style.setProperty("--app-height", `${layoutHeight}px`);
        document.documentElement.style.setProperty("--app-top", "0px");
        document.documentElement.style.setProperty("--chrome-top", `${chromeTop}px`);
        document.documentElement.style.setProperty("--app-bottom", "0px");
      });
    };

    set();
    window.addEventListener("resize", set);
    window.addEventListener("scroll", set, { passive: true });
    window.addEventListener("orientationchange", set);
    window.addEventListener("pageshow", set);
    window.visualViewport?.addEventListener("resize", set);
    window.visualViewport?.addEventListener("scroll", set);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", set);
      window.removeEventListener("scroll", set);
      window.removeEventListener("orientationchange", set);
      window.removeEventListener("pageshow", set);
      window.visualViewport?.removeEventListener("resize", set);
      window.visualViewport?.removeEventListener("scroll", set);
    };
  }, []);

  return null;
}
