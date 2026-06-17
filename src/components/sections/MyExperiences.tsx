"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/Button";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Item = { text: string; muted?: boolean; large?: boolean; largeMuted?: boolean };

const EXPERIENCES: { label: string; groups: Item[][] }[] = [
  {
    label: "STEP 1",
    groups: [
      [{ text: "Came to", muted: true }, { text: "CONSULT INDOCHINA", large: true }],
      [{ text: "as", muted: true }, { text: "UIUX DESIGN LEAD", largeMuted: true }],
      [{ text: "from", muted: true }, { text: "2016", largeMuted: true }, { text: "to", muted: true }, { text: "2022", largeMuted: true }],
    ],
  },
  {
    label: "STEP 2",
    groups: [
      [{ text: "Entered", muted: true }, { text: "CryptoPie Labo", large: true }],
      [{ text: "as", muted: true }, { text: "Product Design Lead", largeMuted: true }],
      [{ text: "from", muted: true }, { text: "2022", largeMuted: true }, { text: "to", muted: true }, { text: "2024", largeMuted: true }],
    ],
  },
  {
    label: "STEP 3",
    groups: [
      [{ text: "Landed at", muted: true }, { text: "Minswap Labs", large: true }],
      [{ text: "as", muted: true }, { text: "Product Design Lead", largeMuted: true }],
      [{ text: "from", muted: true }, { text: "2024", largeMuted: true }, { text: "to", muted: true }, { text: "Present", largeMuted: true }],
    ],
  },
  {
    label: "EXTRA STEP",
    groups: [
      [{ text: "Check", muted: true }, { text: "my Linkedin", large: true }],
    ],
  },
  {
    label: "FUTURE STEP",
    groups: [
      [{ text: "It", muted: true }, { text: "Depends on you", large: true }],
    ],
  },
];

function itemClass(item: Item) {
  if (item.muted)      return "text-base-medium text-muted-foreground";
  if (item.largeMuted) return "text-lg-medium text-muted-foreground";
  if (item.large)      return "text-lg-medium text-foreground";
  return "text-base-bold text-foreground";
}

const TITLE_LINES = [`HOW I SURVIVE AFTER`, `SAYING "BYE" TO`, `ARCHITECTURE.`];

function RevealLine({ line }: { line: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const y = useTransform(smooth, [0, 1], ["105%", "0%"]);

  return (
    <span ref={ref} style={{ display: "block", overflow: "hidden" }}>
      <motion.span style={{ display: "block", y }}>{line}</motion.span>
    </span>
  );
}

function LineRevealTitle() {
  return (
    <h2 className="type-h2 flex flex-col" style={{ gap: "0.05em" }}>
      {TITLE_LINES.map((line, i) => (
        <RevealLine key={i} line={line} />
      ))}
    </h2>
  );
}

export default function MyExperiences() {
  return (
    <section className="flex flex-col section-container max-w-none pt-39 md:pt-60 pb-24 md:pb-50">

      {/* Title + button */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <LineRevealTitle />
        <Button variant="solid" size="lg" label="ABOUT ME" hoverLabel="LET'S GO →" href="/about" className="self-start lg:self-auto" />
      </div>

      {/* Experience list */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col mt-18 md:mt-50 lg:mt-60 border-t border-ui"
      >
        {EXPERIENCES.map(({ label, groups }) => (
          <div
            key={label}
            className="flex flex-row items-start justify-between border-b border-ui p-4 lg:p-8"
          >
            {/* Left — step label */}
            <div className="flex items-center gap-4 shrink-0 self-center">
              <div className="w-3 h-3 bg-foreground shrink-0" />
              <span className="text-base-bold text-foreground">{label}</span>
            </div>

            {/* Right — mobile: stacked groups / desktop: single row */}
            <div className="flex flex-col gap-1 items-end lg:hidden">
              {groups.map((group, gi) => (
                <div key={gi} className="flex flex-row items-baseline justify-end" style={{ gap: "12px" }}>
                  {group.map((item, i) => (
                    <span key={i} className={itemClass(item)}>{item.text}</span>
                  ))}
                </div>
              ))}
            </div>
            <div className="hidden lg:flex flex-row items-baseline" style={{ gap: "12px" }}>
              {groups.flat().map((item, i) => (
                <span key={i} className={itemClass(item)}>{item.text}</span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>

    </section>
  );
}
