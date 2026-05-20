"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const CARDS = [
  { index: "00", title: "Project Name", category: "Product Design", bg: "/vietnam-thumbnail.png" },
  { index: "01", title: "Project Name", category: "Branding", bg: "/noodles-thumbnail.gif" },
  { index: "02", title: "Project Name", category: "Product Design", bg: "/adafun-thumbnail.png" },
  { index: "03", title: "Project Name", category: "UX Research", bg: "/reviewnha-thumbnail.png" },
  { index: "04", title: "Project Name", category: "Motion", bg: "/minswap-thumbnail.gif" },
];

function WaveCard({
  progress,
  phase,
  card,
}: {
  progress: MotionValue<number>;
  phase: number;
  card: (typeof CARDS)[number];
}) {
  const y      = useTransform(progress, (v) => Math.sin(v * Math.PI * 2 + phase) * 40);
  const rotate = useTransform(progress, (v) => Math.cos(v * Math.PI * 2 + phase) * 8);
  const scale  = useTransform(progress, (v) => 1 + 0.2 * ((Math.cos(v * Math.PI * 2 + phase) + 1) / 2));

  return (
    <motion.div
      style={{ y, rotate, scale }}
      className="shrink-0 w-[22vw] aspect-square border border-border flex flex-col justify-between p-6 cursor-pointer relative overflow-hidden"
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
    >
      {card.bg && (
        <img
          src={card.bg}
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
    </motion.div>
  );
}

export default function MyWork() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const x      = useTransform(scrollYProgress, [0, 1], ["20vw",  "-60vw"]);
  const xCards = useTransform(scrollYProgress, [0, 1], ["-40vw", "40vw"]);

  return (
    <section className="flex flex-col">

      {/* ── Desktop ── */}
      <div ref={scrollRef} className="relative hidden lg:flex flex-col" style={{ height: "300vh" }}>
        <div
          className="sticky top-0 h-app overflow-hidden"
        >
          <div className="relative w-full h-full" style={{ paddingBlock: "var(--section-padding)" }}
        >
          {/* Text — pans right → left */}
          <motion.div
            className="font-display font-normal whitespace-nowrap"
            style={{ fontSize: "30vh", lineHeight: 1.75, x }}
          >
            MY CTRL+Z LIFE
          </motion.div>

          {/* Cards — pan left → right with wave, overlapping text */}
          <motion.div className="absolute flex gap-10 items-end" style={{ x: xCards, top: "48vh", left: 0 }}>
            {CARDS.map((card, i) => (
              <WaveCard
                key={card.index}
                progress={scrollYProgress}
                phase={i * (Math.PI / 2)}
                card={card}
              />
            ))}
          </motion.div>
          </div>
        </div>
      </div>

      {/* ── Mobile ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        className="lg:hidden flex flex-col gap-8 pt-39 md:pt-16 pb-16"
      >
        <h2
          className="type-h2"
          style={{ paddingInline: "var(--section-padding)" }}
        >
          MY CTRL+Z LIFE
        </h2>

        {/* Carousel */}
        <div
          className="flex flex-row-reverse overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ paddingInline: "var(--section-padding)", gap: "16px", scrollbarWidth: "none" }}
        >
          {CARDS.map((card) => (
            <div
              key={card.index}
              className="shrink-0 w-[80vw] aspect-square border border-border cursor-pointer relative overflow-hidden snap-center flex flex-col justify-between p-6"
            >
              {card.bg && (
                <img
                  src={card.bg}
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
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
