"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ProjectTitleLink({
  title,
  liveUrl,
}: {
  title: string;
  liveUrl: string;
}) {
  const [hovered, setHovered]   = useState(false);
  const [rotation, setRotation] = useState(0);

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
      onMouseEnter={() => {
        setRotation(Math.random() * 16 - 8);
        setHovered(true);
        window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "CHECK LIVE SITE" } }));
      }}
      onMouseLeave={() => {
        setHovered(false);
        window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }));
      }}
    >
      <motion.h2
        className="type-h2 inline-block"
        animate={hovered ? { scale: 1.25, rotate: rotation } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {title}
      </motion.h2>
    </a>
  );
}
