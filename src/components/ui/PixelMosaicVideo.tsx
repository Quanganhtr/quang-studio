"use client";

import { useEffect, useRef } from "react";

// ⚙️ SETTINGS
const DESKTOP_BLOCK = 72;
const PHONE_BLOCK = 40;
const RADIUS = 3;
const SCROLL_RADIUS = 1;
const LIFE = 1800;
const MOBILE_LIFE = 1000;

export default function PixelMosaicVideo({ video }: { video: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;

    // Setup video element (once)
    if (!videoRef.current) {
      const v = document.createElement("video");
      v.loop = true;
      v.muted = true;
      v.setAttribute("muted", "");
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.autoplay = true;
      v.crossOrigin = "anonymous";
      videoRef.current = v;
    }

    const vid = videoRef.current;

    if (video && vid.src !== new URL(video, location.href).href) {
      vid.src = video;
      vid.load();
      vid.play().catch((e) => console.log("Autoplay error:", e));
    }

    const squares: { x: number; y: number; color: string; time: number; life: number }[] = [];
    let drawDims = { x: 0, y: 0, w: 0, h: 0 };
    let currentBlockSize = DESKTOP_BLOCK;
    let isMobile = false;
    let lastMouseX: number | null = null;
    let lastMouseY: number | null = null;
    let cachedRect = canvas.getBoundingClientRect();
    let isVisible = false;
    let rafId: number;

    const resize = () => {
      if (!vid.videoWidth) return;

      isMobile = window.innerWidth < 800;
      currentBlockSize = isMobile ? PHONE_BLOCK : DESKTOP_BLOCK;

      const dpr = window.devicePixelRatio || 1;
      cachedRect = canvas.getBoundingClientRect();
      if (cachedRect.width === 0) return;

      canvas.width = cachedRect.width * dpr;
      canvas.height = cachedRect.height * dpr;
      ctx.scale(dpr, dpr);

      offscreen.width = cachedRect.width;
      offscreen.height = cachedRect.height;

      const scale = Math.max(
        cachedRect.width / vid.videoWidth,
        cachedRect.height / vid.videoHeight
      );
      const w = vid.videoWidth * scale;
      const h = vid.videoHeight * scale;
      const x = (cachedRect.width - w) / 2;
      const y = (cachedRect.height - h) / 2;

      drawDims = { x, y, w, h };
    };

    vid.addEventListener("loadedmetadata", resize);
    window.addEventListener("resize", resize);
    if (vid.readyState >= 1) resize();

    const getColor = (x: number, y: number) => {
      try {
        const pixel = offCtx.getImageData(x, y, 1, 1).data;
        return `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      } catch {
        return "rgba(0,0,0,0)";
      }
    };

    const spawnPixels = (cx: number, cy: number, customSpread: number | null = null) => {
      const gx = Math.floor(cx / currentBlockSize) * currentBlockSize;
      const gy = Math.floor(cy / currentBlockSize) * currentBlockSize;
      const spread = customSpread !== null ? customSpread : isMobile ? 1 : RADIUS;

      for (let x = -spread; x <= spread; x++) {
        for (let y = -spread; y <= spread; y++) {
          if (x * x + y * y > spread * spread) continue;
          const px = gx + x * currentBlockSize;
          const py = gy + y * currentBlockSize;
          if (Math.random() > 0.5) continue;
          squares.push({
            x: px,
            y: py,
            color: getColor(px, py),
            time: Date.now(),
            life: isMobile ? MOBILE_LIFE : LIFE,
          });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isMobile) return;
      const currentX = e.offsetX;
      const currentY = e.offsetY;

      if (lastMouseX === null) {
        lastMouseX = currentX;
        lastMouseY = currentY;
      }

      const dist = Math.hypot(currentX - lastMouseX, currentY - lastMouseY!);
      const stepSize = currentBlockSize / 2;
      const steps = Math.ceil(dist / stepSize);

      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const lerpX = lastMouseX + (currentX - lastMouseX) * t;
        const lerpY = lastMouseY! + (currentY - lastMouseY!) * t;
        spawnPixels(lerpX, lerpY);
      }

      spawnPixels(currentX, currentY);
      lastMouseX = currentX;
      lastMouseY = currentY;
    };

    const onMouseLeave = () => {
      lastMouseX = null;
      lastMouseY = null;
    };

    let lastSpawnY = 0;

    const onScroll = () => {
      if (!isVisible) return;
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastSpawnY);
      const threshold = isMobile ? 5 : 20;
      if (delta < threshold) return;
      if (!isMobile && Math.random() > 0.7) return;

      const scanLineY = window.innerHeight / 2 - cachedRect.top;

      if (scanLineY > -100 && scanLineY < drawDims.h + 100) {
        lastSpawnY = currentScroll;
        const spreadSize = isMobile ? 1 : SCROLL_RADIUS;
        for (let i = 0; i < 2; i++) {
          spawnPixels(Math.random() * drawDims.w, scanLineY, spreadSize);
        }
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, cachedRect.width, cachedRect.height);

      if (vid.readyState >= 2) {
        // Update offscreen with current video frame for color sampling
        offCtx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight, drawDims.x, drawDims.y, drawDims.w, drawDims.h);

        // Draw video frame to main canvas
        ctx.drawImage(vid, 0, 0, vid.videoWidth, vid.videoHeight, drawDims.x, drawDims.y, drawDims.w, drawDims.h);
      }

      const now = Date.now();

      for (let i = squares.length - 1; i >= 0; i--) {
        const s = squares[i];
        const age = now - s.time;

        if (age > s.life) {
          squares.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = 1 - age / s.life;
        ctx.fillStyle = s.color;
        ctx.fillRect(s.x, s.y, currentBlockSize, currentBlockSize);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
          cachedRect = canvas.getBoundingClientRect();
          vid.play().catch(() => {});
          rafId = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      vid.removeEventListener("loadedmetadata", resize);
    };
  }, [video]);

  return (
    <canvas ref={canvasRef} className="block w-full h-full" />
  );
}
