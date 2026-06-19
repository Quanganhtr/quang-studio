"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/sections/Footer";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const PROJECTS = [
  { index: "My Proudest Child", title: "Minswap",    slug: "minswap",    category: "Product Design", thumbnail: "/minswap-thumbnail.gif",   liveUrl: "#" },
  { index: "02",                title: "Reviewnha",  slug: "reviewnha",  category: "UX Research",    thumbnail: "/reviewnha-thumbnail.png",  liveUrl: "#" },
  { index: "03",                title: "Ada.fun",    slug: "ada-fun",    category: "Product Design", thumbnail: "/adafun-thumbnail.png",     liveUrl: "#" },
  { index: "04",                title: "Noodles.fi", slug: "noodles-fi", category: "Branding",       thumbnail: "/noodles-thumbnail.gif",    liveUrl: "#" },
  { index: "05",                title: "Fruit map",  slug: "fruit-map",  category: "Motion",         thumbnail: "/vietnam-thumbnail.png",    liveUrl: "#" },
  { index: "06",                title: "My Gu",      slug: "my-gu",      category: "Product Design", thumbnail: "/mygu-thumbnail.png",       liveUrl: "#" },
];

type Project = typeof PROJECTS[number];
type RowRef = React.RefObject<HTMLDivElement | null>;

const COL_SMALL = (5 / 12) * 100;
const COL_LARGE = (7 / 12) * 100;

// scroll-up (dir=1): both panels move up — current exits up, next enters from below
// scroll-down (dir=-1): both panels move down — current exits down, prev enters from above
// dir=0: open/close — always slide from/to bottom
// panels are fixed inset-0 so 100% = 100vh → zero gap, full exit
const panelVariants = {
  enter: (dir: number) => ({ y: dir >= 0 ? "100%" : "-100%" }),
  center: { y: 0 },
  exit:  (dir: number) => ({ y: dir > 0  ? "-100%" : "100%" }),
};

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState(0);
  const activeIndexRef = useRef(0);

  // Sync when a new project opens
  useEffect(() => {
    if (!project) return;
    const idx = PROJECTS.findIndex(p => p.slug === project.slug);
    setActiveIndex(idx);
    activeIndexRef.current = idx;
    setDirection(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.slug]);

  const navigate = useCallback((dir: 1 | -1) => {
    const next = activeIndexRef.current + dir;
    if (next < 0 || next >= PROJECTS.length) return;
    setDirection(dir);
    setActiveIndex(next);
    activeIndexRef.current = next;
  }, []);

  // Scroll lock
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  const handleClose = useCallback(() => {
    setDirection(0);
    onClose();
  }, [onClose]);

  // Keyboard
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "Escape")    { handleClose(); return; }
      if (e.key === "ArrowDown") navigate(1);
      if (e.key === "ArrowUp")   navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, navigate, handleClose]);

  // Wheel — accumulate deltaY so one gesture = one navigation
  useEffect(() => {
    if (!project) return;
    let acc = 0;
    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked) return;
      acc += e.deltaY;
      if (Math.abs(acc) > 50) {
        navigate(acc > 0 ? 1 : -1);
        acc = 0;
        locked = true;
        clearTimeout(lockTimer);
        lockTimer = setTimeout(() => { locked = false; }, 900);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(lockTimer);
    };
  }, [project, navigate]);

  // Touch swipe
  useEffect(() => {
    if (!project) return;
    let startY = 0;
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY; };
    const onEnd   = (e: TouchEvent) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 40) navigate(diff > 0 ? 1 : -1);
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend",   onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend",   onEnd);
    };
  }, [project, navigate]);

  const activeProject = project ? PROJECTS[activeIndex] : null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {project && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-foreground/20 z-10000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Each panel is fixed inset-0 so 100% = 100vh — clean full exit, zero gap */}
      <AnimatePresence custom={direction}>
        {project && activeProject && (
          <motion.div
            key={activeProject.slug}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-10001 p-3 md:p-5 lg:p-8"
            onClick={handleClose}
          >
            <div
              className="w-full h-full bg-background border border-ui flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 md:px-8 md:py-5 lg:px-5 shrink-0">
                <div className="flex items-baseline gap-3">
                  <span className="text-base-bold">{activeProject.index} — {activeProject.title}</span>
                  <span className="text-base-bold opacity-30">{activeIndex + 1} / {PROJECTS.length}</span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="relative flex-1 flex flex-col items-center justify-center gap-8">
                <svg
                  className="absolute inset-0 w-full h-full text-border pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <pattern id={`grid-${activeProject.slug}`} width="48" height="48" patternUnits="userSpaceOnUse">
                      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${activeProject.slug})`} opacity="0.5"/>
                </svg>
                <h2 className="type-h2 relative z-10 text-center">COMING SOON</h2>
                <Button
                  variant="solid"
                  size="lg"
                  label="Check live site"
                  hoverLabel="Check live site"
                  href={activeProject.liveUrl}
                  className="relative z-10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ProjectRow({
  project,
  thumbLeft,
  rowRef,
  prevRef,
  onSelect,
}: {
  project: Project;
  thumbLeft: boolean;
  rowRef:    RowRef;
  prevRef:   RowRef | null;
  onSelect:  (p: Project) => void;
}) {
  const entryTarget = (prevRef ?? rowRef) as React.RefObject<HTMLElement>;
  const { scrollYProgress: entryP } = useScroll({
    target: entryTarget,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    offset: (prevRef ? ["start start", "end start"] : ["start end", "start start"]) as any,
  });
  const { scrollYProgress: exitP } = useScroll({
    target: rowRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });

  const colWidth = useTransform(
    [entryP, exitP],
    ([entry, exit]: number[]) => {
      if (exit > 0.001) return `${COL_LARGE + (COL_SMALL - COL_LARGE) * exit}%`;
      return `${COL_SMALL + (COL_LARGE - COL_SMALL) * entry}%`;
    }
  );

  const content = (
    <motion.div style={{ width: colWidth, flexShrink: 0, minWidth: 0 }} className="flex flex-col overflow-hidden">
      <div className="border-b border-ui px-2 py-2 md:px-8 md:py-8 lg:px-14 lg:py-14 flex flex-row items-end justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-base-bold text-muted-foreground">{project.index}</span>
          <h3 className="type-h3">{project.title}</h3>
        </div>
        <Button
          variant="solid"
          size="lg"
          label="View details"
          hoverLabel="View details"
          onClick={(e) => { e.stopPropagation(); onSelect(project); }}
        />
      </div>
      <div className="aspect-square w-full">
        <img src={project.thumbnail} alt="" aria-hidden className="w-full h-full object-cover" />
      </div>
    </motion.div>
  );

  const useEllipse = parseInt(project.index) % 2 === 0;

  const diagonal = (
    <div className={`relative flex-1${thumbLeft ? " border-r border-ui" : " border-l border-ui"}`}>
      {useEllipse ? (
        <svg className="absolute inset-0 w-full h-full text-border">
          <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-border">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );

  const mobileDecorator = (
    <div className="relative border-t border-ui" style={{ height: "156px" }}>
      {useEllipse ? (
        <svg className="absolute inset-0 w-full h-full text-border">
          <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
        </svg>
      ) : (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-border">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );

  return (
    <div
      ref={rowRef}
      className="border-b border-ui cursor-pointer"
      onClick={() => onSelect(project)}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
    >
      {/* Mobile */}
      <div className="flex flex-col md:hidden">
        <div className="border-b border-ui px-2 py-6 flex flex-row items-end justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-base-bold text-muted-foreground">{project.index}</span>
            <h3 className="type-h3">{project.title}</h3>
          </div>
          <Button
            variant="solid"
            size="lg"
            label="View details"
            hoverLabel="View details"
            onClick={(e) => { e.stopPropagation(); onSelect(project); }}
          />
        </div>
        <div className="aspect-square w-full">
          <img src={project.thumbnail} alt="" aria-hidden className="w-full h-full object-cover" />
        </div>
        {mobileDecorator}
      </div>
      {/* Desktop */}
      <div className="hidden md:flex">
        {thumbLeft ? <>{diagonal}{content}</> : <>{content}{diagonal}</>}
      </div>
    </div>
  );
}

export default function WorkPage() {
  const rowRefs = useRef<RowRef[]>(PROJECTS.map(() => ({ current: null }))).current;
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Title ─────────────────────────────────────────────────────── */}
        <section className="section-container max-w-none pt-40 md:pt-80 lg:pt-120 pb-8 md:pb-12 px-2 md:px-8 lg:px-14">
          <h2 className="type-h2">
            <span className="text-foreground">Work</span><span className="text-accent-foreground"> of the day. </span>
            <span className="text-foreground">Work</span><span className="text-accent-foreground"> of the year. </span>
            <span className="text-foreground">Work</span><span className="text-accent-foreground"> that went live. </span>
            <span className="text-foreground">Work</span><span className="text-accent-foreground"> that stayed shy.</span>
          </h2>
        </section>

        {/* ── Project list ──────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-t border-ui p-0 bg-background">
          {PROJECTS.map((project, i) => (
            <ProjectRow
              key={project.index}
              project={project}
              thumbLeft={i % 2 === 0}
              rowRef={rowRefs[i]}
              prevRef={i > 0 ? rowRefs[i - 1] : null}
              onSelect={setSelected}
            />
          ))}
        </section>

        <Footer />
      </main>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
