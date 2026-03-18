"use client";

import { motion } from "framer-motion";
import React from "react";

// Variants: "primary" | "outline" | "dark"
type Variant = "primary" | "outline" | "dark";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
};

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: { background: "var(--brand-primary)", color: "#000", border: "none" },
  outline: { background: "transparent", color: "var(--foreground)", border: "1.5px solid var(--foreground)" },
  dark:    { background: "var(--foreground)", color: "var(--background)", border: "none" },
};

export default function Button({ children, href, onClick, variant = "primary" }: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-block",
    borderRadius: 9999,
    padding: "12px 24px",
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
    fontWeight: 500,
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
      whileHover={{ scale: 1.03, opacity: 0.9 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
}
