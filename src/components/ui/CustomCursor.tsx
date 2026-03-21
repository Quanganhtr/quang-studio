"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useTheme } from "@/lib/ThemeContext";
import lightAnimation from "../../../public/Light-Loading.json";
import darkAnimation from "../../../public/Dark-Loading.json";

export default function CustomCursor() {
  const { theme } = useTheme();
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const opacity = useMotionValue(0);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX + 16);
      y.set(e.clientY + 16);
      opacity.set(1);
      document.body.classList.add("custom-cursor-active");
    };
    const hide = () => opacity.set(0);
    const show = () => opacity.set(1);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [x, y, opacity]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x,
        y,
        translateX: "-50%",
        width: 32,
        height: 32,
        pointerEvents: "none",
        zIndex: 99999,
        opacity,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={theme === "dark" ? darkAnimation : lightAnimation}
        loop
        autoplay
      />
    </motion.div>
  );
}
