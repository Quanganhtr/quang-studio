"use client";

import { useRef } from "react";
import { useScroll, useTransform, useSpring, motion } from "framer-motion";

export default function HeroVideoTransition({
  hero,
  video,
}: {
  hero: React.ReactNode;
  video: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 18,
    restDelta: 0.001,
  });

  const heroX  = useTransform(smooth, [0, 1], ["0%", "-100%"]);
  const videoX = useTransform(smooth, [0, 1], ["100%", "0%"]);

  return (
    <div ref={containerRef} className="min-h-app md:h-[calc(var(--app-height)*2)]">
      <div className="app-sticky-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ x: heroX }}>
          {hero}
        </motion.div>
        <motion.div className="absolute inset-0" style={{ x: videoX }}>
          {video}
        </motion.div>
      </div>
    </div>
  );
}
