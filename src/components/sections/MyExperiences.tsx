"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

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

const TITLE = `HOW I SURVIVE AFTER\nSAYING "BYE" TO\nARCHITECTURE.`;

function TypewriterTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(TITLE.slice(0, i));
      if (i >= TITLE.length) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <h2 ref={ref} className="type-h2" style={{ whiteSpace: "pre-line" }}>
      {displayed}
    </h2>
  );
}

export default function MyExperiences() {
  return (
    <section className="flex flex-col section-container max-w-none pt-60 pb-50">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <TypewriterTitle />
      </motion.div>

      {/* Experience list */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col mt-32 border-t border-dashed border-foreground"
      >
        {EXPERIENCES.map(({ label, groups }) => (
          <div
            key={label}
            className="flex flex-row items-start justify-between border-b border-dashed border-foreground"
            style={{ padding: "16px" }}
          >
            {/* Left — step label */}
            <span className="text-base-bold text-foreground shrink-0">{label}</span>

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
