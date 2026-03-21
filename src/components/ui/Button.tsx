"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

// Variants: "primary" | "outline" | "dark"
type Variant = "primary" | "outline" | "dark";

type ButtonProps = {
  label: string;
  hoverLabel?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
};

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function useScramble(target: string, active: boolean) {
  const [display, setDisplay] = useState(target);
  const frame = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplay(target);
      return;
    }
    frame.current = 0;
    const totalFrames = target.length * 1;

    const tick = () => {
      frame.current++;
      setDisplay(
        target
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (frame.current >= i * 1 + 1) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (frame.current < totalFrames) {
        raf.current = requestAnimationFrame(tick);
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [active, target]);

  return display;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--foreground)", color: "var(--background)", border: "none" },
  outline: { background: "transparent", color: "var(--foreground)", border: "1.5px solid var(--foreground)" },
  dark:    { background: "var(--foreground)", color: "var(--background)", border: "none" },
};

export default function Button({ label, hoverLabel, href, onClick, variant = "primary" }: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const activeLabel = hovered && hoverLabel ? hoverLabel : label;
  const scrambled = useScramble(activeLabel, hovered);

  const base: React.CSSProperties = {
    display: "inline-block",
    borderRadius: 0,
    padding: "12px 24px",
    fontFamily: "'Boldonse', cursive",
    fontSize: 14,
    lineHeight: "24px",
    textDecoration: "none",
    cursor: "pointer",
    ...variantStyles[variant],
  };

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      href={href as string}
      onClick={onClick}
      style={base}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" as const }}
    >
      {scrambled}
    </Tag>
  );
}
