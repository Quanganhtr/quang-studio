"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const leftItems = [
  { text: "ARCHITECT BY ROOTS."  },
  { text: "PRODUCT DESIGNER"     },
  { text: "BY CHOICE."           },
  { text: "VIBE-CODER BY FORCE." },
];

const rightItems = [
  { text: ""         },
  { text: ""         },
  { text: "QUANG"    },
  { text: "ANH TRAN" },
];

const mobileItems = [
  { text: "ARCHITECT BY ROOTS."         },
  { text: "PRODUCT DESIGNER BY CHOICE." },
  { text: "VIBE-CODER BY FORCE."        },
  { text: "QUANG ANH TRAN"              },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const DESKTOP_GAP = "0.65lh";
const MOBILE_GAP  = "0.2lh";

function useBreakpoint() {
  const getQuery = (token: string) => {
    const bp = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    return `(min-width: ${bp})`;
  };
  const [isTablet,  setIsTablet]  = useState(() => typeof window !== "undefined" && window.matchMedia(getQuery("--breakpoint-md")).matches);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(getQuery("--breakpoint-lg")).matches);

  useEffect(() => {
    const mqMd = window.matchMedia(getQuery("--breakpoint-md"));
    const mqLg = window.matchMedia(getQuery("--breakpoint-lg"));
    setIsTablet(mqMd.matches);
    setIsDesktop(mqLg.matches);
    const onMd = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    const onLg = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mqMd.addEventListener("change", onMd);
    mqLg.addEventListener("change", onLg);
    return () => {
      mqMd.removeEventListener("change", onMd);
      mqLg.removeEventListener("change", onLg);
    };
  }, []);

  return { isTablet, isDesktop };
}

function TextColumn({
  items,
  align = "left",
  mobile = false,
}: {
  items: { text: string }[];
  align?: "left" | "right";
  mobile?: boolean;
}) {
  const gap = mobile ? MOBILE_GAP : DESKTOP_GAP;

  return (
    <div
      className="type-h1"
      style={{ display: "flex", flexDirection: "column", gap, textAlign: align, paddingBlock: "0.15em" }}
    >
      {items.map(({ text }, i) => (
        <span
          key={i}
          style={{
            display:    "block",
            whiteSpace: mobile ? "normal" : "nowrap",
            color:      "var(--foreground)",
            visibility: text ? "visible" : "hidden",
          }}
        >
          {text || "\u00A0"}
        </span>
      ))}
    </div>
  );
}

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

function VideoMask({ darkSrc, lightSrc }: { darkSrc: string; lightSrc: string }) {
  const isDark    = useIsDark();
  const blendMode = isDark ? "multiply" : "screen";
  const src       = isDark ? darkSrc : lightSrc;
  const vidRef    = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = vidRef.current;
    if (!vid) return;
    vid.play().catch(() => {});
    const unlock = () => vid.play().catch(() => {});
    window.addEventListener("safari-video-unlock", unlock, { once: true });
    return () => window.removeEventListener("safari-video-unlock", unlock);
  }, []);

  return (
    <video
      ref={vidRef}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        objectFit:     "cover",
        mixBlendMode:  blendMode,
        pointerEvents: "none",
      }}
    />
  );
}

export default function Hero() {
  const { isTablet, isDesktop } = useBreakpoint();
  const isBottomAligned = isTablet;

  return (
    <section
      className="flex-1 flex flex-col overflow-hidden"
      style={{
        justifyContent: isBottomAligned ? "flex-end" : "flex-start",
        padding:        isBottomAligned ? "0 var(--section-padding) var(--section-padding)" : "56px var(--section-padding) 0",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full"
        style={{
          position:   "relative",
          isolation:  "isolate",
          background: "var(--background)",
          ...(isDesktop ? { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } : {}),
        }}
      >
        {isDesktop ? (
          <>
            <TextColumn items={leftItems}  align="left"  />
            <TextColumn items={rightItems} align="right" />
          </>
        ) : (
          <TextColumn items={mobileItems} align="left" mobile />
        )}
        <VideoMask darkSrc="/text-video-dark.mp4" lightSrc="/text-video-light.mp4" />
      </motion.div>
    </section>
  );
}
