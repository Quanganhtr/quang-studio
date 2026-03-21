"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface FloatingLabelProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  floatOffset?: number;
  floatDuration?: number;
  floatDelay?: number;
}

function FloatingLabel({
  src,
  alt,
  width = 120,
  height = 60,
  style,
  floatOffset = 10,
  floatDuration = 3,
  floatDelay = 0,
}: FloatingLabelProps) {
  return (
    <div
      style={{
        position: "absolute",
        animationName: "floatUpDown",
        animationDuration: `${floatDuration}s`,
        animationDelay: `${floatDelay}ms`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
        ["--float-offset" as string]: `${floatOffset}px`,
        ...style,
      }}
    >
      <Image src={src} alt={alt} width={width} height={height} className="theme-icon" />
    </div>
  );
}

export default function MyWork() {
  return (
    <section style={{ display: "flex", flexDirection: "column" }}>
      {/* 100dvh title container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
          zIndex: 0,
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <FloatingLabel
            src="/Cool.svg" alt="Cool"
            style={{ top: "-60%", left: "-30%", transform: "rotate(-32deg)" }}
            floatOffset={12} floatDuration={3.2} floatDelay={0}
          />
          <FloatingLabel
            src="/Looks.svg" alt="looks"
            style={{ top: "-100%", right: "-20%", transform: "rotate(6deg)" }}
            floatOffset={10} floatDuration={2.8} floatDelay={400}
          />
          <FloatingLabel
            src="/Nice.svg" alt="Nice!"
            style={{ bottom: "-150%", left: "20%", transform: "rotate(-5deg)" }}
            floatOffset={14} floatDuration={3.6} floatDelay={200}
          />
          <FloatingLabel
            src="/Good.svg" alt="Good"
            style={{ bottom: "-150%", right: "-20%", transform: "rotate(7deg)" }}
            floatOffset={8} floatDuration={3.0} floatDelay={600}
          />

          <h2 className="label-h2 text-center">
            MY CTRL+Z LIFE
          </h2>
        </div>
      </motion.div>

      {/* Studio image */}
      <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <Image
          src="/Studio BG.png"
          alt="Studio"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </section>
  );
}
