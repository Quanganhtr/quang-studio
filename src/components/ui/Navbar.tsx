"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useTheme } from "@/lib/ThemeContext";
import { useEffect, useState } from "react";

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

export default function Navbar() {
  const { toggle, theme } = useTheme();
  const isMobile = useIsMobile();
  const pad = isMobile ? 8 : 56;

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{ padding: `${pad}px ${pad}px 0` }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="/" className="flex items-center">
          <Image src="/Logo.svg" alt="Quang" width={48} height={48} priority className="theme-icon" />
        </a>

        {/* Moon + CTA */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <button onClick={toggle} style={{ background: "none", border: "1px solid var(--gray-5)", borderRadius: 999, cursor: "pointer", padding: 12, display: "flex" }}>
            <Image src={theme === "dark" ? "/Dark.svg" : "/Light.svg"} alt="Toggle theme" width={24} height={24} />
          </button>
          <Button href="#contact" label="Beat a mook" hoverLabel="Book a meet" />
        </div>
      </div>
    </motion.header>
  );
}
