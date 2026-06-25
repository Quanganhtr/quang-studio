"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { PROJECTS, type Project, isVideoSrc } from "@/lib/projects";
import { useProjectNav } from "@/lib/useProjectNav";
import { trackEvent } from "@/lib/gtag";

const CARDS = PROJECTS.slice(0, 5);

function WaveCard({
  card,
  onOpen,
  loading,
}: {
  card: Project;
  // ⚡️ DEVELOPER: navigates to the project detail page (/work/[slug])
  onOpen: (slug: string) => void;
  loading: boolean;
}) {
  return (
    <motion.div
      className="shrink-0 w-[24vw] aspect-square border-2 border-background flex flex-col justify-between p-6 cursor-pointer relative overflow-hidden"
      onClick={() => {
        trackEvent("project_card_click", { slug: card.slug, location: "my_work_desktop" });
        onOpen(card.slug);
      }}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
    >
      {isVideoSrc(card.thumbnail) ? (
        <video
          src={card.thumbnail}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={card.thumbnail}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        />
      )}
      <div className="relative z-10 contents">
        <span className="text-sm-regular text-muted-foreground">{card.index}</span>
        <div className="flex flex-col gap-1">
          <p className="text-base-bold text-foreground">{card.title}</p>
          <p className="text-sm-regular text-muted-foreground">{card.category}</p>
        </div>
      </div>
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40">
          <i className="ri-loader-4-line animate-spin text-background text-3xl" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  );
}

export default function MyWork() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { loadingSlug, openProject } = useProjectNav();

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const x      = useTransform(scrollYProgress, [0, 1], ["20vw",  "-60vw"]);
  const xCards = useTransform(scrollYProgress, [0, 1], ["-40vw", "40vw"]);

  return (
    <>
      <section className="flex flex-col">

        {/* ── Desktop ── */}
        <div ref={scrollRef} className="relative hidden lg:flex flex-col" style={{ height: "300vh" }}>
          <div className="sticky top-0 h-app overflow-hidden">
            <div className="relative w-full h-full" style={{ paddingBlock: "var(--section-padding)" }}>
              {/* Text — pans right → left */}
              <motion.div
                className="font-display font-normal whitespace-nowrap"
                style={{ fontSize: "30vh", lineHeight: 1.75, x }}
              >
                MY CTRL+Z LIFE
              </motion.div>

              {/* Cards — pan left → right, overlapping text */}
              <motion.div className="absolute flex gap-4 items-end" style={{ x: xCards, top: "calc(48vh - 56px)", left: 0 }}>
                {CARDS.map((card) => (
                  <WaveCard
                    key={card.slug}
                    card={card}
                    onOpen={openProject}
                    loading={loadingSlug === card.slug}
                  />
                ))}
              </motion.div>

              {/* Button — bottom left, overlays cards */}
              <div className="absolute bottom-0 left-0 z-10" style={{ padding: "var(--section-padding)" }}>
                <Button variant="solid" size="lg" label="VIEW ALL WORK" hoverLabel="LET'S GO →" href="/work" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: "-100px" }}
          className="lg:hidden flex flex-col gap-18 md:gap-50 pt-39 md:pt-16 pb-0 md:pb-16"
        >
          <div className="flex flex-col gap-6" style={{ paddingInline: "var(--section-padding)" }}>
            <h2 className="type-h2">MY CTRL+Z LIFE</h2>
            <Button variant="solid" size="lg" label="VIEW ALL WORK" hoverLabel="LET'S GO →" href="/work" className="self-start" />
          </div>

          {/* Carousel */}
          <div
            className="flex flex-row overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ paddingInline: "var(--section-padding)", gap: "16px", scrollbarWidth: "none" }}
          >
            {CARDS.map((card) => (
              <div
                key={card.slug}
                className="shrink-0 w-[80vw] aspect-square border-2 border-background cursor-pointer relative overflow-hidden snap-center flex flex-col justify-between p-6"
                onClick={() => {
                  trackEvent("project_card_click", { slug: card.slug, location: "my_work_mobile" });
                  openProject(card.slug);
                }}
                onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))}
                onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
              >
                {isVideoSrc(card.thumbnail) ? (
                  <video
                    src={card.thumbnail}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={card.thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    aria-hidden
                  />
                )}
                <div className="relative z-10 contents">
                  <span className="text-sm-regular text-muted-foreground">{card.index}</span>
                  <div className="flex flex-col gap-1">
                    <p className="text-base-bold text-foreground">{card.title}</p>
                    <p className="text-sm-regular text-muted-foreground">{card.category}</p>
                  </div>
                </div>
                {loadingSlug === card.slug && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40">
                    <i className="ri-loader-4-line animate-spin text-background text-3xl" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </section>
    </>
  );
}
