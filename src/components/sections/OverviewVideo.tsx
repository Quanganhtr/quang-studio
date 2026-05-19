"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PixelMosaicVideo from "@/components/ui/PixelMosaicVideo";

export default function OverviewVideo() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const startPadding   = useRef(56);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if      (window.innerWidth >= 1280) startPadding.current = 56;
      else if (window.innerWidth >= 768)  startPadding.current = 32;
      else                                startPadding.current = 0;
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "start start"],
  });

  // inset shrinks from section-padding → 0 as user scrolls through the sticky zone
  const inset = useTransform(scrollYProgress, (p) =>
    startPadding.current * (1 - Math.min(p, 1))
  );

  return (
    // Extra height creates the scroll room for the animation
    <div ref={containerRef} className="min-h-app md:h-[calc(var(--app-height)*1.5)]">
      <div className="app-sticky-screen overflow-hidden">
        <motion.div
          style={{
            position: "absolute",
            top:    inset,
            left:   inset,
            right:  inset,
            bottom: inset,
          }}
        >
          <PixelMosaicVideo video={isMobile ? "/overview-video-mobile.mp4" : "/overview-video.mp4"} />
        </motion.div>
      </div>
    </div>
  );
}
