"use client";

import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useTheme } from "@/lib/ThemeContext";
import lightAnimation from "../../../public/Light-Loading.json";
import darkAnimation from "../../../public/Dark-Loading.json";

export default function CustomCursor() {
  const { theme } = useTheme();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const move = (e: MouseEvent) => {
      const el = cursorRef.current;
      if (!el) return;
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.style.opacity = "1";
      if (!active) setActive(true);
    };

    const hide = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
    };
    const show = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 32,
        height: 32,
        transform: "translate(-200px, -200px)",
        opacity: 0,
        pointerEvents: "none",
        zIndex: 99999,
        // Promote to own layer for smooth Safari rendering
        willChange: "transform",
      }}
    >
      {active && (
        <Lottie
          lottieRef={lottieRef}
          animationData={theme === "dark" ? darkAnimation : lightAnimation}
          loop
          autoplay
        />
      )}
    </div>
  );
}
