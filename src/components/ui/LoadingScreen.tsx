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
  const loadedRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const isMobile = window.innerWidth <= 768;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setProgress(100);
      setTimeout(() => {
        document.body.style.overflow = "";
        setVisible(false);
      }, 500);
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
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "var(--foreground)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span className="label-h2" style={{ color: "var(--background)" }}>
            QUANG STUDIO
          </span>
          <span
            className="label-sm"
            style={{
              color: "var(--gray-5)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.1em",
            }}
          >
            {String(progress).padStart(3, "0")}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
