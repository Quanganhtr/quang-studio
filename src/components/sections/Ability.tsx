"use client";

import { motion } from "framer-motion";
import { DragMatchGrid } from "@/components/ui/DragMatchGrid";

export default function Ability() {
  return (
    <section
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px",
        gap: 240,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 1440, alignItems: "center", textAlign: "center" }}
      >
        <span className="label-sm" style={{ color: "var(--foreground)" }}>
          ABILITY TO MESS THINGS UP
        </span>

        <h2 className="label-h2 text-center">
          LET ME BUILD A MAGICAL BRIDGE CONNECTING YOUR BUSINESS → END-USERS.
        </h2>
      </motion.div>

      <div style={{ width: "100%" }}>
        <DragMatchGrid
          cardBg="var(--background)"
          borderColor="var(--gray-3)"
          borderWidth={1}
          tickerColor="var(--foreground)"
          tickerLength={16}
          tickerWeight={1}
          cards={[
            { targetImg: "/Images/Target-PT.png", dragImg: "/Images/Drag-PT.png", imgSizePercent: 40, media: "/Images/Product Thinking.gif" },
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
