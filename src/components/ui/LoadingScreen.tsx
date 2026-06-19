"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, animate } from "framer-motion";

const PAGES = ["/work", "/about", "/contact"];

const ALL_FRAMES: string[] = [
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/knife/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/pencil/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/cup/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/spray/${String(i + 1).padStart(4, "0")}.webp`),
];

const TOTAL = ALL_FRAMES.length;

export default function LoadingScreen() {
  const router = useRouter();
  const [progress, setProgress]     = useState(0);
  const [displayed, setDisplayed]   = useState(0);
  const [visible, setVisible]       = useState(true); // start visible so it covers the page immediately
  const [ready, setReady]           = useState(false);

  // Kill instantly before first paint for returning visitors
  useLayoutEffect(() => {
    if (sessionStorage.getItem("loaded")) setVisible(false);
  }, []);
  const loadedRef  = useRef(0);
  const doneRef    = useRef(false);
  const currentRef = useRef(0);

  // Smoothly animate the displayed counter toward the real progress
  useEffect(() => {
    const controls = animate(currentRef.current, progress, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate(v) {
        currentRef.current = v;
        setDisplayed(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [progress]);

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

  useEffect(() => {
    if (sessionStorage.getItem("loaded")) return;
    document.body.style.overflow = "hidden";

    PAGES.forEach((p) => router.prefetch(p));

    const isMobile = window.innerWidth <= 768;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setProgress(100);
      setTimeout(() => setReady(true), 800);
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
          setProgress(Math.round((loadedRef.current / TOTAL) * 100));
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
          {/* Animated counter */}
          <h2 className="type-h2 text-background tabular-nums">
            {displayed}
          </h2>

          {/* TAP TO ENTER fades in once ready */}
          <AnimatePresence>
            {ready && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleEnter}
                className="text-background bg-transparent border border-background px-7 py-2.5 cursor-pointer tracking-[0.15em] text-base-bold"
              >
                TAP TO ENTER
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
