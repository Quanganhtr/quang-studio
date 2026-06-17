"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, easeOut, type MotionValue } from "framer-motion";

const KNIFE_FRAMES: string[] = Array.from({ length: 30 }, (_, i) =>
  `/images-sequence/knife/${String(i + 1).padStart(4, "0")}.webp`
);

const PENCIL_FRAMES: string[] = Array.from({ length: 30 }, (_, i) =>
  `/images-sequence/pencil-chalk/${String(i + 1).padStart(4, "0")}.webp`
);

const CUP_FRAMES: string[] = Array.from({ length: 30 }, (_, i) =>
  `/images-sequence/cup-chalk/${String(i + 1).padStart(4, "0")}.webp`
);

const SPRAY_FRAMES: string[] = Array.from({ length: 30 }, (_, i) =>
  `/images-sequence/paint-bucket-chalk/${String(i + 1).padStart(4, "0")}.webp`
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
  const isMobileRef = useRef(false);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  const sectionRef = useRef<HTMLElement>(null);
  const knifeCanvasRef  = useRef<HTMLCanvasElement>(null);
  const knifeImagesRef  = useRef<HTMLImageElement[]>([]);
  const pencilCanvasRef = useRef<HTMLCanvasElement>(null);
  const pencilImagesRef = useRef<HTMLImageElement[]>([]);
  const cupCanvasRef    = useRef<HTMLCanvasElement>(null);
  const cupImagesRef    = useRef<HTMLImageElement[]>([]);
  const sprayCanvasRef  = useRef<HTMLCanvasElement>(null);
  const sprayImagesRef  = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: isMobile ? ["start end", "end start"] : ["start start", "end end"],
  });

  // Letter transforms
  const scale       = useTransform(scrollYProgress, [0, 0.75], [3.0, 1],  { ease: easeOut });
  const x           = useTransform(scrollYProgress, [0, 0.75], [2000, 0], { ease: easeOut });
  const y           = useTransform(scrollYProgress, [0, 0.75], [-60, 0],  { ease: easeOut });
  const rotateDesk  = useTransform(scrollYProgress, [0, 0.75], [-25, -2], { ease: easeOut });
  const rotateMob   = useTransform(scrollYProgress, [0, 0.75], [-25, 0],  { ease: easeOut });
  const rotateYDesk = useTransform(scrollYProgress, [0, 0.75], [60, 2],   { ease: easeOut });
  const rotateYMob  = useTransform(scrollYProgress, [0, 0.75], [60, 0],   { ease: easeOut });
  const rotateX     = useTransform(scrollYProgress, [0, 0.75], [30, 0],   { ease: easeOut });
  const skewX       = useTransform(scrollYProgress, [0, 0.75], [14, 0],   { ease: easeOut });
  const rotate  = isMobile ? rotateMob  : rotateDesk;
  const rotateY = isMobile ? rotateYMob : rotateYDesk;

  // Canvas transforms
  const knifeScale  = useTransform(scrollYProgress, [0.15, 0.8], [5.0, 2.0],    { ease: easeOut });
  const knifeXDesk  = useTransform(scrollYProgress, [0.15, 0.8], [-1500, -300], { ease: easeOut });
  const knifeXMob   = useTransform(scrollYProgress, [0.15, 0.8], [-1500, 50],   { ease: easeOut });
  const knifeYDesk  = useTransform(scrollYProgress, [0.15, 0.8], [800, -150],   { ease: easeOut });
  const knifeYMob   = useTransform(scrollYProgress, [0.15, 0.8], [800, -240],   { ease: easeOut });
  const knifeRotate = useTransform(scrollYProgress, [0.15, 0.8], [200, 0],      { ease: easeOut });
  const knifeX = isMobile ? knifeXMob : knifeXDesk;
  const knifeY = isMobile ? knifeYMob : knifeYDesk;

  const pencilScale  = useTransform(scrollYProgress, [0.15, 0.8], [5.0, 2.0],  { ease: easeOut });
  const pencilXDesk  = useTransform(scrollYProgress, [0.15, 0.8], [1000, 500], { ease: easeOut });
  const pencilXMob   = useTransform(scrollYProgress, [0.15, 0.8], [1000, -90], { ease: easeOut });
  const pencilYDesk  = useTransform(scrollYProgress, [0.15, 0.8], [1500, 150], { ease: easeOut });
  const pencilYMob   = useTransform(scrollYProgress, [0.15, 0.8], [800, 240],  { ease: easeOut });
  const pencilRotate = useTransform(scrollYProgress, [0.15, 0.8], [-200, 0],   { ease: easeOut });
  const pencilX = isMobile ? pencilXMob : pencilXDesk;
  const pencilY = isMobile ? pencilYMob : pencilYDesk;

  const cupScale  = useTransform(scrollYProgress, [0.15, 0.8], [5.0, 2.0],   { ease: easeOut });
  const cupXDesk  = useTransform(scrollYProgress, [0.15, 0.8], [0, -100],    { ease: easeOut });
  const cupXMob   = useTransform(scrollYProgress, [0.15, 0.8], [800, 90],    { ease: easeOut });
  const cupYDesk  = useTransform(scrollYProgress, [0.15, 0.8], [-1500, 240], { ease: easeOut });
  const cupYMob   = useTransform(scrollYProgress, [0.15, 0.8], [-800, 240],  { ease: easeOut });
  const cupRotate = useTransform(scrollYProgress, [0.15, 0.8], [200, 0],     { ease: easeOut });
  const cupX = isMobile ? cupXMob : cupXDesk;
  const cupY = isMobile ? cupYMob : cupYDesk;

  const sprayScale  = useTransform(scrollYProgress, [0.15, 0.8], [5.0, 2.0],   { ease: easeOut });
  const sprayXDesk  = useTransform(scrollYProgress, [0.15, 0.8], [0, 300],     { ease: easeOut });
  const sprayXMob   = useTransform(scrollYProgress, [0.15, 0.8], [-1000, -90], { ease: easeOut });
  const sprayYDesk  = useTransform(scrollYProgress, [0.15, 0.8], [1500, -240], { ease: easeOut });
  const sprayYMob   = useTransform(scrollYProgress, [0.15, 0.8], [-800, 240],  { ease: easeOut });
  const sprayRotate = useTransform(scrollYProgress, [0.15, 0.8], [-200, 0],    { ease: easeOut });
  const sprayX = isMobile ? sprayXMob : sprayXDesk;
  const sprayY = isMobile ? sprayYMob : sprayYDesk;

  const knifePlayingRef  = useRef(false);
  const pencilPlayingRef = useRef(false);
  const cupPlayingRef    = useRef(false);
  const sprayPlayingRef  = useRef(false);

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

  useEffect(() => {
    const size = isMobile ? 480 : 960;
    [knifeCanvasRef, pencilCanvasRef, cupCanvasRef, sprayCanvasRef].forEach((ref) => {
      if (ref.current) ref.current.width = ref.current.height = size;
    });
  }, [isMobile]);

  useEffect(() => {
    knifeImagesRef.current = KNIFE_FRAMES.map((src) => { const img = new Image(); img.src = src; return img; });
    knifeImagesRef.current[0].onload = () => drawFrame(knifeCanvasRef.current, knifeImagesRef.current, 0);
  }, []);

  useEffect(() => {
    pencilImagesRef.current = PENCIL_FRAMES.map((src) => { const img = new Image(); img.src = src; return img; });
    pencilImagesRef.current[0].onload = () => drawFrame(pencilCanvasRef.current, pencilImagesRef.current, 0);
  }, []);

  useEffect(() => {
    cupImagesRef.current = CUP_FRAMES.map((src) => { const img = new Image(); img.src = src; return img; });
    cupImagesRef.current[0].onload = () => drawFrame(cupCanvasRef.current, cupImagesRef.current, 0);
  }, []);

  useEffect(() => {
    sprayImagesRef.current = SPRAY_FRAMES.map((src) => { const img = new Image(); img.src = src; return img; });
    sprayImagesRef.current[0].onload = () => drawFrame(sprayCanvasRef.current, sprayImagesRef.current, 0);
  }, []);

  // Scrub frames on scroll — full range on mobile, second half on desktop
  useEffect(() => {
    const unsub = scrollYProgress.on("change", () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const progress = scrollYProgress.get();
        const clamped = isMobileRef.current
          ? Math.min(Math.max(0, progress), 1)
          : Math.min(Math.max(0, (progress - 0.5) / 0.5), 1);
        const index = Math.min(Math.floor(clamped * 30), 29);
        if (!knifePlayingRef.current)  drawFrame(knifeCanvasRef.current, knifeImagesRef.current, index);
        if (!pencilPlayingRef.current) drawFrame(pencilCanvasRef.current, pencilImagesRef.current, index);
        if (!cupPlayingRef.current)    drawFrame(cupCanvasRef.current, cupImagesRef.current, index);
        if (!sprayPlayingRef.current)  drawFrame(sprayCanvasRef.current, sprayImagesRef.current, index);
      });
    });
    return () => {
      unsub();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress]);

  useEffect(() => {
    const knifeEl  = knifeCanvasRef.current;
    const pencilEl = pencilCanvasRef.current;
    const cupEl    = cupCanvasRef.current;
    const sprayEl  = sprayCanvasRef.current;
    if (!knifeEl || !pencilEl || !cupEl || !sprayEl) return;

    const playKnife  = () => playAnimation(knifeCanvasRef,  knifeImagesRef,  knifePlayingRef);
    const playPencil = () => playAnimation(pencilCanvasRef, pencilImagesRef, pencilPlayingRef);
    const playCup    = () => playAnimation(cupCanvasRef,    cupImagesRef,    cupPlayingRef);
    const playSpray  = () => playAnimation(sprayCanvasRef,  sprayImagesRef,  sprayPlayingRef);

    const eventType = isMobile ? "click" : "mouseenter";
    knifeEl.addEventListener(eventType,  playKnife);
    pencilEl.addEventListener(eventType, playPencil);
    cupEl.addEventListener(eventType,    playCup);
    sprayEl.addEventListener(eventType,  playSpray);
    return () => {
      knifeEl.removeEventListener(eventType,  playKnife);
      pencilEl.removeEventListener(eventType, playPencil);
      cupEl.removeEventListener(eventType,    playCup);
      sprayEl.removeEventListener(eventType,  playSpray);
    };
  }, [isMobile]);

  // Desktop canvas style — position: absolute at top-left, x/y transforms do all positioning
  const canvasStyle = (cScale: MotionValue<number>, cX: MotionValue<number>, cY: MotionValue<number>, cRotate: MotionValue<number>) => ({
    scale:    cScale,
    x:        cX,
    y:        cY,
    rotate:   cRotate,
    position: "absolute" as const,
    width:    "min(28vw, 320px)" as const,
    height:   "auto" as const,
    zIndex:   9,
    filter:   "drop-shadow(8px 4px 1px rgba(0,0,0,0.004))",
  });

  const letterCardContent = (
    <>
      <div
        className="theme-icon"
        style={{ width: "100%", height: 8, backgroundImage: "url('/Triangle.svg')", backgroundRepeat: "repeat-x", backgroundSize: "16px 8px" }}
      />
      <div className="w-full p-6 flex flex-col gap-4 bg-foreground rounded-none">
        <span className="text-base-bold text-background">ABOUT ME</span>
        <p className="text-base-regular text-background">
          I completed my studies at Hanoi Architectural University with the intention of pursuing a career as an architect. However, I ended up starting my professional journey as a product designer. While the nature of the job is distinct, I find that I apply a significant amount of the knowledge acquired during my university education to my current role.
        </p>
        <p className="text-base-regular text-background">
          Ultimately, my mission remains nearly the same - prioritizing understanding and meeting the needs of our users, ensuring that my designs not only reflect aesthetic considerations but also deliver an impeccable user experience.
        </p>
      </div>
      <div
        className="theme-icon"
        style={{ width: "100%", height: 8, backgroundImage: "url('/Triangle.svg')", backgroundRepeat: "repeat-x", backgroundSize: "16px 8px", transform: "scaleY(-1)" }}
      />
    </>
  );

  // ── Mobile layout ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <section ref={sectionRef} className="relative flex flex-col items-center pt-39 pb-0">
        <motion.h2
          className="type-h2 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ position: "relative", zIndex: 10, paddingInline: "8px" }}
        >
          WHO KNEW<br />MY CAREER<br />WOULD TAKE<br />A PLOT TWIST?
        </motion.h2>

        {/* Canvas grid — scaled 2x, randomly rotated, overlapping */}
        <div style={{ position: "relative", width: "calc(100% - 16px)", height: "60vw", marginTop: 80 }}>
          <canvas ref={knifeCanvasRef}  width={960} height={960} style={{ position: "absolute", width: "55%", height: "auto", top: "5%", left: "-20%",  transform: "rotate(-15deg)", filter: "drop-shadow(4px 6px 10px rgba(0,0,0,0.18))", zIndex: 4 }} />
          <canvas ref={pencilCanvasRef} width={960} height={960} style={{ position: "absolute", width: "55%", height: "auto", top: "5%", right: "-20%", transform: "rotate(12deg)",  filter: "drop-shadow(4px 6px 10px rgba(0,0,0,0.18))", zIndex: 3 }} />
          <canvas ref={cupCanvasRef}    width={960} height={960} style={{ position: "absolute", width: "55%", height: "auto", top: "5%", left: "10%",   transform: "rotate(-6deg)",  filter: "drop-shadow(4px 6px 10px rgba(0,0,0,0.18))", zIndex: 2 }} />
          <canvas ref={sprayCanvasRef}  width={960} height={960} style={{ position: "absolute", width: "55%", height: "auto", top: "5%", right: "8%",   transform: "rotate(20deg)",  filter: "drop-shadow(4px 6px 10px rgba(0,0,0,0.18))", zIndex: 1 }} />
        </div>

        {/* About me letter — static */}
        <div
          style={{
            position:      "relative",
            zIndex:        10,
            width:         "calc(100% - 16px)",
            marginTop:     80,
            display:       "flex",
            flexDirection: "column",
            gap:           0,
          }}
        >
          {letterCardContent}
        </div>
      </section>
    );
  }

  // ── Desktop layout — exact original scroll-driven animation ────────────────
  return (
    <section
      ref={sectionRef}
      className="relative h-[calc(var(--app-height)*2)]"
    >
      <div
        className="app-sticky-screen overflow-hidden flex items-center justify-center"
        style={{ perspective: "600px" }}
      >
        {/* Headline — absolutely positioned, stays behind */}
        <motion.h2
          className="type-h2 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          viewport={{ once: true, margin: "-100px" }}
          style={{ position: "absolute" }}
        >
          WHO KNEW MY CAREER<br />WOULD TAKE A PLOT TWIST?
        </motion.h2>

        {/* About me letter — in-flow, centered by flex, flies in from right */}
        <motion.div
          style={{
            scale,
            x,
            y,
            rotate,
            rotateY,
            rotateX,
            skewX,
            position:      "relative",
            zIndex:        10,
            width:         "30%",
            display:       "flex",
            flexDirection: "column",
            gap:           0,
          }}
        >
          {letterCardContent}
        </motion.div>

        {/* Canvases — position: absolute at top-left, x/y transforms position them */}
        <motion.canvas ref={knifeCanvasRef}  width={960} height={960} style={canvasStyle(knifeScale,  knifeX,  knifeY,  knifeRotate)}  />
        <motion.canvas ref={pencilCanvasRef} width={960} height={960} style={canvasStyle(pencilScale, pencilX, pencilY, pencilRotate)} />
        <motion.canvas ref={cupCanvasRef}    width={960} height={960} style={canvasStyle(cupScale,    cupX,    cupY,    cupRotate)}    />
        <motion.canvas ref={sprayCanvasRef}  width={960} height={960} style={canvasStyle(sprayScale,  sprayX,  sprayY,  sprayRotate)}  />
      </div>
    </section>
  );
}
