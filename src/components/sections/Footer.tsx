"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useTheme } from "@/lib/ThemeContext";
import logoData from "../../../public/logo.json";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function FooterLogo({ isDark }: { isDark: boolean }) {
  const lottieRef = useRef<any>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef  = useRef<"forward" | "backward">("forward");
  const hoveredRef = useRef(false);

  const playForward = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    phaseRef.current = "forward";
    anim.setDirection(1);
    anim.goToAndPlay(0, true);
  }, []);

  const handleComplete = useCallback(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (phaseRef.current === "forward") {
      timerRef.current = setTimeout(() => {
        phaseRef.current = "backward";
        anim.setDirection(-1);
        anim.goToAndPlay(23, true);
      }, 2000);
    } else {
      timerRef.current = setTimeout(() => {
        playForward();
      }, 10000);
    }
  }, [playForward]);

  const handleMouseEnter = useCallback(() => {
    hoveredRef.current = true;
    if (phaseRef.current === "backward" && timerRef.current) playForward();
  }, [playForward]);

  const handleMouseLeave = useCallback(() => { hoveredRef.current = false; }, []);

  return (
    <div
      className="w-[40vw] cursor-pointer"
      style={{ aspectRatio: "96/48" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={logoData}
        autoplay
        loop={false}
        onComplete={handleComplete}
        style={{
          width:  "100%",
          height: "100%",
          filter: isDark ? undefined : "invert(1)",
          transition: "filter 0.3s ease",
        }}
      />
    </div>
  );
}

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="flex flex-col w-full h-dvh justify-between overflow-hidden relative">

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        viewport={{ once: true, margin: "-100px" }}
        className="section-container max-w-none pt-14"
      >
        <h2 className="type-h2 text-right">
          YOU REACHED THE FOOTER.<br />
          WHEN WILL YOU REACH ME?
        </h2>
      </motion.div>

      {/* Rectangle decoration — bottom right */}
      <img
        src="/rectangle.svg"
        aria-hidden
        className="theme-icon"
        style={{
          position:      "absolute",
          bottom:        0,
          right:         0,
          pointerEvents: "none",
        }}
      />

      {/* Rectangle-1 decoration — full width bottom */}
      <img
        src="/rectangle-1.svg"
        aria-hidden
        className="theme-icon"
        style={{
          position:      "absolute",
          bottom:        0,
          left:          0,
          width:         "100%",
          height:        "auto",
          pointerEvents: "none",
        }}
      />

      {/* Full-width logo animation */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="section-container max-w-none pb-2 md:pb-8 lg:pb-14"
      >
        <FooterLogo isDark={theme === "dark"} />
      </motion.div>

    </footer>
  );
}
