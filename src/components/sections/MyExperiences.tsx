"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/Button";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Item = { text: string; muted?: boolean; large?: boolean; largeMuted?: boolean; href?: string };

const EXPERIENCES: { label: string; groups: Item[][] }[] = [
  {
    label: "STEP 1",
    groups: [
      [{ text: "Came to", muted: true }, { text: "Consult Indochina", large: true }],
      [{ text: "as", muted: true }, { text: "UIUX Design Lead", largeMuted: true }],
      [{ text: "from", muted: true }, { text: "2016", largeMuted: true }, { text: "to", muted: true }, { text: "2022", largeMuted: true }],
    ],
  },
  {
    label: "STEP 2",
    groups: [
      [{ text: "Entered", muted: true }, { text: "Blitz Labo", large: true }],
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
      [{ text: "Check", muted: true }, { text: "my Linkedin", large: true, href: "https://www.linkedin.com/in/quanganhtr" }],
    ],
  },
  {
    label: "FUTURE STEP",
    groups: [
      [{ text: "It", muted: true }, { text: "Depends on you", large: true }],
    ],
  },
];

function AnimatedLine({ side }: { side: "top" | "bottom" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className={`absolute ${side === "top" ? "top-0" : "bottom-0"} left-0 right-0 ${side === "top" ? "border-t" : "border-b"} border-ui`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: isInView ? 1 : 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ transformOrigin: "left" }}
    />
  );
}

function itemClass(item: Item) {
  if (item.muted)      return "text-base-medium opacity-50";
  if (item.largeMuted) return "text-lg-medium opacity-50";
  if (item.large)      return "text-lg-medium";
  return "text-base-bold";
}

const TITLE_WORDS = `HOW I SURVIVE AFTER SAYING "BYE" TO ARCHITECTURE.`.split(" ");
const TITLE_BREAKS = [3, 6];

function WordRevealTitle() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.5"],
  });
  return (
    <h2 ref={ref} className="type-h2">
      {TITLE_WORDS.map((word, i) => {
        const start = i / TITLE_WORDS.length;
        const end   = (i + 1) / TITLE_WORDS.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        return (
          <span key={i}>
            <motion.span style={{ opacity, display: "inline-block" }}>{word}</motion.span>
            {TITLE_BREAKS.includes(i) ? <br /> : i < TITLE_WORDS.length - 1 ? " " : ""}
          </span>
        );
      })}
    </h2>
  );
}

export default function MyExperiences() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      if (listRef.current) listRef.current.style.color = (e as CustomEvent<string>).detail;
    };
    document.addEventListener("footer-fg-color", handler);
    return () => document.removeEventListener("footer-fg-color", handler);
  }, []);

  return (
    <section className="flex flex-col section-container max-w-none pt-39 md:pt-60 pb-24 md:pb-50">

      {/* Title + button */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <WordRevealTitle />
        <Button variant="solid" size="lg" label="ABOUT ME" hoverLabel="LET'S GO →" href="/about" className="self-start lg:self-auto" />
      </div>

      {/* Experience list */}
      <div ref={listRef} className="flex flex-col mt-18 md:mt-50 lg:mt-60 relative">
        <AnimatedLine side="top" />

        {EXPERIENCES.map(({ label, groups }) => (
          <div
            key={label}
            className="relative flex flex-row items-start justify-between p-4 lg:p-8"
          >
            {/* Left — step label */}
            <div className="flex items-center gap-4 shrink-0 self-center">
              <div className="w-3 h-3 bg-current shrink-0" />
              <span className="text-base-bold">{label}</span>
            </div>

            {/* Right — mobile: stacked groups / desktop: single row */}
            <div className="flex flex-col gap-1 items-end lg:hidden">
              {groups.map((group, gi) => (
                <div key={gi} className="flex flex-row items-baseline justify-end" style={{ gap: "12px" }}>
                  {group.map((item, i) =>
                    item.href ? (
                      <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={`${itemClass(item)} underline underline-offset-4`}>{item.text}</a>
                    ) : (
                      <span key={i} className={itemClass(item)}>{item.text}</span>
                    )
                  )}
                </div>
              ))}
            </div>
            <div className="hidden lg:flex flex-row items-baseline" style={{ gap: "12px" }}>
              {groups.flat().map((item, i) =>
                item.href ? (
                  <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className={`${itemClass(item)} underline underline-offset-4`}>{item.text}</a>
                ) : (
                  <span key={i} className={itemClass(item)}>{item.text}</span>
                )
              )}
            </div>

            <AnimatedLine side="bottom" />
          </div>
        ))}
      </div>

    </section>
  );
}
