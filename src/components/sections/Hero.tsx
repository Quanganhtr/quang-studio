"use client";

import { motion, useMotionValue, useAnimationFrame, useAnimation, useSpring } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, useMemo } from "react";

// ── Constants ────────────────────────────────────────────────────────────────

const mobileItems = [
  { text: "ARCHITECT BY ROOTS."         },
  { text: "PRODUCT DESIGNER BY CHOICE." },
  { text: "VIBE-CODER BY FORCE."        },
  { text: "QUANG ANH TRAN"              },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DESKTOP_GAP = "0.65lh";
const MOBILE_GAP  = "0.2lh";

function sr(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// ── Scatter target computation ────────────────────────────────────────────────
// Jittered grid: creates ~1.4× more cells than letters so coprime assignment
// produces a visually random yet evenly-spread layout with no clusters.

function computeScatterTargets(count: number, w: number, h: number): Map<number, { tx: number; ty: number }> {
  const PAD   = 56;
  const W     = w - PAD * 2;
  const H     = h - PAD * 2;
  const aspect = W / H;
  const cols  = Math.max(5, Math.round(Math.sqrt(count * aspect)));
  const rows  = Math.max(4, Math.ceil(count / cols));
  const cellW = W / cols;
  const cellH = H / rows;
  const total = cols * rows;

  const used   = new Set<number>();
  const result = new Map<number, { tx: number; ty: number }>();

  for (let seed = 0; seed < count; seed++) {
    // Coprime walk — 37 and 7 are coprime with most grid sizes
    let cell = (seed * 37) % total;
    let walk = 0;
    while (used.has(cell) && walk < total) { cell = (cell + 7) % total; walk++; }
    used.add(cell);

    const col = cell % cols;
    const row = Math.floor(cell / cols);
    const jx  = (sr(seed * 7.3  + 1.1) - 0.5) * cellW * 0.2;
    const jy  = (sr(seed * 13.7 + 2.3) - 0.5) * cellH * 0.2;

    result.set(seed, {
      tx: PAD + (col + 0.5) * cellW + jx,
      ty: PAD + (row + 0.5) * cellH + jy,
    });
  }
  return result;
}

// ── Contexts ──────────────────────────────────────────────────────────────────

const SectionCtx  = createContext<React.RefObject<HTMLElement | null>>({ current: null });
const MousePosCtx = createContext<{ current: { x: number; y: number } }>({ current: { x: -9999, y: -9999 } });
const TargetCtx   = createContext<Map<number, { tx: number; ty: number }>>(new Map());

// ── Single dancing character ──────────────────────────────────────────────────

function DancingChar({ char, seed, playing }: { char: string; seed: number; playing: boolean }) {
  const sectionRef  = useContext(SectionCtx);
  const mousePosRef = useContext(MousePosCtx);
  const targets     = useContext(TargetCtx);
  const charRef     = useRef<HTMLSpanElement>(null);
  const controls    = useAnimation();
  const playingRef  = useRef(playing);
  useEffect(() => { playingRef.current = playing; });

  const v = useMemo(() => {
    const r = (n: number) => sr(seed * 11.3 + n * 7.1);
    return {
      sRot:   (r(2) - 0.5) * 220,
      sDur:   1.8 + r(3) * 1.4,
      sDel:   r(4) * 1.0,
      driftX: (r(5) - 0.5) * 110,
      driftY: (r(6) - 0.5) * 110,
      dRot:   (r(7) - 0.5) * 80,
      dDur:   1.2 + r(8) * 1.0,
    };
  }, [seed]);

  // ── Cursor repulsion — spring on the inner element ──────────────────────────
  const rawPushX  = useMotionValue(0);
  const rawPushY  = useMotionValue(0);
  const rawScale  = useMotionValue(1);
  const pushX     = useSpring(rawPushX,  { stiffness: 160, damping: 20 });
  const pushY     = useSpring(rawPushY,  { stiffness: 160, damping: 20 });
  const pushScale = useSpring(rawScale,  { stiffness: 220, damping: 18 });

  // Runs every frame; uses scatter target position (no per-frame DOM read)
  useAnimationFrame(() => {
    if (!playing) return;
    const target  = targets.get(seed);
    const section = sectionRef.current;
    if (!target || !section) return;

    const sRect  = section.getBoundingClientRect();
    const lx     = sRect.left + target.tx;
    const ly     = sRect.top  + target.ty;
    const { x: mx, y: my } = mousePosRef.current;
    const dx     = mx - lx;
    const dy     = my - ly;
    const dist   = Math.hypot(dx, dy);
    const RADIUS = 220;

    if (dist < RADIUS && dist > 1) {
      const t        = 1 - dist / RADIUS;
      const strength = t * t * 180;
      rawPushX.set(-dx / dist * strength);
      rawPushY.set(-dy / dist * strength);
      rawScale.set(1 + t * 1.5);
    } else {
      rawPushX.set(0);
      rawPushY.set(0);
      rawScale.set(1);
    }
  });

  // ── Scatter / return animation ───────────────────────────────────────────────
  useEffect(() => {
    const { sRot, sDur, sDel, driftX, driftY, dRot, dDur } = v;

    if (!playing) {
      rawPushX.set(0); rawPushY.set(0); rawScale.set(1);
      controls.stop();
      controls.start({ x: 0, y: 0, rotate: 0,
        transition: { duration: 0.7, ease: "easeInOut" } });
      return;
    }

    const section = sectionRef.current;
    const el      = charRef.current;
    const target  = targets.get(seed);
    if (!section || !el || !target) return;

    const sRect = section.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const tx    = sRect.left + target.tx - (eRect.left + eRect.width  / 2);
    const ty    = sRect.top  + target.ty - (eRect.top  + eRect.height / 2);

    // Stagger starts via setTimeout so all 80 don't hit the same JS frame
    const timer = setTimeout(() => {
      if (!playingRef.current) return;
      controls.start({
        x: tx, y: ty, rotate: sRot,
        transition: { duration: sDur, ease: "easeInOut" },
      }).then(() => {
        if (!playingRef.current) return;
        controls.start({
          x:      [tx, tx + driftX, tx - driftX * 0.7, tx],
          y:      [ty, ty + driftY, ty - driftY * 0.8, ty],
          rotate: [sRot, sRot + dRot, sRot - dRot * 0.6, sRot],
          transition: { duration: dDur, repeat: Infinity, ease: "easeInOut" },
        });
      });
    }, sDel * 1000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <motion.span ref={charRef} animate={controls} style={{ display: "inline-block", whiteSpace: "pre" }}>
      <motion.span style={{ display: "inline-block", x: pushX, y: pushY, scale: pushScale }}>
        {char}
      </motion.span>
    </motion.span>
  );
}

function DancingText({ text, charOffset = 0, playing }: { text: string; charOffset?: number; playing: boolean }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <DancingChar key={i} char={char} seed={charOffset + i} playing={playing} />
      ))}
    </>
  );
}

// ── Disc — dances to the center of the section ───────────────────────────────

function DancingDisc({ playing, children }: { playing: boolean; children: React.ReactNode }) {
  const sectionRef = useContext(SectionCtx);
  const discRef    = useRef<HTMLDivElement>(null);
  const controls   = useAnimation();
  const playingRef = useRef(playing);
  useEffect(() => { playingRef.current = playing; });

  const v = useMemo(() => {
    const r = (n: number) => sr(999 * 13.7 + n * 9.3);
    return {
      tx: 0.5, ty: 0.5,
      sRot:   (r(2) - 0.5) * 60,
      sDur:   1.5,
      driftX: (r(3) - 0.5) * 40,
      driftY: (r(4) - 0.5) * 40,
      dRot:   (r(5) - 0.5) * 30,
      dDur:   3.5,
    };
  }, []);

  useEffect(() => {
    const { tx, ty, sRot, sDur, driftX, driftY, dRot, dDur } = v;

    if (!playing) {
      controls.stop();
      controls.start({ x: 0, y: 0, rotate: 0,
        transition: { duration: 0.6, delay: 1.05, ease: EASE } });
      return;
    }

    const section = sectionRef.current;
    const el      = discRef.current;
    if (!section || !el) return;

    const sRect = section.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const dx    = sRect.left + sRect.width  * tx - (eRect.left + eRect.width  / 2);
    const dy    = sRect.top  + sRect.height * ty - (eRect.top  + eRect.height / 2);

    controls.start({
      x: dx, y: dy, rotate: sRot,
      transition: { duration: sDur, ease: "easeInOut" },
    }).then(() => {
      if (!playingRef.current) return;
      controls.start({
        x:      [dx, dx + driftX, dx - driftX * 0.8, dx],
        y:      [dy, dy + driftY, dy - driftY * 0.7, dy],
        rotate: [sRot, sRot + dRot, sRot - dRot, sRot],
        transition: { duration: dDur, repeat: Infinity, ease: "easeInOut" },
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <motion.div ref={discRef} animate={controls} style={{ display: "inline-flex", alignSelf: "center" }}>
      {children}
    </motion.div>
  );
}

// ── Breakpoint hook ──────────────────────────────────────────────────────────

function useBreakpoint() {
  const getQuery = (token: string) => {
    const bp = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
    return `(min-width: ${bp})`;
  };
  const [isTablet,  setIsTablet]  = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mqMd = window.matchMedia(getQuery("--breakpoint-md"));
    const mqLg = window.matchMedia(getQuery("--breakpoint-lg"));
    setIsTablet(mqMd.matches);
    setIsDesktop(mqLg.matches);
    const onMd = (e: MediaQueryListEvent) => setIsTablet(e.matches);
    const onLg = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mqMd.addEventListener("change", onMd);
    mqLg.addEventListener("change", onLg);
    return () => {
      mqMd.removeEventListener("change", onMd);
      mqLg.removeEventListener("change", onLg);
    };
  }, []);

  return { isTablet, isDesktop };
}

// ── TextColumn ───────────────────────────────────────────────────────────────

function TextColumn({
  items,
  align = "left",
  mobile = false,
  playing = false,
  charOffset = 0,
}: {
  items: { text: string }[];
  align?: "left" | "right";
  mobile?: boolean;
  playing?: boolean;
  charOffset?: number;
}) {
  const gap = mobile ? MOBILE_GAP : DESKTOP_GAP;
  let offset = charOffset;

  return (
    <div
      className="type-h1"
      style={{ display: "flex", flexDirection: "column", textAlign: align, paddingBlock: "0.15em" }}
    >
      {items.map(({ text }, i) => {
        const currentOffset = offset;
        offset += text.length;
        const isLast    = i === items.length - 1;
        const marginTop = i === 0 ? undefined : mobile && isLast ? "56px" : gap;
        return (
          <span
            key={i}
            style={{
              display:    "block",
              whiteSpace: mobile ? "normal" : "nowrap",
              color:      "var(--foreground)",
              visibility: text ? "visible" : "hidden",
              marginTop,
            }}
          >
            {text
              ? <DancingText text={text} charOffset={currentOffset} playing={playing} />
              : " "}
          </span>
        );
      })}
    </div>
  );
}

// ── Disc button ───────────────────────────────────────────────────────────────

function DiscButton({ onToggle }: { onToggle: (isPlaying: boolean) => void }) {
  const rotate      = useMotionValue(0);
  const speed       = useRef(0.4);
  const targetSpeed = useRef(0.4);
  const audio       = useRef<HTMLAudioElement | null>(null);
  const playing     = useRef(false);

  useEffect(() => {
    audio.current = new Audio("/theme-song.mp3");
    audio.current.loop = true;
    return () => { audio.current?.pause(); };
  }, []);

  useAnimationFrame(() => {
    speed.current += (targetSpeed.current - speed.current) * 0.06;
    rotate.set(rotate.get() + speed.current);
  });

  const handleClick = () => {
    if (!audio.current) return;
    if (playing.current) {
      audio.current.pause();
      playing.current = false;
    } else {
      audio.current.play();
      playing.current = true;
    }
    onToggle(playing.current);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => { targetSpeed.current = 4; }}
      onMouseLeave={() => { targetSpeed.current = 0.4; }}
      className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-transparent bg-foreground text-background h-8 md:h-12 px-3 md:px-5 text-base-bold outline-none transition-colors duration-200 overflow-hidden hover:bg-foreground hover:text-background"
    >
      <motion.img src="/disc.png" alt="" style={{ width: 24, height: 24, rotate, flexShrink: 0 }} />
      <span>Let's dance</span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { isTablet, isDesktop } = useBreakpoint();
  const [playing, setPlaying]   = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const mousePosRef = useRef({ x: -9999, y: -9999 });
  const playingRef  = useRef(false);
  const [scatterTargets, setScatterTargets] = useState<Map<number, { tx: number; ty: number }>>(new Map());

  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      if (playingRef.current) return;            // don't disrupt mid-flight
      const { width, height } = el.getBoundingClientRect();
      if (width < 200 || height < 200) return;   // ignore degenerate layout states
      setScatterTargets(computeScatterTargets(80, width, height));
    });
    observer.observe(el);

    const onMouse = (e: MouseEvent) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMouse);
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const desktopLines = [
    { text: "ARCHITECT BY ROOTS.",        offset: 0  },
    { text: "PRODUCT DESIGNER BY CHOICE.", offset: 19 },
    { text: "VIBE-CODER BY FORCE.",        offset: 46 },
  ];
  const nameOffset = 66;

  return (
    <SectionCtx.Provider value={sectionRef}>
      <MousePosCtx.Provider value={mousePosRef}>
        <TargetCtx.Provider value={scatterTargets}>
          <section
            ref={sectionRef}
            className={`flex flex-col overflow-hidden${isTablet ? " flex-1" : ""}`}
            style={{ justifyContent: "center", padding: "var(--section-padding)" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="type-h1 w-full flex flex-col items-center"
              style={{ gap: DESKTOP_GAP, textAlign: "center" }}
            >
              {isDesktop ? (
                <>
                  {desktopLines.map(({ text, offset }) => (
                    <span key={offset} style={{ display: "block", whiteSpace: "nowrap", color: "var(--foreground)" }}>
                      <DancingText text={text} charOffset={offset} playing={playing} />
                    </span>
                  ))}
                  <DancingDisc playing={playing}>
                    <DiscButton onToggle={setPlaying} />
                  </DancingDisc>
                  <span style={{ display: "block", whiteSpace: "nowrap", color: "var(--foreground)" }}>
                    <DancingText text="QUANG ANH TRAN" charOffset={nameOffset} playing={playing} />
                  </span>
                </>
              ) : (
                <TextColumn items={mobileItems} align="left" mobile playing={playing} charOffset={0} />
              )}
            </motion.div>
          </section>
        </TargetCtx.Provider>
      </MousePosCtx.Provider>
    </SectionCtx.Provider>
  );
}
