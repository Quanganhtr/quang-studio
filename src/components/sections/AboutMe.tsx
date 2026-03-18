"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";

export default function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale   = useTransform(scrollYProgress, [0, 0.75], [3.0, 1],  { ease: easeOut });
  const x       = useTransform(scrollYProgress, [0, 0.75], [2000, 0], { ease: easeOut });
  const y       = useTransform(scrollYProgress, [0, 0.75], [-60, 0],  { ease: easeOut });
  const rotate  = useTransform(scrollYProgress, [0, 0.75], [-25, 0],  { ease: easeOut });
  const rotateY = useTransform(scrollYProgress, [0, 0.75], [50, 0],   { ease: easeOut });
  const rotateX = useTransform(scrollYProgress, [0, 0.75], [30, 0],   { ease: easeOut });
  const skewX   = useTransform(scrollYProgress, [0, 0.75], [14, 0],   { ease: easeOut });

  return (
    <section
      ref={sectionRef}
      style={{ height: "200dvh", position: "relative" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          perspective: "600px",
        }}
      >
        {/* Headline — stays behind */}
        <motion.h2
          className="label-h2 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ position: "absolute" }}
        >
          WHO KNEW MY CAREER
          <br />
          WOULD TAKE A PLOT TWIST?
        </motion.h2>

        {/* About me letter — flies in */}
        <motion.div
          style={{
            scale,
            x,
            y,
            rotate,
            rotateY,
            rotateX,
            skewX,
            position: "relative",
            zIndex: 10,
            width: "30%",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Triangle sequence — top */}
          <div
            className="theme-icon"
            style={{
              width: "100%",
              height: 8,
              backgroundImage: "url('/Triangle.svg')",
              backgroundRepeat: "repeat-x",
              backgroundSize: "16px 8px",
            }}
          />

          {/* Card */}
          <div
            style={{
              width: "100%",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "var(--foreground)",
              borderRadius: 0,
            }}
          >
            <span className="label-sm" style={{ color: "var(--background)" }}>
              ABOUT ME
            </span>

            <p className="body-text" style={{ color: "var(--background)" }}>
              I completed my studies at Hanoi Architectural University with the intention of pursuing a career as an architect. However, I ended up starting my professional journey as a product designer. While the nature of the job is distinct, I find that I apply a significant amount of the knowledge acquired during my university education to my current role.
            </p>

            <p className="body-text" style={{ color: "var(--background)" }}>
              Ultimately, my mission remains nearly the same - prioritizing understanding and meeting the needs of our users, ensuring that my designs not only reflect aesthetic considerations but also deliver an impeccable user experience.
            </p>
          </div>

          {/* Triangle sequence — bottom, flipped */}
          <div
            className="theme-icon"
            style={{
              width: "100%",
              height: 8,
              backgroundImage: "url('/Triangle.svg')",
              backgroundRepeat: "repeat-x",
              backgroundSize: "16px 8px",
              transform: "scaleY(-1)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
