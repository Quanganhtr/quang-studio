"use client";

import { motion } from "framer-motion";

const lines = ["ARCHITECT BY ROOTS", "PRODUCT DESIGNER", "BY CHOICE."];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const lineVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative flex flex-col" style={{ height: "100dvh" }}>
{/* Main headline — absolutely centered on screen */}
      <motion.div
        className="absolute text-center flex flex-col"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          gap: 20,
          width: "100%",
          paddingLeft: 24,
          paddingRight: 24,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {lines.map((line) => (
          <motion.h1
            key={line}
            variants={lineVariants}
            className="label-lg"
          >
            {line}
          </motion.h1>
        ))}
      </motion.div>

      {/* Name + role — bottom center */}
      <motion.div
        className="flex flex-col items-center gap-1"
        style={{ paddingBottom: 32, marginTop: "auto" }}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.9 }}
      >
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Geist Mono', monospace", color: "var(--gray-6)" }}
        >
          Quang Anh Tran
        </span>
        <span
          className="text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Geist Mono', monospace", color: "var(--gray-6)" }}
        >
          Product Designer
        </span>
      </motion.div>
    </section>
  );
}
