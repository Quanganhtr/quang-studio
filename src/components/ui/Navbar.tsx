"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import MenuOverlay from "@/components/ui/MenuOverlay";
import LogoAnimation from "@/components/ui/LogoAnimation";
import ThemeButton from "@/components/ui/ThemeButton";
import { useTheme } from "@/lib/ThemeContext";
import { useRef, useState, useEffect } from "react";

const SP = "var(--section-padding)";

type StatusKey = "working" | "gym" | "dating" | "sleep";

const STATUS_MAP: Record<StatusKey, { label: string }> = {
  working: { label: "Quang is working"     },
  gym:     { label: "Quang at gym"         },
  dating:  { label: "Quang is dating"      },
  sleep:   { label: "Quang is sleeping"    },
};

// End times in GMT+7 hours
const END_HOUR_GMT7: Record<StatusKey, number> = {
  working: 18, gym: 19, dating: 22, sleep: 8,
};

function getUntilLocal(statusKey: StatusKey): string {
  const gmt7Hour = END_HOUR_GMT7[statusKey];
  const now      = new Date();
  const utcMs    = now.getTime() + now.getTimezoneOffset() * 60000;
  const gmt7Date = new Date(utcMs + 7 * 3600000);

  const year             = gmt7Date.getUTCFullYear();
  const month            = gmt7Date.getUTCMonth();
  const day              = gmt7Date.getUTCDate();
  const currentGMT7Hour  = gmt7Date.getUTCHours();

  // Sleep ends next calendar day if currently past 10 PM GMT+7
  const endDay = statusKey === "sleep" && currentGMT7Hour >= 22 ? day + 1 : day;
  const endUTC = new Date(Date.UTC(year, month, endDay, gmt7Hour - 7, 0, 0, 0));

  const h    = endUTC.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  return `Until ${h % 12 || 12}${ampm}`;
}

const STATUS_ORDER: StatusKey[] = ["dating", "gym", "working", "sleep"];
const PEEK = 8;
const GAP  = 4;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function useCardSize() {
  const [card, setCard] = useState(96);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setCard(e.matches ? 124 : 96);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return card;
}

function getStatus(): StatusKey {
  const now   = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const gmt7  = new Date(utcMs + 7 * 3600000);
  const mins  = gmt7.getHours() * 60 + gmt7.getMinutes();
  if (mins >= 1320 || mins < 480) return "sleep";
  if (mins < 1080) return "working";
  if (mins < 1140) return "gym";
  return "dating";
}

function StatusBadge({ menuOpen }: { menuOpen: boolean }) {
  const CARD = useCardSize();
  const [status, setStatus]   = useState<StatusKey>(getStatus);
  const [open, setOpen]       = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1280);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setStatus(getStatus()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIdx  = STATUS_ORDER.indexOf(status);
  const numCards   = STATUS_ORDER.length;
  const peekTotal  = activeIdx * PEEK;

  return (
    <motion.div
      className="fixed right-2 bottom-2 md:left-6 md:bottom-6 cursor-pointer overflow-hidden"
      style={{ width: CARD, zIndex: 9999, transformOrigin: isMobile ? "bottom right" : "bottom left" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        height:  open ? numCards * CARD + (numCards - 1) * GAP : CARD + peekTotal,
        x:       menuOpen
          ? (isMobile ? (CARD + 32) : -(CARD + 32))
          : (isMobile ? !open : (!hovered && !open))
            ? (isMobile ? (CARD / 2) : -(CARD / 2))
            : 0,
        rotate:  (isMobile ? !open : (!hovered && !open)) && !menuOpen ? (isMobile ? 8 : -8) : 0,
        opacity: menuOpen ? 0 : 1,
      }}
      transition={{ duration: 0.5, ease: EASE }}
      onClick={() => setOpen(o => !o)}
    >
      {STATUS_ORDER.map((s, i) => {
        const isActive   = s === status;
        const collapsedY = i <= activeIdx ? i * PEEK : CARD + peekTotal;
        const expandedY  = i * (CARD + GAP);

        return (
          <motion.div
            key={s}
            animate={{
              y:       open ? expandedY  : collapsedY,
              opacity: open ? 1 : i <= activeIdx ? 1 : 0,
              scale:   open ? 1 : isActive ? 1 : i < activeIdx ? 1 - (activeIdx - i) * 0.05 : 1,
            }}
            transition={{ duration: 0.5, ease: EASE }}
            className={`absolute top-0 left-0 flex flex-col justify-end p-3 rounded-lg border border-solid border-muted ${isActive ? "bg-foreground" : "bg-background"}`}
            style={{ width: CARD, height: CARD, zIndex: i + 1, transformOrigin: "top center" }}
          >
            {(open || isActive) && (
              <>
                <span
                  className={`absolute top-3 right-3 text-sm-medium text-right ${isActive ? "text-background opacity-60" : "text-foreground opacity-50"}`}
                >
                  {getUntilLocal(s)}
                </span>
                <span className={`text-base-bold ${isActive ? "text-background" : "text-foreground"}`}>
                  {STATUS_MAP[s].label}
                </span>
              </>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function Navbar() {
  const { toggle, theme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef  = useRef<HTMLButtonElement>(null);
  const lastScrollY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      setHidden(false);
      return;
    }

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

  useEffect(() => {
    let themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = "#000000";
  }, [theme]);

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
          <Link
            href="/"
            className="flex items-center"
            style={menuOpen ? { position: "fixed", top: SP, left: SP, zIndex: 200 } : undefined}
            onClick={(e) => { if (pathname === "/") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } }}
          >
            <LogoAnimation isDark={theme === "dark"} menuOpen={menuOpen} />
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {!menuOpen && (
              <>
                <Button href="#contact" label="Beat a mook" hoverLabel="Book a meet" />
                <ThemeButton isDark={theme === "dark"} onToggle={toggle} />
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
              className={`h-8 w-8 md:h-12 md:w-12 flex items-center justify-center cursor-pointer rounded-xs border border-muted group ${
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
                    className="ri-menu-fill text-xl group-hover:text-background text-foreground"
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
      <StatusBadge menuOpen={menuOpen} />
    </>
  );
}
