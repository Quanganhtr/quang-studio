"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";

const KNIFE_FRAMES: string[] = Array.from({ length: 30 }, (_, i) =>
  `/images-sequence/knife/${String(i + 1).padStart(4, "0")}.png`
);

const PENCIL_FRAMES: string[] = Array.from({ length: 30 }, (_, i) =>
  `/images-sequence/Pencil/${String(i + 1).padStart(4, "0")}.png`
);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function AboutMe() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const knifeCanvasRef = useRef<HTMLCanvasElement>(null);
  const knifeImagesRef = useRef<HTMLImageElement[]>([]);
  const pencilCanvasRef = useRef<HTMLCanvasElement>(null);
  const pencilImagesRef = useRef<HTMLImageElement[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Letter transforms (from right)
  const scale        = useTransform(scrollYProgress, [0, 0.75], [3.0, 1],  { ease: easeOut });
  const x            = useTransform(scrollYProgress, [0, 0.75], [2000, 0], { ease: easeOut });
  const y            = useTransform(scrollYProgress, [0, 0.75], [-60, 0],  { ease: easeOut });
  const rotateDesk   = useTransform(scrollYProgress, [0, 0.75], [-25, -2], { ease: easeOut });
  const rotateMob    = useTransform(scrollYProgress, [0, 0.75], [-25, 0],  { ease: easeOut });
  const rotateYDesk  = useTransform(scrollYProgress, [0, 0.75], [60, 2],   { ease: easeOut });
  const rotateYMob   = useTransform(scrollYProgress, [0, 0.75], [60, 0],   { ease: easeOut });
  const rotateX      = useTransform(scrollYProgress, [0, 0.75], [30, 0],   { ease: easeOut });
  const skewX        = useTransform(scrollYProgress, [0, 0.75], [14, 0],   { ease: easeOut });
  const rotate  = isMobile ? rotateMob  : rotateDesk;
  const rotateY = isMobile ? rotateYMob : rotateYDesk;

  // Knife transforms (from left, slightly delayed)
  const knifeScale  = useTransform(scrollYProgress, [0.15, 0.8], [5.0, isMobile ? 1.0 : 1.5], { ease: easeOut });
  const knifeXDesk  = useTransform(scrollYProgress, [0.15, 0.8], [-1500, -300], { ease: easeOut });
  const knifeXMob   = useTransform(scrollYProgress, [0.15, 0.8], [-1500, 50],  { ease: easeOut });
  const knifeYDesk  = useTransform(scrollYProgress, [0.15, 0.8], [800, -150],   { ease: easeOut });
  const knifeYMob   = useTransform(scrollYProgress, [0.15, 0.8], [800, -240],    { ease: easeOut });
  const knifeRotate = useTransform(scrollYProgress, [0.15, 0.8], [200, 0],       { ease: easeOut });
  const knifeX = isMobile ? knifeXMob : knifeXDesk;
  const knifeY = isMobile ? knifeYMob : knifeYDesk;

  // Pencil transforms (from right, slightly delayed)
  const pencilScale  = useTransform(scrollYProgress, [0.15, 0.8], [5.0, isMobile ? 1.0 : 1.5], { ease: easeOut });
  const pencilXDesk  = useTransform(scrollYProgress, [0.15, 0.8], [1000, 500],  { ease: easeOut });
  const pencilXMob   = useTransform(scrollYProgress, [0.15, 0.8], [1000, -90],   { ease: easeOut });
  const pencilYDesk  = useTransform(scrollYProgress, [0.15, 0.8], [1500, 150],  { ease: easeOut });
  const pencilYMob   = useTransform(scrollYProgress, [0.15, 0.8], [800, 240],   { ease: easeOut });
  const pencilRotate = useTransform(scrollYProgress, [0.15, 0.8], [-200, 0],    { ease: easeOut });
  const pencilX = isMobile ? pencilXMob : pencilXDesk;
  const pencilY = isMobile ? pencilYMob : pencilYDesk;

  const knifePlayingRef  = useRef(false);
  const pencilPlayingRef = useRef(false);

  const playAnimation = (
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    imagesRef: React.RefObject<HTMLImageElement[]>,
    playingRef: React.RefObject<boolean>
  ) => {
    if (playingRef.current) return;
    playingRef.current = true;

    const progress = scrollYProgress.get();
    const startFrame = Math.min(Math.floor(Math.max(0, (progress - 0.5) / 0.5) * 30), 29);

    const FPS = 24;
    const frameTime = 1000 / FPS;
    let frame = startFrame;
    let dir = -1;
    let last = 0;

    const tick = (now: number) => {
      if (now - last >= frameTime) {
        drawFrame(canvasRef.current, imagesRef.current, frame);
        frame += dir;
        if (frame < 0) { frame = 0; dir = 1; }
        else if (frame > startFrame) {
          drawFrame(canvasRef.current, imagesRef.current, startFrame);
          playingRef.current = false;
          return;
        }
        last = now;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const drawFrame = (canvas: HTMLCanvasElement | null, images: HTMLImageElement[], index: number) => {
    if (!canvas || !images[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images[index], 0, 0, canvas.width, canvas.height);
    } catch {
      // image not yet loaded or broken — skip frame
    }
  };

  // Preload knife frames
  useEffect(() => {
    knifeImagesRef.current = KNIFE_FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    knifeImagesRef.current[0].onload = () => drawFrame(knifeCanvasRef.current, knifeImagesRef.current, 0);
  }, []);

  // Preload pencil frames
  useEffect(() => {
    pencilImagesRef.current = PENCIL_FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    pencilImagesRef.current[0].onload = () => drawFrame(pencilCanvasRef.current, pencilImagesRef.current, 0);
  }, []);

  // Scrub frames on scroll
  useEffect(() => {
    return scrollYProgress.on("change", (progress) => {
      const start = 0.5;
      const clamped = Math.max(0, (progress - start) / (1 - start));
      const index = Math.min(Math.floor(clamped * 30), 29);
      if (!knifePlayingRef.current)  drawFrame(knifeCanvasRef.current, knifeImagesRef.current, index);
      if (!pencilPlayingRef.current) drawFrame(pencilCanvasRef.current, pencilImagesRef.current, index);
    });
  }, [scrollYProgress]);

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
          perspective: "600px",
          padding: isMobile ? "0 8px" : 0,
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

        {/* About me letter — flies in from right */}
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
            width: isMobile ? "100%" : "30%",
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

        {/* Knife animation — flies in from left, slightly after letter */}
        <motion.canvas
          ref={knifeCanvasRef}
          width={800}
          height={800}
          onClick={() => playAnimation(knifeCanvasRef, knifeImagesRef, knifePlayingRef)}
          style={{
            scale: knifeScale,
            x: knifeX,
            y: knifeY,
            rotate: knifeRotate,
            position: "absolute",
            width: isMobile ? "56vw" : "min(28vw, 320px)",
            height: "auto",
            zIndex: 9,
          }}
        />

        {/* Pencil animation — same transforms as knife */}
        <motion.canvas
          ref={pencilCanvasRef}
          width={800}
          height={800}
          onClick={() => playAnimation(pencilCanvasRef, pencilImagesRef, pencilPlayingRef)}
          style={{
            scale: pencilScale,
            x: pencilX,
            y: pencilY,
            rotate: pencilRotate,
            position: "absolute",
            width: isMobile ? "56vw" : "min(28vw, 320px)",
            height: "auto",
            zIndex: 9,
          }}
        />
      </div>
    </section>
  );
}
