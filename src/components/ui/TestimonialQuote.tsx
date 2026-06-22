"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { QuotePart } from "@/lib/projects";

// Spotlight band — full opacity only while a word's center sits within
// ~16% of viewport height around the vertical center (roughly 2-3 lines).
function RevealWord({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center 0.75", "center 0.58", "center 0.42", "center 0.25"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.33, 0.67, 1], [0.15, 1, 1, 0.15]);

  return (
    <motion.span
      ref={ref}
      className="text-foreground"
      style={{ opacity, display: "inline-block" }}
    >
      {word}
    </motion.span>
  );
}

export default function TestimonialQuote({ quote }: { quote: QuotePart[] }) {
  const words = quote.flatMap((part) =>
    part.text.split(" ").filter(Boolean).map((word) => ({ word, highlight: part.highlight }))
  );

  return (
    <h2 className="type-h2 max-w-7xl" style={{ wordSpacing: "0.12em" }}>
      {words.map(({ word }, i) => (
        <span key={i}>
          {i === 0 && <span className="text-foreground">&quot;</span>}
          <RevealWord word={word} />
          {i === words.length - 1 && <span className="text-foreground">&quot;</span>}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h2>
  );
}
