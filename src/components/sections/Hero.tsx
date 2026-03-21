"use client";

import { motion, animate } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const leftItems = [
  { text: "ARCHITECT BY ROOTS.",  seq: 0 },
  { text: "PRODUCT DESIGNER",     seq: 1 },
  { text: "BY CHOICE.",           seq: 2 },
  { text: "VIBE-CODER BY FORCE.", seq: 3 },
];

const rightItems = [
  { text: "",         seq: -1 },
  { text: "",         seq: -1 },
  { text: "QUANG",    seq: 4  },
  { text: "ANH TRAN", seq: 5  },
];

// Mobile: 4 combined items with their own 0-3 sequence
const mobileItems = [
  { text: "ARCHITECT BY ROOTS.",         seq: 0 },
  { text: "PRODUCT DESIGNER BY CHOICE.", seq: 1 },
  { text: "VIBE-CODER BY FORCE.",        seq: 2 },
  { text: "QUANG ANH TRAN",              seq: 3 },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DURATION = 0.5;
const MAX_PAD = 24; // absolute cap — PAD is always clamped below actual gap

// Gap expressed as a fraction of line-height (1lh = fontSize × lineHeight)
const DESKTOP_GAP = "0.65lh";
const MOBILE_GAP  = "0.2lh";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

function MaskedColumn({
  items,
  active,
  align = "left",
  mobile = false,
}: {
  items: { text: string; seq: number }[];
  active: number;
  align?: "left" | "right";
  mobile?: boolean;
}) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const grayItemRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const windowRef     = useRef<HTMLDivElement>(null);
  const innerRef      = useRef<HTMLDivElement>(null);
  const prevIndexRef  = useRef<number>(-1);
  const exitedDownRef = useRef(false);

  const gap        = mobile ? MOBILE_GAP : DESKTOP_GAP;
  const fontSize   = mobile ? "clamp(22px, 9vw, 42px)" : "clamp(24px, 4.5vw, 96px)";
  const lineHeight = mobile ? 1.5 : 1.05;

  // Spans inherit font from container; only layout/color props needed here
  const spanStyle: React.CSSProperties = {
    whiteSpace: mobile ? "normal" : "nowrap",
    display:    "block",
  };

  const maxSeq      = Math.max(...items.map((i) => i.seq));
  const activeIndex = items.findIndex((i) => i.seq === active && i.text);

  const measureRow = (idx: number) => {
    const container = containerRef.current;
    const item      = grayItemRefs.current[idx];
    if (!container || !item) return null;
    const cRect  = container.getBoundingClientRect();
    const iRect  = item.getBoundingClientRect();
    const top    = iRect.top - cRect.top;
    const height = iRect.height;

    // Measure actual rendered gap to a neighbor so PAD never exceeds it
    const prev = grayItemRefs.current[idx - 1];
    const next = grayItemRefs.current[idx + 1];
    let gapPx = 999;
    if (next) gapPx = Math.min(gapPx, next.getBoundingClientRect().top  - iRect.bottom);
    if (prev) gapPx = Math.min(gapPx, iRect.top - prev.getBoundingClientRect().bottom);
    const pad = Math.min(gapPx * 0.6, MAX_PAD);

    return { top, height, pad };
  };

  const containerH = () => containerRef.current?.getBoundingClientRect().height ?? 9999;

  const moveTo = (windowTop: number, windowH: number, instant: boolean) => {
    const win   = windowRef.current;
    const inner = innerRef.current;
    if (!win || !inner) return;
    const innerTop = -windowTop;
    const opts = instant ? { duration: 0 } : { duration: DURATION, ease: EASE };
    animate(win,   { top: windowTop, height: windowH }, opts);
    animate(inner, { top: innerTop },                   { ...opts });
  };

  useEffect(() => {
    const prevIndex = prevIndexRef.current;

    if (activeIndex === -1) {
      const wasLast = prevIndex !== -1 && items[prevIndex]?.seq === maxSeq;
      if (wasLast) {
        const prev = measureRow(prevIndex);
        const prevH = prev ? prev.height + prev.pad * 2 : 80;
        moveTo(containerH() + 50, prevH, false);
        exitedDownRef.current = true;
      }
      prevIndexRef.current = -1;
      return;
    }

    const row = measureRow(activeIndex);
    if (!row) return;
    const { pad } = row;
    const winTop = row.top - pad;
    const winH   = row.height + pad * 2;

    if (exitedDownRef.current) {
      moveTo(-(winH + 50), winH, true);
      exitedDownRef.current = false;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => moveTo(winTop, winH, false))
      );
    } else {
      // Snap on first load so mask doesn't animate in from off-screen
      const isFirstLoad = prevIndexRef.current === -1;
      moveTo(winTop, winH, isFirstLoad);
    }

    prevIndexRef.current = activeIndex;
  }, [active, activeIndex]);

  useEffect(() => {
    const onResize = () => {
      if (activeIndex === -1) return;
      const row = measureRow(activeIndex);
      if (!row) return;
      moveTo(row.top - row.pad, row.height + row.pad * 2, true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "flex", flexDirection: "column", gap, textAlign: align, fontFamily: "'Boldonse', cursive", fontSize, lineHeight }}
    >
      {items.map(({ text }, i) => (
        <span
          key={i}
          ref={(el) => { grayItemRefs.current[i] = el; }}
          style={{ ...spanStyle, color: "var(--gray-4)", visibility: text ? "visible" : "hidden" }}
        >
          {text || "\u00A0"}
        </span>
      ))}

      <div
        ref={windowRef}
        style={{
          position: "absolute",
          left:          align === "right" ? "auto" : 0,
          right:         align === "right" ? 0 : "auto",
          top:           -9999,
          width:         "100%",
          height:        80,
          overflow:      "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          ref={innerRef}
          style={{
            position:       "absolute",
            left:           0,
            right:          0,
            top:            0,
            textAlign:      align,
            display:        "flex",
            flexDirection:  "column",
            gap,
          }}
        >
          {items.map(({ text }, i) => (
            <span key={i} style={{ ...spanStyle, color: "var(--foreground)" }}>
              {text || "\u00A0"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const isMobile = useIsMobile();
  const seqLength = isMobile ? mobileItems.length : 6;
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
    const id = setInterval(() => setActive((p) => (p + 1) % seqLength), 1000);
    return () => clearInterval(id);
  }, [seqLength]);

  return (
    <section
      style={{
        flex:           1,
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "flex-end",
        padding:        isMobile ? "0 8px 8px" : "0 56px 56px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={
          isMobile
            ? { width: "100%" }
            : { display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }
        }
      >
        {isMobile ? (
          <MaskedColumn items={mobileItems} active={active} align="left" mobile />
        ) : (
          <>
            <MaskedColumn items={leftItems}  active={active} align="left"  />
            <MaskedColumn items={rightItems} active={active} align="right" />
          </>
        )}
      </motion.div>
    </section>
  );
}
