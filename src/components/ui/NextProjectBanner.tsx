"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { Project } from "@/lib/projects";
import { trackEvent } from "@/lib/gtag";

// Odd positions (1st, 3rd, 5th...) slide in from the left, even positions from the right.
// Progress 0 = section starts entering the viewport, 1 = section is fully in view.
function ScopeItem({ item, index, containerRef }: { item: string; index: number; containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end end"] });
  const fromLeft = index % 2 === 0;
  const x = useTransform(scrollYProgress, [0, 1], [fromLeft ? -200 : 200, 0]);

  return (
    <motion.li style={{ x }} className="text-lg-bold text-foreground py-4">
      {item}
    </motion.li>
  );
}

export default function NextProjectBanner({
  project,
  prevProject,
  nextProject,
}: {
  project: Project;
  prevProject: Project;
  nextProject: Project;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="w-full bg-background border-b border-ui grid grid-cols-1 md:grid-cols-3"
      style={{ minHeight: "100dvh" }}
    >
      <Link
        href={`/work/${prevProject.slug}`}
        className="order-3 md:order-0 flex w-full flex-col items-center md:items-start justify-center text-center md:text-left gap-6 text-accent-foreground px-2 md:px-8 lg:px-14 py-10 md:py-14 lg:pt-20 lg:pb-39"
        onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
        onClick={() => trackEvent("project_card_click", { slug: prevProject.slug, location: "next_project_banner_prev" })}
      >
        <span className="text-base-bold">Previous project</span>
        <h3 className="type-h3">{prevProject.title}</h3>
      </Link>

      {project.scope && (
        <div ref={scopeRef} className="order-1 md:order-0 flex flex-col items-center justify-center text-center gap-6 px-2 md:px-8 lg:px-14 py-10 md:py-14">
          <span className="text-base-bold text-muted-foreground">My scope</span>
          <ul className="flex flex-col">
            {project.scope.map((item, i) => (
              <ScopeItem key={item} item={item} index={i} containerRef={scopeRef} />
            ))}
          </ul>
        </div>
      )}

      <Link
        href={`/work/${nextProject.slug}`}
        className="order-2 md:order-0 flex w-full flex-col items-center md:items-end justify-center text-center md:text-right gap-6 text-foreground px-2 md:px-8 lg:px-14 py-10 md:py-14 lg:pt-20 lg:pb-39"
        onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))}
        onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
        onClick={() => trackEvent("project_card_click", { slug: nextProject.slug, location: "next_project_banner_next" })}
      >
        <span className="text-base-bold">Next project</span>
        <h3 className="type-h3">{nextProject.title}</h3>
      </Link>
    </section>
  );
}
