"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import MenuOverlay from "@/components/ui/MenuOverlay";
import LogoAnimation from "@/components/ui/LogoAnimation";
import { useTheme } from "@/lib/ThemeContext";
import { useRef, useState, useEffect } from "react";

const SP = "var(--section-padding)";

export default function Navbar() {
  const { toggle, theme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef  = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) return;
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else if (currentY < lastScrollY.current) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={{ opacity: 1, y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        style={{
          paddingTop:    SP,
          paddingRight:  SP,
          paddingBottom: SP,
          paddingLeft:   SP,
          position:      "fixed",
          top:           0,
          left:          0,
          right:         0,
          zIndex:        100,
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center"
            style={menuOpen ? { position: "fixed", top: SP, left: SP, zIndex: 200 } : undefined}
          >
            <LogoAnimation isDark={theme === "dark"} menuOpen={menuOpen} />
          </a>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {!menuOpen && (
              <>
                <Button href="#contact" label="Beat a mook" hoverLabel="Book a meet" />
                <button
                  onClick={toggle}
                  className="h-12 w-12 flex items-center justify-center cursor-pointer rounded-none border border-border bg-transparent"
                >
                  <Image src={theme === "dark" ? "/Dark.svg" : "/Light.svg"} alt="Toggle theme" width={24} height={24} />
                </button>
              </>
            )}

            {/* Menu button */}
            <button
              ref={menuBtnRef}
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                position: menuOpen ? "fixed" : "relative",
                top:      menuOpen ? SP : undefined,
                right:    menuOpen ? SP : undefined,
                zIndex:   200,
              }}
              className={`h-12 w-12 flex items-center justify-center cursor-pointer rounded-none border border-border group transition-colors ${
                menuOpen ? "bg-foreground" : "bg-background hover:bg-foreground"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.i
                    key="close"
                    className="ri-close-large-line text-background text-xl"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : (
                  <motion.i
                    key="menu"
                    className="ri-menu-fill text-xl group-hover:text-background text-foreground transition-colors"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} btnRef={menuBtnRef} />
    </>
  );
}
