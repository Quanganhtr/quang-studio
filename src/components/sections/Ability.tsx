"use client";

import { motion } from "framer-motion";
import { DragMatchGrid } from "@/components/ui/DragMatchGrid";

export default function Ability() {

  return (
    <section
      className="app-visible-screen flex flex-col items-center justify-center w-full pt-60"
      style={{
        gap: 240,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-4 section-container items-center text-center"
      >
        <span className="label-sm text-foreground">
          ABILITY TO MESS THINGS UP
        </span>

        <h2 className="type-h2 text-center">
          LET ME BUILD A MAGICAL BRIDGE CONNECTING YOUR BUSINESS → END-USERS.
        </h2>
      </motion.div>

      <div className="w-full px-(--section-padding)">
        <DragMatchGrid
          cardBg="var(--background)"
          borderColor="var(--border)"
          borderWidth={1}
          tickerColor="var(--muted-foreground)"
          tickerLength={8}
          tickerWeight={1}
          cards={[
            { targetImg: "/images/Target-PT.png", dragImg: "/images/Drag-PT.png", imgSizePercent: 40, media: "/images/Product Thinking.gif" },
            { targetImg: "/images/Target-IU.png", dragImg: "/images/Drag-IU.png", imgSizePercent: 50, media: "/images/Product Thinking.gif" },
            { targetImg: "/images/Target-AAD.png", dragImg: "/images/Drag-AAD.png", imgSizePercent: 50, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
          ]}
        />
      </div>
    </section>
  );
}
