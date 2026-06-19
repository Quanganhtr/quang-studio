"use client";

import { motion, useMotionValue, useAnimationFrame, useAnimation, useSpring } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, useMemo, Fragment } from "react";

// ── Constants ────────────────────────────────────────────────────────────────


const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const DESKTOP_GAP = "0.85lh";


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
const DesktopCtx  = createContext(false);

// ── Single dancing character ──────────────────────────────────────────────────

function DancingChar({ char, seed, playing }: { char: string; seed: number; playing: boolean }) {
  const sectionRef  = useContext(SectionCtx);
  const mousePosRef = useContext(MousePosCtx);
  const targets     = useContext(TargetCtx);
  const isDesktop   = useContext(DesktopCtx);
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
    if (!isDesktop) return;
    if (!playing) {
      rawPushX.set(0);
      rawPushY.set(0);
      rawScale.set(1);
      return;
    }
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
        if (!playingRef.current || !isDesktop) return;
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
  const words = text.split(" ");
  let off = charOffset;
  return (
    <>
      {words.map((word, wi) => {
        const wordStart = off;
        off += word.length;
        const spaceStart = off;
        const hasSpace = wi < words.length - 1;
        if (hasSpace) off += 1;
        return (
          <Fragment key={wi}>
            <span style={{ whiteSpace: "nowrap" }}>
              {word.split("").map((char, ci) => (
                <DancingChar key={ci} char={char} seed={wordStart + ci} playing={playing} />
              ))}
            </span>
            {hasSpace && <DancingChar char=" " seed={spaceStart} playing={playing} />}
          </Fragment>
        );
      })}
    </>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { isTablet, isDesktop } = useBreakpoint();
  const [playing, setPlaying]   = useState(false);
  const sectionRef   = useRef<HTMLElement>(null);
  const mousePosRef  = useRef({ x: -9999, y: -9999 });
  const playingRef   = useRef(false);
  const isTabletRef  = useRef(isTablet);
  useEffect(() => { isTabletRef.current = isTablet; }, [isTablet]);
  const isDesktopRef = useRef(isDesktop);
  useEffect(() => { isDesktopRef.current = isDesktop; }, [isDesktop]);
  const audioRef       = useRef<HTMLAudioElement | null>(null);
  const followerRef    = useRef<HTMLDivElement>(null);
  const followerImgRef = useRef<HTMLImageElement>(null);
  const followerRafRef = useRef(0);
  const targetX        = useRef(0);
  const targetY        = useRef(0);
  const [scatterTargets, setScatterTargets] = useState<Map<number, { tx: number; ty: number }>>(new Map());

  useEffect(() => { playingRef.current = playing; }, [playing]);

  useEffect(() => {
    audioRef.current = new Audio("/theme-song.mp3");
    audioRef.current.loop = true;
    return () => { audioRef.current?.pause(); };
  }, []);

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

    const updateTarget = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      targetX.current = Math.max(0, Math.min(rect.width,  clientX - rect.left));
      targetY.current = Math.max(0, Math.min(rect.height, clientY - rect.top));
    };
    const onMouse = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      updateTarget(e.clientX, e.clientY);
    };
    const onScroll = () => {
      const { x, y } = mousePosRef.current;
      if (x !== 0 || y !== 0) updateTarget(x, y);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // RAF loop — position lerp + velocity-driven 3D tilt (max ±24deg)
  useEffect(() => {
    const LERP           = 0.1;
    const VEL_LERP       = 0.14;
    const MAX_DEG        = 56;
    const FACTOR         = 2;
    const STRETCH_FACTOR = 0.01;
    const MAX_STRETCH    = 0.2;

    const rect = sectionRef.current?.getBoundingClientRect();
    const initX = rect ? rect.width  / 2 : 0;
    const initY = rect ? rect.height / 2 : 0;
    targetX.current = initX;
    targetY.current = initY;

    let curX = initX, curY = initY;
    let prevTX = initX, prevTY = initY;
    let velX = 0, velY = 0;

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    const tick = () => {
      velX += (targetX.current - prevTX - velX) * VEL_LERP;
      velY += (targetY.current - prevTY - velY) * VEL_LERP;
      prevTX = targetX.current;
      prevTY = targetY.current;

      // rotateX: up = +24, down = -24 | rotateY: right = +24, left = -24
      const rotX = clamp(-velY * FACTOR, -MAX_DEG, MAX_DEG);
      const rotY = clamp( velX * FACTOR, -MAX_DEG, MAX_DEG);

      curX += (targetX.current - curX) * LERP;
      curY += (targetY.current - curY) * LERP;

      // Clamp so the full image (+ 8px offset) never escapes the section bounds
      const secW = sectionRef.current?.offsetWidth  ?? 9999;
      const secH = sectionRef.current?.offsetHeight ?? 9999;
      const imgW = followerImgRef.current?.offsetWidth  ?? 0;
      const imgH = followerImgRef.current?.offsetHeight ?? 0;
      curX = Math.max(imgW / 2, Math.min(secW - imgW / 2, curX));
      curY = Math.max(imgH / 2, Math.min(secH - imgH / 2, curY));

      const speed   = Math.sqrt(velX * velX + velY * velY);
      const stretch = Math.min(speed * STRETCH_FACTOR, MAX_STRETCH);
      const nx      = speed > 0 ? velX / speed : 0;
      const ny      = speed > 0 ? velY / speed : 0;
      const scaleX  = 1 + Math.abs(nx) * stretch - Math.abs(ny) * stretch * 0.4;
      const scaleY  = 1 + Math.abs(ny) * stretch - Math.abs(nx) * stretch * 0.4;

      if (isDesktopRef.current) {
        if (followerRef.current) {
          followerRef.current.style.transform = `translate(${curX}px, ${curY}px)`;
        }
        if (followerImgRef.current) {
          followerImgRef.current.style.transform =
            `translate(calc(-50% + 24px), calc(-50% - 24px)) perspective(280px) rotateX(${rotX}deg) rotateY(${rotY}deg) scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)})`;
        }
      }

      followerRafRef.current = requestAnimationFrame(tick);
    };

    followerRafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(followerRafRef.current);
  }, []);

  const renderSpray = (text: string, startOff: number, maxBlur = 10, minBlur = 0) => {
    const n = text.length;
    const words = text.split(" ");
    let ci = 0;
    return words.map((word, wi) => {
      const wordStart = ci;
      ci += word.length;
      const spaceIdx = ci;
      const hasSpace = wi < words.length - 1;
      if (hasSpace) ci += 1;
      return (
        <Fragment key={wi}>
          <span style={{ whiteSpace: "nowrap", display: "inline" }}>
            {word.split("").map((char, k) => {
              const j = wordStart + k;
              return (
                <span key={k} style={{ display: "inline-block", filter: `blur(${(minBlur + (j / (n - 1)) * (maxBlur - minBlur)).toFixed(1)}px)` }}>
                  <DancingChar char={char} seed={startOff + j} playing={playing} />
                </span>
              );
            })}
          </span>
          {hasSpace && (
            <span style={{ display: "inline-block", filter: `blur(${(minBlur + (spaceIdx / (n - 1)) * (maxBlur - minBlur)).toFixed(1)}px)` }}>
              <DancingChar char=" " seed={startOff + spaceIdx} playing={playing} />
            </span>
          )}
        </Fragment>
      );
    });
  };

  const handleToggle = () => {
    if (!audioRef.current) return;
    const next = !playing;
    if (next) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
    setPlaying(next);
  };

  const nameOffset = 66;

  return (
    <SectionCtx.Provider value={sectionRef}>
      <MousePosCtx.Provider value={mousePosRef}>
        <DesktopCtx.Provider value={isDesktop}>
        <TargetCtx.Provider value={scatterTargets}>
          <section
            ref={sectionRef}
            onClick={isDesktop ? handleToggle : undefined}
            className={`flex flex-col overflow-hidden${isTablet ? " flex-1" : ""}`}
            style={{
              position: "relative",
              justifyContent: isDesktop ? "center" : "flex-start",
              paddingTop: isDesktop ? "var(--section-padding)" : isTablet ? 112 : 72,
              paddingRight: "var(--section-padding)",
              paddingBottom: "var(--section-padding)",
              paddingLeft: "var(--section-padding)",
              minHeight: isDesktop ? "100dvh" : !isTablet ? "100svh" : undefined,
            }}
          >
            {/* SVG filter — spray paint stencil for "BY __." words */}
            <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
              <defs>
                <filter id="hero-spray" x="-20%" y="-40%" width="140%" height="180%" colorInterpolationFilters="sRGB">
                  {/* Grain applied to already-blurred SourceGraphic (blur is CSS per-char) */}
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" result="noise" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 -2" in="noise" result="dots" />
                  <feComposite in="SourceGraphic" in2="dots" operator="in" />
                </filter>
              </defs>
            </svg>

            {/* Cursor follower image — desktop only */}
            {isDesktop && (
              <div
                ref={followerRef}
                className="pointer-events-none absolute z-10"
                style={{ top: 0, left: 0, transform: "translate(0px, 0px)" }}
              >
                <img
                  ref={followerImgRef}
                  src={playing ? "/end.png" : "/play.png"}
                  alt=""
                  style={{ display: "block", transform: "translate(-50%, -50%)" }}
                />
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className={`type-h1 w-full flex flex-col ${isDesktop ? "items-center" : "items-start"}`}
              style={{ gap: isDesktop ? DESKTOP_GAP : 24, textAlign: isDesktop ? "center" : "left" }}
            >
              {isDesktop ? (
                <>
                  {([
                    { prefix: "ARCHITECT ",        prefixOff: 0,  sprayText: "BY ROOTS.",  sprayOff: 10 },
                    { prefix: "PRODUCT DESIGNER ", prefixOff: 19, sprayText: "BY CHOICE.", sprayOff: 36 },
                    { prefix: "VIBE-CODER ",       prefixOff: 46, sprayText: "BY FORCE.",  sprayOff: 57 },
                  ] as const).map(({ prefix, prefixOff, sprayText, sprayOff }, li) => (
                    <span key={li} style={{ display: "block", whiteSpace: "nowrap" }}>
                      <span style={{ color: "var(--foreground)" }}>
                        <DancingText text={prefix} charOffset={prefixOff} playing={playing} />
                      </span>
                      <span style={{ color: "var(--foreground)", filter: "url(#hero-spray)" }}>
                        {renderSpray(sprayText, sprayOff, 10, 1)}
                      </span>
                    </span>
                  ))}
                  <span style={{ display: "block", whiteSpace: "nowrap" }}>
                    <span style={{ color: "var(--foreground)" }}>
                      <DancingText text="QUANG " charOffset={nameOffset} playing={playing} />
                    </span>
                    <span style={{ color: "var(--foreground)", filter: "url(#hero-spray)" }}>
                      {renderSpray("ANH TRAN", nameOffset + 6, 10, 1)}
                    </span>
                  </span>
                </>
              ) : (
                <>
                  {[
                    { prefix: "ARCHITECT ",        prefixOff: 0,  sprayText: "BY ROOTS.",  sprayOff: 10 },
                    { prefix: "PRODUCT DESIGNER ", prefixOff: 19, sprayText: "BY CHOICE.", sprayOff: 36 },
                    { prefix: "VIBE-CODER ",       prefixOff: 46, sprayText: "BY FORCE.",  sprayOff: 57 },
                    { prefix: "QUANG ",            prefixOff: 66, sprayText: "ANH TRAN",   sprayOff: 72 },
                  ].map(({ prefix, prefixOff, sprayText, sprayOff }, i) => (
                    <span key={i} style={{ display: "block", whiteSpace: "normal", color: "var(--foreground)" }}>
                      <DancingText text={prefix} charOffset={prefixOff} playing={playing} />
                      <span style={{ filter: "url(#hero-spray)" }}>
                        {renderSpray(sprayText, sprayOff, 4)}
                      </span>
                    </span>
                  ))}
                </>
              )}
            </motion.div>
          </section>
        </TargetCtx.Provider>
        </DesktopCtx.Provider>
      </MousePosCtx.Provider>
    </SectionCtx.Provider>
  );
}
