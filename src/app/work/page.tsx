"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";

const CARDS = [
  { index: "00", title: "Project Name", category: "Product Design", bg: "/vietnam-thumbnail.png" },
  { index: "01", title: "Project Name", category: "Branding",       bg: "/noodles-thumbnail.gif" },
  { index: "02", title: "Project Name", category: "Product Design", bg: "/adafun-thumbnail.png"  },
  { index: "03", title: "Project Name", category: "UX Research",    bg: "/reviewnha-thumbnail.png" },
  { index: "04", title: "Project Name", category: "Motion",         bg: "/minswap-thumbnail.gif"  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="section-container max-w-none pt-32 md:pt-44 pb-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col gap-8 md:gap-10"
          >
            <motion.h2 variants={fadeUp} className="type-h2">
              MY WORK
            </motion.h2>

            <motion.div variants={fadeUp} className="w-full overflow-hidden">
              <img
                src="/work-main.png"
                alt="Work overview"
                className="w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── Project list ──────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-t border-dashed border-foreground py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground border border-foreground">
            {CARDS.map((card, i) => (
              <motion.div
                key={card.index}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="relative aspect-square bg-background overflow-hidden cursor-pointer flex flex-col justify-between p-6 group"
                onMouseEnter={() =>
                  window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CLICK TO JUDGE" } }))
                }
                onMouseLeave={() =>
                  window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))
                }
              >
                {card.bg && (
                  <img
                    src={card.bg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    aria-hidden
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                <span className="relative z-10 text-sm-regular text-white/70">{card.index}</span>
                <div className="relative z-10 flex flex-col gap-1">
                  <p className="text-base-bold text-white">{card.title}</p>
                  <p className="text-sm-regular text-white/70">{card.category}</p>
                </div>
              </motion.div>
            ))}

            {/* Fill last cell if odd count */}
            {CARDS.length % 2 !== 0 && (
              <div className="aspect-square bg-background" />
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
