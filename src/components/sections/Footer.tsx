"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { label: "Home",    href: "/"        },
  { label: "About",   href: "/about"   },
  { label: "Work",    href: "/work"    },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "X",        href: "#" },
  { label: "Linkedin", href: "#" },
  { label: "Dribbble", href: "#" },
  { label: "Behance",  href: "#" },
];

type RGB = [number, number, number];

// Uses `color` property — browsers always serialize it to rgb(), even for oklch inputs.
const cssVarToRgb = (cssValue: string): RGB => {
  const el = document.createElement("span");
  el.style.display = "none";
  el.style.color = cssValue;
  document.body.appendChild(el);
  const raw = getComputedStyle(el).color; // always "rgb(r, g, b)"
  document.body.removeChild(el);
  const m = raw.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : [0, 0, 0];
};

export default function Footer() {
  const footerRef  = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stopsRef   = useRef<{ bg: RGB[]; fg: RGB[] }>({ bg: [], fg: [] });
  const { theme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const computeStops = () => {
    stopsRef.current = {
      bg: [
        cssVarToRgb("var(--background)"),
        [212,212,212], [116,212,255], [253,165,213], [255,184,106],
        cssVarToRgb("var(--primary)"),
      ],
      fg: [
        cssVarToRgb("var(--foreground)"),
        [64,64,64], [0,105,168], [163,0,76], [159,45,0], [0,0,0],
      ],
    };
  };

  const lerp = (a: RGB, b: RGB, t: number) =>
    `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
  const smootherstep = (x: number) => x*x*x*(x*(x*6-15)+10);

  const applyBg = useRef((p: number) => {
    const { bg: bgStops, fg: fgStops } = stopsRef.current;
    if (!bgStops.length) return;
    const content = contentRef.current;
    const t    = Math.max(0, Math.min(1, p));
    const segs = bgStops.length - 1;
    const i    = Math.min(Math.floor(t * segs), segs - 1);
    const lt   = smootherstep(t * segs - i);
    document.body.style.backgroundColor = lerp(bgStops[i], bgStops[i + 1], lt);
    if (content) content.style.color = lerp(fgStops[i], fgStops[i + 1], lt);
  });

  useEffect(() => {
    if (!isHome) return;
    computeStops();
    const unsubscribe = scrollYProgress.on("change", applyBg.current);
    const observer = new MutationObserver(() => { computeStops(); applyBg.current(scrollYProgress.get()); });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => {
      unsubscribe();
      observer.disconnect();
      document.body.style.backgroundColor = "";
      if (contentRef.current) contentRef.current.style.color = "";
    };
  }, [scrollYProgress, isHome]);

  useEffect(() => {
    if (!isHome) return;
    computeStops();
    applyBg.current(scrollYProgress.get());
  }, [theme, scrollYProgress, isHome]);

  return (
    <footer ref={footerRef} className="relative flex flex-col w-full overflow-hidden" style={{ height: "100dvh" }}>
      <div ref={contentRef} className="relative z-10 pt-18 px-2 pb-2 md:p-8 lg:p-14 flex flex-col flex-1">

        {/* ── Container 1: text + links ─────────────────────────────── */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="type-h2 text-left">
              YOU REACHED THE FOOTER.<br />
              <button
                className="type-h2 cursor-pointer bg-transparent border-none p-0 underline-offset-4 hover:underline text-left"
              >
                WHEN WILL YOU REACH ME?
              </button>
            </h2>
          </motion.div>

          <div className="mt-14 flex flex-row items-start justify-between md:items-center gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {NAV_LINKS.map(({ label, href }, i) => (
                <React.Fragment key={label}>
                  <Link href={href} className="text-base-bold">
                    {label}
                  </Link>
                  {i < NAV_LINKS.length - 1 && (
                    <span className="text-base-bold hidden md:inline">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col items-end md:flex-row md:flex-wrap md:items-center gap-4">
              <a href="mailto:quanganhtran2908@gmail.com" className="text-base-bold uppercase">
                quanganhtran2908@gmail.com
              </a>
              {SOCIAL_LINKS.map(({ label, href }) => (
                <React.Fragment key={label}>
                  <span className="text-base-bold hidden md:inline">·</span>
                  <a href={href} className="text-base-bold">
                    {label}
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* ── Container 2: logo ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="mt-auto"
        >
          <img
            src="/footer-desktop.png"
            alt="Quang"
            className="w-full block"
          />
        </motion.div>

      </div>
    </footer>
  );
}
