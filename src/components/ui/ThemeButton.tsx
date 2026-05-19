"use client";

import { useRef, useCallback, useEffect } from "react";
import Lottie from "lottie-react";
import themeData from "../../../public/theme.json";

interface ThemeButtonProps {
  isDark: boolean;
  onToggle: () => void;
}

const PILL_TEXT_DARK  = "WHEN THE LIGHT\nHAS COME";
const PILL_TEXT_LIGHT = "AND THE LAND\nIS DARK";

export default function ThemeButton({ isDark, onToggle }: ThemeButtonProps) {
  const lottieRef    = useRef<any>(null);
  const isDarkRef    = useRef(isDark);
  const isHoverRef   = useRef(false);
  const clickedRef   = useRef(false);
  isDarkRef.current  = isDark;

  const handleDOMLoaded = useCallback(() => {
    lottieRef.current?.goToAndStop(isDark ? 23 : 0, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(() => {
    clickedRef.current = true;
    const anim = lottieRef.current;
    if (anim && window.matchMedia("(pointer: coarse)").matches) {
      anim.setSpeed(3);
      if (!isDarkRef.current) {
        anim.setDirection(1);
        anim.goToAndPlay(0, true);
      } else {
        anim.setDirection(-1);
        anim.goToAndPlay(23, true);
      }
    }
    onToggle();
  }, [onToggle]);

  const handleMouseEnter = useCallback(() => {
    isHoverRef.current = true;
    clickedRef.current = false;
    const anim = lottieRef.current;
    if (anim) {
      anim.setSpeed(3);
      if (!isDarkRef.current) {
        anim.setDirection(1);
        anim.goToAndPlay(0, true);
      } else {
        anim.setDirection(-1);
        anim.goToAndPlay(23, true);
      }
    }
    const text = isDarkRef.current ? PILL_TEXT_DARK : PILL_TEXT_LIGHT;
    window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text } }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHoverRef.current = false;
    if (!clickedRef.current) {
      // Reverse back to the resting icon
      const anim = lottieRef.current;
      if (anim) {
        anim.setDirection(isDarkRef.current ? 1 : -1);
        anim.play();
      }
    }
    clickedRef.current = false;
    window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }));
  }, []);

  // Re-dispatch updated pill text when theme changes while still hovering
  useEffect(() => {
    if (!isHoverRef.current) return;
    const text = isDark ? PILL_TEXT_DARK : PILL_TEXT_LIGHT;
    window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text } }));
  }, [isDark]);

  // CSS-driven invert — no React hover state, so filter and bg-color transition fire together.
  // Light: invert(1) by default → group-hover removes it (button turns dark, icon stays white)
  // Dark:  no invert by default → group-hover adds it  (button turns light, icon turns dark)
  const iconClass = isDark
    ? "group-hover:[filter:invert(1)]"
    : "[filter:invert(1)] group-hover:[filter:invert(0)]";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-8 w-8 md:h-12 md:w-12 flex items-center justify-center cursor-pointer rounded-none border border-border bg-background hover:bg-foreground group"
    >
      <div
        className={`w-5 h-5 transition-[filter] duration-150 ${iconClass}`}
        style={{ pointerEvents: "none" }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={themeData}
          autoplay={false}
          loop={false}
          onDOMLoaded={handleDOMLoaded}
          style={{ width: 20, height: 20 }}
        />
      </div>
    </button>
  );
}
