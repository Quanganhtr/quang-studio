"use client";

import { motion } from "framer-motion";
import { DragMatchGrid } from "@/components/ui/DragMatchGrid";

export default function Ability() {

  return (
    <section
      className="flex flex-col items-center justify-center min-h-dvh section-container pt-60"
      style={{
        gap: 240,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-4 w-full max-w-360 items-center text-center"
      >
        <span className="label-sm text-foreground">
          ABILITY TO MESS THINGS UP
        </span>

        <h2 className="type-h2 text-center">
          LET ME BUILD A MAGICAL BRIDGE CONNECTING YOUR BUSINESS → END-USERS.
        </h2>
      </motion.div>

      <div className="w-full">
        <DragMatchGrid
          cardBg="var(--background)"
          borderColor="var(--gray-3)"
          borderWidth={1}
          tickerColor="var(--foreground)"
          tickerLength={16}
          tickerWeight={1}
          cards={[
            { targetImg: "/images/Target-PT.png", dragImg: "/images/Drag-PT.png", imgSizePercent: 40, media: "/images/Product Thinking.gif" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
            { targetImg: "", dragImg: "", imgSizePercent: 30, media: "" },
          ]}
        />
      </div>
    </section>
  );
}
