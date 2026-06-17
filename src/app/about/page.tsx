"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const AVATAR_FRAMES = Array.from({ length: 48 }, (_, i) =>
  `/images-sequence/avatar/${String(i).padStart(3, "0")}.png`
);

// ─── PROJECT PILLS ───────────────────────────────────────────────────────────

interface Project {
  label: string;
  image: string;
}

const ARCH_PROJECTS: Project[] = [
  { label: "Rehab Camp", image: "/images/arch-rehab-camp.jpg" },
  { label: "Museum",     image: "/images/arch-museum.jpg"     },
  { label: "Hotel",      image: "/hotel.png"                   },
];

const PILL_STYLES = [
  { bg: "bg-foreground", text: "text-background"         },
  { bg: "bg-primary",    text: "text-primary-foreground" },
  { bg: "bg-muted",      text: "text-primary-foreground" },
];

const PILL_ROTATIONS  = [-4, 3, -2];
const IMAGE_ROTATIONS = [8, -8, 8];

interface ProjectPillProps extends Project {
  index:        number;
  onHoverStart: () => void;
  onHoverEnd:   () => void;
}

function ProjectPill({ label, index, onHoverStart, onHoverEnd }: ProjectPillProps) {
  const { bg, text } = PILL_STYLES[index % PILL_STYLES.length];
  const rotation     = PILL_ROTATIONS[index % PILL_ROTATIONS.length];
  return (
    <span
      className="relative inline-flex"
      style={{ marginLeft: index === 0 ? 0 : 4, zIndex: index + 1 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <motion.span
        className={`inline-flex items-center select-none ${bg} ${text}`}
        style={{ paddingInline: 12, paddingBlock: 2, fontFamily: "var(--font-mono)", fontSize: "inherit", fontWeight: 600, lineHeight: "inherit", rotate: rotation }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        {label}
      </motion.span>
    </span>
  );
}

// ─── SECTION CONTENT ─────────────────────────────────────────────────────────

function OriginStorySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="flex flex-col"
      >
        <div className="flex flex-col" style={{ gap: 32 }}>
          {[
            "Before I became a product designer, I was supposed to become an architect. It wasn't a dramatic “I was born to be” story. It was more personal than that.",
            "My dad really wanted to become an architect. But life did what life usually does: opened too many tabs, crashed the system, and that dream never fully happened for him.",
            null,
            "Then in my 3rd year, something unexpected happened. I got my first UI/UX design job with salary of 1.5 million VND ($60) per month. A very small number. But somehow, it became a very big turning point.",
          ].map((para, i) =>
            para === null ? (
              <motion.p
                key="pills"
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
                className="text-lg-regular text-muted-foreground"
                style={{ lineHeight: 1.85 }}
              >
                So I decided to carry his dream and studied architecture at <span style={{ fontWeight: 600 }}>Hanoi Architectural University</span>. Partly for myself, partly for him. For a while, it looked like the plan was working. I designed{" "}
                <span className="inline-flex items-center">
                  {ARCH_PROJECTS.map((p, pi) => (
                    <ProjectPill
                      key={p.label}
                      {...p}
                      index={pi}
                      onHoverStart={() => setHoveredIndex(pi)}
                      onHoverEnd={() => setHoveredIndex(null)}
                    />
                  ))}
                </span>
                {" "}...
              </motion.p>
            ) : (
              <motion.p
                key={i}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
                className="text-lg-regular text-muted-foreground"
                style={{ lineHeight: 1.85 }}
              >
                {para}
              </motion.p>
            )
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {hoveredIndex !== null && (
          <motion.div
            key={hoveredIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ right: 156, rotate: IMAGE_ROTATIONS[hoveredIndex] }}
          >
            <div className="overflow-hidden bg-card" style={{ width: "22vw", height: "22vw", border: "2px solid var(--foreground)" }}>
              <img
                src={ARCH_PROJECTS[hoveredIndex].image}
                alt={ARCH_PROJECTS[hoveredIndex].label}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const HOW_I_SURVIVE_PARAGRAPHS = [
  "Somehow, that $60/month job didn't scare me off. It taught me. I learned Figma by Googling, shipped things by guessing, and presented designs to stakeholders while quietly hoping nobody would ask too many questions.",
  "I left architecture school without finishing the blueprint. But I walked into product design with something most designers don't have: five years of thinking about how people move through space, how structures hold weight, and why a bad layout makes people feel lost before they even realize it.",
  "Now I work as a product designer. I obsess over spacing, argue about 4px versus 8px, and occasionally explain to a developer why \"just move it a little to the left\" is a real design decision. The usual. It's not the career my dad dreamed of. But it's the one that somehow kept finding me — and at some point, I stopped running from it.",
];

function HowISurviveSection() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      className="flex flex-col"
    >
      <div className="flex flex-col" style={{ gap: 32 }}>
        {HOW_I_SURVIVE_PARAGRAPHS.map((para, i) => (
          <motion.p
            key={i}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
            className="text-lg-regular text-muted-foreground"
            style={{ lineHeight: 1.85 }}
          >
            {para}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

const ARCH_HAUNTS_PARAGRAPHS = [
  "The funny thing is, I never really left architecture. I just changed materials.",
  "Before, I designed with walls, doors, rooms, and circulation for users who got lost even when the exit sign was glowing. Now, I design buttons, cards, flows, states for users who definitely did not read the tooltip.",
  "Architecture taught me to think about space. Product design taught me to think about digital space. Both are about helping people move from one point to another without feeling lost, confused, or personally attacked by the layout.",
  "Maybe my dad's dream didn't disappear. It just got a different type of blueprint.",
];

function ArchHauntsSection() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      className="flex flex-col"
    >
      <div className="flex flex-col" style={{ gap: 32 }}>
        {ARCH_HAUNTS_PARAGRAPHS.map((para, i) => (
          <motion.p
            key={i}
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } } }}
            className="text-lg-regular text-muted-foreground"
            style={{ lineHeight: 1.85 }}
          >
            {para}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

// ─── STRETCH COLUMN ───────────────────────────────────────────────────────────

interface StretchColumnProps {
  title:      string;
  decorType:  "cross" | "ellipse";
  className?: string;
  children:   React.ReactNode;
}

function StretchColumn({ title, decorType, className = "", children }: StretchColumnProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [triggerStart, setTriggerStart] = useState(99999);
  const [triggerEnd,   setTriggerEnd]   = useState(99999);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollY } = useScroll();

  useLayoutEffect(() => {
    const measure = () => {
      const titleEl   = titleRef.current;
      const wrapperEl = wrapperRef.current;
      if (!titleEl || !wrapperEl) return;
      const titleBottomDoc = titleEl.getBoundingClientRect().bottom + window.scrollY;
      const start    = titleBottomDoc - window.innerHeight;
      const colWidth = wrapperEl.offsetWidth;
      setTriggerStart(Math.max(0, start));
      setTriggerEnd(Math.max(0, start) + colWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const decorH = useTransform(scrollY, [triggerStart, triggerEnd], [0, triggerEnd - triggerStart], { clamp: true });

  const decorSvg = decorType === "cross" ? (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full text-border">
      <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
    </svg>
  ) : (
    <svg className="absolute inset-0 w-full h-full text-border">
      <ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" />
    </svg>
  );

  return (
    <div ref={wrapperRef} className={`flex flex-col ${className}`}>
      <div ref={titleRef} className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
        <h3 className="type-h3">{title}</h3>
      </div>
      {/* content: naturally second in source, pushed after decor on md+ */}
      <div className="px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16 md:order-3">
        {children}
      </div>
      {/* decor: naturally third in source, pulled to second slot on md+ */}
      <motion.div
        style={isDesktop ? { height: decorH } : { height: 156 }}
        className="relative overflow-hidden border-t md:border-t-0 md:border-b border-ui md:order-2"
      >
        {decorSvg}
      </motion.div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const imagesRef  = useRef<HTMLImageElement[]>([]);
  const rafRef     = useRef<number | null>(null);

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start 50%", "end 50%"] });
  const heroY = useTransform(heroP, [0, 1], ["12%", "-12%"]);

  const drawCover = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = cw / scale, sh = ch / scale;
    const sx = (iw - sw) / 2, sy = (ih - sh) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  };

  useEffect(() => {
    imagesRef.current = AVATAR_FRAMES.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    imagesRef.current[0].onload = () => drawCover(imagesRef.current[0]);
  }, []);

  // Resize canvas to match container and redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const p = Math.max(0, Math.min(1, heroP.get()));
      const i = Math.min(Math.floor(p * AVATAR_FRAMES.length), AVATAR_FRAMES.length - 1);
      drawCover(imagesRef.current[i]);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [heroP]);

  useEffect(() => {
    const unsub = heroP.on("change", () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const p = Math.max(0, Math.min(1, heroP.get()));
        const i = Math.min(Math.floor(p * AVATAR_FRAMES.length), AVATAR_FRAMES.length - 1);
        drawCover(imagesRef.current[i]);
      });
    });
    return () => {
      unsub();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [heroP]);

  return (
    <>
      <Navbar />
      <main>

        {/* ── Title ─────────────────────────────────────────────────────── */}
        <section className="section-container max-w-none pt-40 md:pt-80 lg:pt-120 pb-8 md:pb-12 px-2 md:px-8 lg:px-14 border-b border-ui">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="type-h2"
          >
            <span className="text-accent-foreground">{"A personal README file about "}</span>
            {"a designer "}
            <span className="text-accent-foreground">{"who carried his dad's "}</span>
            {"architect dream"}
            <span className="text-accent-foreground">{", then accidentally ended up with a "}</span>
            {"F"}<s>{"oor"}</s>{"igma Plan "}
            <span className="text-accent-foreground">{"— $15/month."}</span>
          </motion.h2>
        </section>

        {/* ── Hero image ───────────────────────────────────────────────── */}
        <div ref={heroRef} className="relative overflow-hidden" style={{ height: "100dvh" }}>
          <motion.div style={{ y: heroY, scale: 1.25 }} className="absolute inset-0 max-md:-translate-x-12">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </motion.div>
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-t border-b border-ui p-0 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-12">

            <StretchColumn
              title="My origin story"
              decorType="cross"
              className="md:col-span-4 border-b border-ui md:border-b-0 md:border-r"
            >
              <OriginStorySection />
            </StretchColumn>

            <StretchColumn
              title="How I survive now"
              decorType="ellipse"
              className="md:col-span-4 border-b border-ui md:border-b-0 md:border-r"
            >
              <HowISurviveSection />
            </StretchColumn>

            <StretchColumn
              title="Architecture still haunts me"
              decorType="cross"
              className="md:col-span-4"
            >
              <ArchHauntsSection />
            </StretchColumn>

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
