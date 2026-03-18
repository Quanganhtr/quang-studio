"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useTheme } from "@/lib/ThemeContext";

export default function Navbar() {
  const { toggle, theme } = useTheme();

  return (
    <motion.header
      className="flex items-center justify-center h-14"
      style={{ paddingTop: 56, paddingBottom: 32 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Logo */}
      <a href="/" className="flex items-center" style={{ marginRight: 56 }}>
        <Image src="/Logo.svg" alt="Quang" width={80} height={32} priority className="theme-icon" />
      </a>

      {/* Moon + CTA — 8px gap */}
      <div className="flex items-center" style={{ gap: 8 }}>
        <button onClick={toggle} style={{ background: "none", border: "1px solid var(--gray-5)", borderRadius: 999, cursor: "pointer", padding: 12, display: "flex" }}>
          <Image src={theme === "dark" ? "/Dark.svg" : "/Light.svg"} alt="Toggle theme" width={24} height={24} />
        </button>
        <Button href="#contact">Book a meet</Button>
      </div>
    </motion.header>
  );
}
