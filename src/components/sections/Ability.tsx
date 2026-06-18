"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DragMatchGrid } from "@/components/ui/DragMatchGrid";

const WORDS = "LET ME BUILD A MAGICAL BRIDGE CONNECTING YOUR BUSINESS → END-USERS.".split(" ");

function WordReveal() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.5"],
  });

  return (
    <h2 ref={ref} className="type-h2 text-center">
      {WORDS.map((word, i) => {
        const start = i / WORDS.length;
        const end   = (i + 1) / WORDS.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        return (
          <motion.span key={i} style={{ opacity, display: "inline-block" }}>
            {word}
            {i < WORDS.length - 1 ? " " : ""}
          </motion.span>
        );
      })}
    </h2>
  );
}

export default function Ability() {
  return (
    <section className="app-visible-screen flex flex-col items-center justify-center w-full pt-39 md:pt-60 pb-0 md:pb-60 gap-30 md:gap-50 lg:gap-60">
      <div className="flex flex-col gap-4 section-container items-center text-center">
        <WordReveal />
      </div>

      <div className="w-full">
        <DragMatchGrid
          cardBg="var(--background)"
          borderColor="var(--border)"
          borderWidth={1}
          tickerColor="var(--muted-foreground)"
          tickerLength={8}
          tickerWeight={1}
          cards={[
            { targetImg: "/images/Target-PT.png", dragImg: "/images/Drag-PT.png", imgSizePercent: 40, media: "/images/Product Thinking.gif" },
            { targetImg: "/images/Target-IU.png", dragImg: "/images/Drag-IU.png", imgSizePercent: 50, media: "/images/interaction.gif" },
            { targetImg: "/images/Target-AAD.png", dragImg: "/images/Drag-AAD.png", imgSizePercent: 50, media: "/images/ai.gif" },
            { targetImg: "/images/Target-PD.png", dragImg: "/images/Drag-PD.png", imgSizePercent: 50, media: "/images/3d.gif" },
            { targetImg: "/images/TARGET-MD.png", dragImg: "/images/DRAG-MD.png", imgSizePercent: 50, media: "/images/motion.gif" },
            { targetImg: "/images/Target-Brand.png", dragImg: "/images/Drag-Brand.png", imgSizePercent: 40, media: "/images/brand.gif" },
          ]}
        />
      </div>
    </section>
  );
}
