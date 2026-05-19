"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
// NavItem uses only useState — useEffect/useRef kept for MenuOverlay internals

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const NAV_ITEMS = [
  { label: "Home",    href: "/",        icon: "ri-home-line"         },
  { label: "Work",    href: "/work",    icon: "ri-artboard-2-line"   },
  { label: "About",   href: "/about",   icon: "ri-user-4-line"       },
  { label: "Contact", href: "/contact", icon: "ri-chat-smile-2-line" },
];

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
  btnRef: RefObject<HTMLButtonElement | null>;
}

// Separate component so each item manages its own hover + height measurement
function NavItem({
  label, href, icon, isSlid, color,
  onNav,
}: {
  label: string; href: string; icon: string;
  isSlid: boolean; color: string;
  onNav: (href: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active        = hovered || isSlid;
  const effectiveColor = active ? "var(--foreground)" : color;

  return (
    <motion.div
      layout
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: "visible", position: "relative" }}
      // sin(4°) ≈ 6.976% — padding-% is relative to element width, so this exactly matches the lift
      animate={{ paddingTop: active ? "6.976%" : "0%" }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      <motion.button
        onClick={() => onNav(href)}
        className="pl-6 pr-6 text-lg-bold cursor-pointer border-none w-full gap-6 flex items-center"
        style={{
          position:        "relative",
          overflow:        "hidden",
          borderBottom:    "0.1rem solid var(--muted-foreground)",
          paddingBlock:    "1.5rem",
          color:           effectiveColor,
          transformOrigin: "right bottom",
          background:      "transparent",
        }}
        animate={{ rotate: active ? 4 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {/* slide-up background — inside the button so it rotates with it */}
        <motion.div
          style={{
            position:        "absolute",
            inset:           0,
            background:      "var(--muted)",
            transformOrigin: "bottom",
            zIndex:          0,
          }}
          animate={{ scaleY: active ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <span style={{ flex: 1, position: "relative", zIndex: 1, overflow: "hidden", display: "block" }}>
          {/* invisible clone keeps the height */}
          <span style={{ visibility: "hidden", display: "block" }}>{label}</span>
          <motion.span
            style={{ position: "absolute", top: 0, left: 0, whiteSpace: "nowrap" }}
            animate={{ left: active ? "100%" : "0%", translateX: active ? "-100%" : "0%" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {label}
          </motion.span>
        </span>
        <i className={icon} style={{ position: "relative", zIndex: 1, fontSize: 24, width: 24, height: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }} />
      </motion.button>
    </motion.div>
  );
}

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const [clicked, setClicked] = useState<string | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    NAV_ITEMS.forEach(({ href }) => router.prefetch(href));
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) setClicked(null);
  }, [open]);

  const handleNav = (href: string) => {
    if (pathname === href) { onClose(); return; }
    setClicked(href);
    // close first, navigate after exit animation (0.6s) completes
    onClose();
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => {
      router.push(href);
      navTimerRef.current = null;
    }, 620);
  };

  return (
    <motion.div
      initial={false}
      animate={{ y: open ? "0%" : "-100%" }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        position:      "fixed",
        inset:         0,
        width:         "100vw",
        height:        "var(--app-height)",
        zIndex:        50,
        background:    "var(--foreground)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <motion.div
        layout
        className="flex flex-col w-full h-full justify-end"
        style={{
          paddingInline: "var(--section-padding)",
          paddingBottom: "var(--section-padding)",
          gap: "1px",
        }}
      >
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isActive  = pathname === href;
          const isClicked = clicked === href;
          const isSlid    = isActive || isClicked;
          const color     = isSlid ? "var(--background)" : "var(--muted-foreground)";

          return (
            <NavItem
              key={label}
              label={label}
              href={href}
              icon={icon}
              isSlid={isSlid}
              color={color}
              onNav={handleNav}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
}
