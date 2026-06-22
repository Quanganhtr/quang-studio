"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WordReveal({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(" ");
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.5"] });

  return (
    <h2 ref={ref} className={className} style={style}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end   = (i + 1) / words.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);
        return (
          <span key={i}>
            <motion.span style={{ opacity, display: "inline-block" }}>{word}</motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </h2>
  );
}
