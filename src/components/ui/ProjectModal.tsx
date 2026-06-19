"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PROJECTS, type Project } from "@/lib/projects";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const panelVariants = {
  enter: (dir: number) => ({ y: dir >= 0 ? "100%" : "-100%" }),
  center: { y: 0 },
  exit:  (dir: number) => ({ y: dir > 0  ? "-100%" : "100%" }),
};

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection]     = useState(0);
  const activeIndexRef = useRef(0);

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

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  const handleClose = useCallback(() => {
    setDirection(0);
    onClose();
  }, [onClose]);

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
    return () => { window.removeEventListener("wheel", onWheel); clearTimeout(lockTimer); };
  }, [project, navigate]);

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
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [project, navigate]);

  const activeProject = project ? PROJECTS[activeIndex] : null;

  return (
    <>
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
