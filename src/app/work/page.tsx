"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import Footer from "@/components/sections/Footer";
import ProjectModal from "@/components/ui/ProjectModal";
import { PROJECTS, type Project } from "@/lib/projects";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RowRef = React.RefObject<HTMLDivElement | null>;

const COL_SMALL = (5 / 12) * 100;
const COL_LARGE = (7 / 12) * 100;

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
