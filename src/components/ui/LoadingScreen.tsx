"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_FRAMES: string[] = [
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/knife/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/pencil/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/cup/${String(i + 1).padStart(4, "0")}.webp`),
  ...Array.from({ length: 30 }, (_, i) => `/images-sequence/spray/${String(i + 1).padStart(4, "0")}.webp`),
];

const TOTAL = ALL_FRAMES.length;

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(0);
  const doneRef = useRef(false);

  const handleEnter = () => {
    // Unlock autoplay for DOM videos
    document.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.play().catch(() => {});
    });
    // Unlock imperative video elements (e.g. Hero canvas videos)
    window.dispatchEvent(new Event("safari-video-unlock"));
    document.body.style.overflow = "";
    setVisible(false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const isMobile = window.innerWidth <= 768;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setProgress(100);
      setTimeout(() => setReady(true), 500);
    };

    if (isMobile) {
      // Mobile: skip image preloading — just wait for page resources
      if (document.readyState === "complete") {
        finish();
      } else {
        window.addEventListener("load", finish, { once: true });
      }
    } else {
      // Desktop: preload all image frames + wait for window.onload
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
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-4 bg-foreground"
        >
          <span className="label-h2 text-background">
            QUANG STUDIO
          </span>
          {ready ? (
            <button
              onClick={handleEnter}
              className="label-sm text-background bg-transparent border border-background px-7 py-2.5 cursor-pointer tracking-[0.15em]"
            >
              TAP TO ENTER
            </button>
          ) : (
            <span className="label-sm text-gray-5 tabular-nums tracking-widest">
              {String(progress).padStart(3, "0")}%
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
