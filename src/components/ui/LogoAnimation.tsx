"use client";

import Lottie from "lottie-react";
import { useRef, useCallback } from "react";
import logoData from "../../../public/logo.json";

interface LogoAnimationProps {
  isDark: boolean;
  menuOpen: boolean;
}

export default function LogoAnimation({ isDark, menuOpen }: LogoAnimationProps) {
  const lottieRef  = useRef<any>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseRef   = useRef<"forward" | "backward">("forward");
  const hoveredRef = useRef(false);

  const shouldInvert = (!isDark && !menuOpen) || (isDark && menuOpen);

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
        if (hoveredRef.current) {
          // still hovered — replay immediately
          playForward();
        } else {
          phaseRef.current = "forward";
          anim.setDirection(1);
          anim.goToAndPlay(0, true);
        }
      }, 10000);
    }
  }, [playForward]);

  const handleMouseEnter = useCallback(() => {
    hoveredRef.current = true;
    const anim = lottieRef.current;
    if (!anim) return;
    // Only restart if idle (backward cycle done, waiting for next)
    if (phaseRef.current === "backward" && timerRef.current) {
      playForward();
    }
  }, [playForward]);

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = false;
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-8 md:h-12 cursor-pointer"
      style={{ aspectRatio: "96/48" }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={logoData}
        autoplay
        loop={false}
        onComplete={handleComplete}
        style={{
          width:      "100%",
          height:     "100%",
          filter:     shouldInvert ? "invert(1)" : undefined,
          transition: "filter 0.3s ease",
        }}
      />
    </div>
  );
}
