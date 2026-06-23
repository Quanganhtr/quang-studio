"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, animate } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PROJECTS } from "@/lib/projects";

const PAGES = [
  "/work",
  "/about",
  "/contact",
  ...PROJECTS.map((p) => `/work/${p.slug}`),
];

const ALL_FRAMES: string[] = [
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/knife/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/pencil/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/cup/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/spray/${String(i + 1).padStart(4, "0")}.webp`),
];

const TOTAL = ALL_FRAMES.length;

export default function LoadingScreen() {
  const router = useRouter();
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible]     = useState(true);
  const [ready, setReady]         = useState(false);

  useLayoutEffect(() => {
    if (sessionStorage.getItem("loaded")) setVisible(false);
  }, []);

  const loadedRef      = useRef(0);
  const loadingDone    = useRef(false);
  const animDone       = useRef(false);
  const readyCalled    = useRef(false);

  const tryShowButton = () => {
    if (loadingDone.current && animDone.current && !readyCalled.current) {
      readyCalled.current = true;
      setTimeout(() => setReady(true), 400);
    }
  };

  const handleEnter = () => {
    sessionStorage.setItem("loaded", "1");
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
    window.dispatchEvent(new Event("safari-video-unlock"));
    document.body.style.overflow = "";
    setVisible(false);
  };

  // Fixed-pace counter: always counts 0→100 over ~1s regardless of load speed.
  // TAP TO ENTER only appears when both this animation AND real loading are done.
  useEffect(() => {
    if (sessionStorage.getItem("loaded")) return;

    const controls = animate(0, 100, {
      duration: 1,
      ease: "linear",
      onUpdate(v) { setDisplayed(Math.round(v)); },
      onComplete() {
        animDone.current = true;
        tryShowButton();
      },
    });

    return () => controls.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real loading tracker — signals when assets are actually ready
  useEffect(() => {
    if (sessionStorage.getItem("loaded")) return;
    document.body.style.overflow = "hidden";

    // Prefetch other routes once the page itself has finished loading, so it
    // doesn't compete with critical-path resources for mobile bandwidth.
    const prefetchPages = () => PAGES.forEach((p) => router.prefetch(p));
    if (document.readyState === "complete") {
      prefetchPages();
    } else {
      window.addEventListener("load", prefetchPages, { once: true });
    }

    const isMobile = window.innerWidth <= 768;

    const finish = () => {
      if (loadingDone.current) return;
      loadingDone.current = true;
      tryShowButton();
    };

    if (isMobile) {
      if (document.readyState === "complete") {
        finish();
      } else {
        window.addEventListener("load", finish, { once: true });
      }
    } else {
      let pageReady = document.readyState === "complete";
      let imagesReady = false;

      const tryFinish = () => {
        if (pageReady && imagesReady) finish();
      };

      if (!pageReady) {
        window.addEventListener("load", () => { pageReady = true; tryFinish(); }, { once: true });
      }

      ALL_FRAMES.forEach((src) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedRef.current += 1;
          if (loadedRef.current === TOTAL) {
            imagesReady = true;
            tryFinish();
          }
        };
        img.src = src;
      });
    }

    return () => { document.body.style.overflow = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 bg-foreground"
        >
          {/* Counter */}
          <h2 className="type-h2 text-background tabular-nums">
            {displayed}
          </h2>

          {/* TAP TO ENTER fades in once both animation and loading are done */}
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Button
                  variant="solid"
                  size="lg"
                  label="Enter"
                  onClick={handleEnter}
                  className="bg-background! text-foreground! hover:bg-background! hover:text-foreground!"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
