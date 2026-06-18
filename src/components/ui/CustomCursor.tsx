"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useTheme } from "@/lib/ThemeContext";
import lightAnimation from "../../../public/Light-Loading.json";
import darkAnimation from "../../../public/Dark-Loading.json";

const SLOT_CHARS   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SLOT_BASE_MS = 60;  // ms before the first character stops
const SLOT_STAGGER = 12;  // ms between each subsequent character stopping

function useSlotText(target: string | null): string | null {
  const [display, setDisplay] = useState<string | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!target) {
      setDisplay(null);
      return;
    }

    const chars = target.split("");

    // Show fully-scrambled text immediately so there's no blank frame
    setDisplay(chars.map(c => c === "\n" ? "\n" : SLOT_CHARS[Math.floor(Math.random() * 26)]).join(""));

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      let nonNlIdx = 0;

      const result = chars.map(c => {
        if (c === "\n") return "\n";
        const stopAt = SLOT_BASE_MS + nonNlIdx++ * SLOT_STAGGER;
        return elapsed >= stopAt ? c : SLOT_CHARS[Math.floor(Math.random() * 26)];
      }).join("");

      setDisplay(result);

      const lastStop = SLOT_BASE_MS + (nonNlIdx - 1) * SLOT_STAGGER;
      if (elapsed < lastStop) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return display;
}

export default function CustomCursor() {
  const { theme } = useTheme();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const pillRef   = useRef<HTMLDivElement>(null);
  const rafRef    = useRef(0);
  const targetX   = useRef(-200);
  const targetY   = useRef(-200);

  const [active,   setActive]   = useState(false);
  const [pillText, setPillText] = useState<string | null>(null);

  const slotText = useSlotText(pillText);

  useEffect(() => {
    const handler = (e: Event) => {
      setPillText((e as CustomEvent<{ text: string | null }>).detail.text);
    };
    window.addEventListener("cursor-pill", handler);
    return () => window.removeEventListener("cursor-pill", handler);
  }, []);

  useLayoutEffect(() => {
    if (pillRef.current) {
      pillRef.current.style.opacity = pillText ? "1" : "0";
    }
  }, [pillText]);

  // RAF lerp loop for smooth cursor following
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const LERP = 0.12;
    let curX = -200, curY = -200;

    const tick = () => {
      curX += (targetX.current - curX) * LERP;
      curY += (targetY.current - curY) * LERP;

      const t = `translate(${curX}px, ${curY}px)`;
      if (cursorRef.current) cursorRef.current.style.transform = t;
      if (pillRef.current)   pillRef.current.style.transform   = t;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
      setActive(true);
    };

    const hide = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (pillRef.current)   pillRef.current.style.opacity   = "0";
    };
    const show = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove",    move);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    return () => {
      window.removeEventListener("mousemove",    move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, []);

  return (
    <>
      {/* Lottie cursor */}
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 pointer-events-none z-99999 will-change-transform"
        style={{ transform: "translate(-200px, -200px)", opacity: 0 }}
      >
        {active && !pillText && (
          <div className="size-8">
            <Lottie
              lottieRef={lottieRef}
              animationData={theme === "dark" ? darkAnimation : lightAnimation}
              loop
              autoplay
            />
          </div>
        )}
      </div>

      {/* Pill cursor */}
      <div
        ref={pillRef}
        className="fixed left-0 top-0 pointer-events-none z-99999 will-change-transform"
        style={{ transform: "translate(-200px, -200px)", opacity: 0, overflow: "visible" }}
      >
        {pillText && (
          <div
            style={{
              display:       "inline-block",
              transform:     "translate(-50px, 40px) rotate(-8deg)",
              background:    "var(--foreground)",
              color:         "var(--background)",
              paddingInline: "16px",
              paddingBlock:  "12px",
              borderRadius:  0,
              whiteSpace:    "pre",
              fontFamily:    "var(--font-mono)",
              fontSize:      "12px",
              fontWeight:    700,
              letterSpacing: "0.05em",
              lineHeight:    1.5,
            }}
          >
            {slotText}
          </div>
        )}
      </div>
    </>
  );
}
