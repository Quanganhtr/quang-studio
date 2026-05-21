"use client";

import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const leftItems = [
  { text: "ARCHITECT BY ROOTS."  },
  { text: "PRODUCT DESIGNER"     },
  { text: "BY CHOICE."           },
  { text: "VIBE-CODER BY FORCE." },
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
  const [isTablet,  setIsTablet]  = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
      style={{ display: "flex", flexDirection: "column", textAlign: align, paddingBlock: "0.15em" }}
    >
      {items.map(({ text }, i) => {
        const isLast = i === items.length - 1;
        const marginTop = i === 0 ? undefined : mobile && isLast ? "56px" : gap;
        return (
          <span
            key={i}
            style={{
              display:    "block",
              whiteSpace: mobile ? "normal" : "nowrap",
              color:      "var(--foreground)",
              visibility: text ? "visible" : "hidden",
              marginTop,
            }}
          >
            {text || " "}
          </span>
        );
      })}
    </div>
  );
}

const dispatchPill = (text: string | null) =>
  window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text } }));

function DiscImage({ size }: { size: string }) {
  const rotate      = useMotionValue(0);
  const speed       = useRef(0.4);
  const targetSpeed = useRef(0.4);
  const audio       = useRef<HTMLAudioElement | null>(null);
  const playing     = useRef(false);

  useEffect(() => {
    audio.current = new Audio("/theme-song.mp3");
    audio.current.loop = true;
    return () => {
      audio.current?.pause();
      dispatchPill(null);
    };
  }, []);

  useAnimationFrame(() => {
    speed.current += (targetSpeed.current - speed.current) * 0.06;
    rotate.set(rotate.get() + speed.current);
  });

  const handleClick = () => {
    if (!audio.current) return;
    if (playing.current) {
      audio.current.pause();
      playing.current = false;
    } else {
      audio.current.play();
      playing.current = true;
    }
  };

  return (
    <motion.img
      src="/disc.png"
      alt=""
      style={{ width: size, height: size, rotate, display: "block", cursor: "none" }}
      onMouseEnter={() => { targetSpeed.current = 4; dispatchPill("Listen with Quang"); }}
      onMouseLeave={() => { targetSpeed.current = 0.4; dispatchPill(null); }}
      onClick={handleClick}
    />
  );
}

export default function Hero() {
  const { isTablet, isDesktop } = useBreakpoint();
  const isBottomAligned = isTablet;

  return (
    <section
      className={`flex flex-col overflow-hidden${isTablet ? " flex-1" : ""}`}
      style={{
        justifyContent: isBottomAligned ? "flex-end" : "flex-start",
        padding:        isBottomAligned ? "0 var(--section-padding) var(--section-padding)" : "120px var(--section-padding) 120px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="w-full"
        style={{
          ...(isDesktop ? { display: "flex", justifyContent: "space-between", alignItems: "flex-end" } : {}),
        }}
      >
        {isDesktop ? (
          <>
            <TextColumn items={leftItems} align="left" />
            <div
              className="type-h1"
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", paddingBlock: "0.15em" }}
            >
              {/* hidden spacers to align with left column */}
              <span style={{ visibility: "hidden" }}>&nbsp;</span>
              <span style={{ visibility: "hidden", marginTop: DESKTOP_GAP }}>&nbsp;</span>
              <div style={{ marginTop: DESKTOP_GAP }}><DiscImage size="16vw" /></div>
              <span style={{ color: "var(--foreground)", marginTop: DESKTOP_GAP, display: "block", whiteSpace: "nowrap" }}>QUANG</span>
              <span style={{ color: "var(--foreground)", marginTop: DESKTOP_GAP, display: "block", whiteSpace: "nowrap" }}>ANH TRAN</span>
            </div>
          </>
        ) : (
          <TextColumn items={mobileItems} align="left" mobile />
        )}
      </motion.div>
    </section>
  );
}
