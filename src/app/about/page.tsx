"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── PROJECT PILLS ────────────────────────────────────────────────────────

interface Project {
  label: string;
  // 📦 DEVELOPER: Replace with real image paths in /public/
  image: string;
}

const ARCH_PROJECTS: Project[] = [
  { label: "Rehab Camp", image: "/images/arch-rehab-camp.jpg" },
  { label: "Museum",     image: "/images/arch-museum.jpg"     },
  { label: "Hotel",      image: "/hotel.png"                   },
];

const PILL_STYLES = [
  { bg: "bg-foreground", text: "text-background"         },
  { bg: "bg-primary",    text: "text-primary-foreground" },
  { bg: "bg-muted",      text: "text-primary-foreground" },
];

const PILL_ROTATIONS    = [-4, 3, -2];
const IMAGE_ROTATIONS   = [8, -8, 8];

interface ProjectPillProps extends Project {
  index:        number;
  onHoverStart: () => void;
  onHoverEnd:   () => void;
}

function ProjectPill({ label, index, onHoverStart, onHoverEnd }: ProjectPillProps) {
  const { bg, text } = PILL_STYLES[index % PILL_STYLES.length];
  const rotation     = PILL_ROTATIONS[index % PILL_ROTATIONS.length];

  return (
    <span
      className="relative inline-flex"
      style={{ marginLeft: index === 0 ? 0 : 4, zIndex: index + 1 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <motion.span
        className={`inline-flex items-center cursor-default select-none ${bg} ${text}`}
        style={{
          paddingInline: 12,
          paddingBlock:  2,
          fontFamily:    "var(--font-mono)",
          fontSize:      "inherit",
          fontWeight:    600,
          lineHeight:    "inherit",
          rotate:        rotation,
        }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {label}
      </motion.span>
    </span>
  );
}

// ─── ORIGIN STORY SECTION ────────────────────────────────────────────────

function OriginStorySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="flex flex-col gap-10 md:gap-12"
      >
        <motion.h3
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
          className="text-lg-medium text-foreground"
        >
          # My origin story
        </motion.h3>

        <div className="flex flex-col max-w-2xl" style={{ gap: 32 }}>
          {[
            "Before I became a product designer, I was supposed to become an architect. It wasn’t a dramatic “I was born to be” story. It was more personal than that.",
            "My dad really wanted to become an architect. But life did what life usually does: opened too many tabs, crashed the system, and that dream never fully happened for him.",
            null, // pills paragraph — rendered separately
            "Then in my 3rd year, something unexpected happened. I got my first UI/UX design job with salary of 1.5 million VND ($60) per month. A very small number. But somehow, it became a very big turning point.",
          ].map((para, i) =>
            para === null ? (
              <motion.p
                key="pills"
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
                className="text-lg-regular text-muted-foreground"
                style={{ lineHeight: 1.85 }}
              >
                So I decided to carry his dream and studied architecture at <span style={{ fontWeight: 600 }}>Hanoi Architectural University</span>. Partly for myself, partly for him. For a while, it looked like the plan was working. I designed{" "}
                <span className="inline-flex items-center">
                  {ARCH_PROJECTS.map((p, pi) => (
                    <ProjectPill
                      key={p.label}
                      {...p}
                      index={pi}
                      onHoverStart={() => setHoveredIndex(pi)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    />
                  ))}
                </span>
                {" "}...
              </motion.p>
            ) : (
              <motion.p
                key={i}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
                className="text-lg-regular text-muted-foreground"
                style={{ lineHeight: 1.85 }}
              >
                {para}
              </motion.p>
            )
          )}
        </div>
      </motion.div>

      {/* Right-side image preview */}
      <AnimatePresence mode="wait">
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ right: 156, rotate: IMAGE_ROTATIONS[hoveredIndex] }}
          >
            <div className="overflow-hidden bg-card" style={{ width: "22vw", height: "22vw", border: "2px solid var(--foreground)" }}>
              <img
                src={ARCH_PROJECTS[hoveredIndex].image}
                alt={ARCH_PROJECTS[hoveredIndex].label}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HOW I SURVIVE NOW SECTION ───────────────────────────────────────────

const HOW_I_SURVIVE_PARAGRAPHS = [
  "Somehow, that $60/month job didn't scare me off. It taught me. I learned Figma by Googling, shipped things by guessing, and presented designs to stakeholders while quietly hoping nobody would ask too many questions.",
  "I left architecture school without finishing the blueprint. But I walked into product design with something most designers don't have: five years of thinking about how people move through space, how structures hold weight, and why a bad layout makes people feel lost before they even realize it.",
  "Now I work as a product designer. I obsess over spacing, argue about 4px versus 8px, and occasionally explain to a developer why \"just move it a little to the left\" is a real design decision. The usual. It's not the career my dad dreamed of. But it's the one that somehow kept finding me — and at some point, I stopped running from it.",
];

function HowISurviveSection() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      className="flex flex-col gap-10 md:gap-12"
    >
      <motion.h3
        variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
        className="text-lg-medium text-foreground"
      >
        # How I survive now
      </motion.h3>

      <div className="flex flex-col max-w-2xl" style={{ gap: 32 }}>
        {HOW_I_SURVIVE_PARAGRAPHS.map((para, i) => (
          <motion.p
            key={i}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
            className="text-lg-regular text-muted-foreground"
            style={{ lineHeight: 1.85 }}
          >
            {para}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

// ─── ARCH HAUNTS SECTION ─────────────────────────────────────────────────

const ARCH_HAUNTS_PARAGRAPHS = [
  "The funny thing is, I never really left architecture. I just changed materials.",
  "Before, I designed with walls, doors, rooms, and circulation for users who got lost even when the exit sign was glowing. Now, I design buttons, cards, flows, states for users who definitely did not read the tooltip.",
  "Architecture taught me to think about space. Product design taught me to think about digital space. Both are about helping people move from one point to another without feeling lost, confused, or personally attacked by the layout.",
  "Maybe my dad's dream didn't disappear. It just got a different type of blueprint.",
];

function ArchHauntsSection() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="flex flex-col max-w-2xl ml-auto gap-10 md:gap-12"
      >
        <motion.h3
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
          className="text-lg-medium text-foreground"
        >
          # Architecture still haunts me
        </motion.h3>

        <div className="flex flex-col" style={{ gap: 32 }}>
          {ARCH_HAUNTS_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
              className="text-lg-regular text-muted-foreground"
              style={{ lineHeight: 1.85 }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </>
  );
}

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── PAGE ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="section-container max-w-none pt-32 md:pt-44 pb-12 md:pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col gap-6 md:gap-8 lg:gap-10"
          >
            {/* Title: # QUANG.md */}
            <motion.h2 variants={fadeUp} className="type-h2 flex flex-wrap items-baseline gap-x-3">
              <span className="text-foreground">ABOUT_QUANG</span>
              <span className="text-lg-bold text-muted-foreground">.md</span>
            </motion.h2>

            <motion.div variants={fadeUp} className="flex flex-row items-start gap-8">
              <img src={buttonHovered ? "/shut-up.png" : "/talking.png"} alt="" style={{ width: 256, height: 256, objectFit: "contain", flexShrink: 0 }} />

              <div className="flex flex-col gap-6 ml-auto max-w-2xl">
                {/* Subtitle */}
                <p className="text-lg-regular text-foreground max-w-2xl text-left" style={{ lineHeight: 1.75 }}>
                  {"A personal README file about a designer who carried his dad's architect dream, then accidentally ended up with a F"}
                  <s>oor</s>
                  {"igma Plan — $15/month."}
                </p>

                <div className="flex flex-col gap-3">
                  <p className="text-lg-regular text-muted-foreground">Quang talks too much?</p>
                  <Button variant="solid" onMouseEnter={() => setButtonHovered(true)} onMouseLeave={() => setButtonHovered(false)}>Run summary to shut him up</Button>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </section>

        {/* ── Body: 2-column story sections ─────────────────────────────── */}
        <section className="section-container max-w-none border-t border-dashed border-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative py-12 md:py-16 lg:pr-12 lg:border-r lg:border-dashed lg:border-foreground flex flex-col gap-16 md:gap-96">
              <OriginStorySection />
              <HowISurviveSection />
            </div>
            <div className="relative py-12 md:py-16 lg:pl-12 lg:pt-60 border-t border-dashed border-foreground lg:border-t-0">
              <ArchHauntsSection />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
