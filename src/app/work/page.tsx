"use client";

import React, { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/sections/Footer";
import { PROJECTS, type Project } from "@/lib/projects";
import { useProjectNav } from "@/lib/useProjectNav";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RowRef = React.RefObject<HTMLDivElement | null>;

const COL_SMALL = (5 / 12) * 100;
const COL_LARGE = (7 / 12) * 100;

type TabKey = "showcase" | "ai-generated" | "behind-the-ui";

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: "showcase",      label: "Showcase",      count: PROJECTS.length },
  { key: "ai-generated",  label: "AI Generated",  count: 3 },
  { key: "behind-the-ui", label: "Behind the UI", count: 0 },
];

function ProjectRow({
  project,
  thumbLeft,
  rowRef,
  prevRef,
  onOpen,
  loading,
}: {
  project: Project;
  thumbLeft: boolean;
  rowRef:    RowRef;
  prevRef:   RowRef | null;
  // ⚡️ DEVELOPER: navigates to the project detail page (/work/[slug])
  onOpen:    (slug: string) => void;
  loading:   boolean;
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
          loading={loading}
          onClick={(e) => { e.stopPropagation(); onOpen(project.slug); }}
        />
      </div>
      <div className="relative aspect-square w-full">
        <img src={project.thumbnail} alt="" aria-hidden className="w-full h-full object-cover" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
            <i className="ri-loader-4-line animate-spin text-background text-3xl" aria-hidden="true" />
          </div>
        )}
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
      onClick={() => onOpen(project.slug)}
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
            loading={loading}
            onClick={(e) => { e.stopPropagation(); onOpen(project.slug); }}
          />
        </div>
        <div className="relative aspect-square w-full">
          <img src={project.thumbnail} alt="" aria-hidden className="w-full h-full object-cover" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40">
              <i className="ri-loader-4-line animate-spin text-background text-3xl" aria-hidden="true" />
            </div>
          )}
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
  const { loadingSlug, openProject } = useProjectNav();
  const [activeTab, setActiveTab] = useState<TabKey>("showcase");
  const tabsRef = useRef<HTMLDivElement>(null);

  // Mobile only: the navbar never auto-hides there, so once the tab bar
  // sticks right under it, swap the navbar's transparent header for a solid
  // background to avoid the tab row showing through it.
  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (!isMobile || !tabsRef.current) {
        window.dispatchEvent(new CustomEvent("navbar-bg", { detail: { solid: false } }));
        return;
      }
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--navbar-height")) || 0;
      const stuck = tabsRef.current.getBoundingClientRect().top <= navH;
      window.dispatchEvent(new CustomEvent("navbar-bg", { detail: { solid: stuck } }));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <section
          ref={tabsRef}
          className="section-container max-w-none sticky top-(--navbar-height,56px) md:top-0 z-40 bg-background border-t border-b border-ui px-2 md:px-8 lg:px-14 pt-2 md:pt-2 lg:pt-5 pb-3 md:pb-4 lg:pb-6"
        >
          <div className="flex items-center gap-0">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="relative flex items-center gap-2 md:gap-3 cursor-pointer py-2 px-3 md:py-4 md:px-6"
                >
                  <span
                    className={clsx(
                      "text-base-bold",
                      isActive ? "text-foreground" : "text-accent-foreground"
                    )}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center justify-center rounded-xs text-sm-medium text-background h-5 w-5 md:h-6 md:w-auto md:min-w-6 md:px-1.5",
                      isActive ? "bg-foreground" : "bg-accent-foreground"
                    )}
                  >
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="active-tab-indicator"
                      transition={{ duration: 0.3, ease: EASE }}
                      className="absolute inset-x-0 mx-auto -bottom-0.5 w-8 md:w-12 h-1 rounded-xs bg-foreground"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Project list ──────────────────────────────────────────────── */}
        {activeTab === "showcase" ? (
          <section className="section-container max-w-none p-0 bg-background">
            {PROJECTS.map((project, i) => (
              <ProjectRow
                key={project.index}
                project={project}
                thumbLeft={i % 2 === 0}
                rowRef={rowRefs[i]}
                prevRef={i > 0 ? rowRefs[i - 1] : null}
                onOpen={openProject}
                loading={loadingSlug === project.slug}
              />
            ))}
          </section>
        ) : (
          <section className="w-full" style={{ minHeight: "100dvh" }} />
        )}

        <Footer />
      </main>
    </>
  );
}
