"use client";

import { useEffect, useRef } from "react";

// ⚙️ SETTINGS
const DESKTOP_BLOCK = 72;
const PHONE_BLOCK = 40;
const RADIUS = 3;
const SCROLL_RADIUS = 1;
const LIFE = 1800;
const MOBILE_LIFE = 1000;


export default function PixelMosaicScroll({ image }: { image: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageCanvas = document.createElement("canvas");
    const imageCtx = imageCanvas.getContext("2d");

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = image;

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
      if (!img.naturalWidth) return;

      isMobile = window.innerWidth < 800;
      currentBlockSize = isMobile ? PHONE_BLOCK : DESKTOP_BLOCK;

      const dpr = window.devicePixelRatio || 1;
      cachedRect = canvas.getBoundingClientRect();

      canvas.width = cachedRect.width * dpr;
      canvas.height = cachedRect.height * dpr;
      ctx.scale(dpr, dpr);

      imageCanvas.width = cachedRect.width;
      imageCanvas.height = cachedRect.height;

      const scale = Math.max(
        cachedRect.width / img.naturalWidth,
        cachedRect.height / img.naturalHeight
      );

      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const x = (cachedRect.width - w) / 2;
      const y = (cachedRect.height - h) / 2;

      drawDims = { x, y, w, h };

      imageCtx!.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
      imageCtx!.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, w, h);
    };

    img.onload = resize;
    window.addEventListener("resize", resize);
    if (img.complete) resize();

    const getColor = (x: number, y: number) => {
      try {
        const pixel = imageCtx!.getImageData(x, y, 1, 1).data;
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
      if (!isVisible) return; // skip if off-screen
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastSpawnY);
      const threshold = isMobile ? 5 : 20;
      if (delta < threshold) return;
      if (!isMobile && Math.random() > 0.7) return;

      const scanLineY = window.innerHeight / 2 - cachedRect.top; // use cached rect

      if (scanLineY > -100 && scanLineY < drawDims.h + 100) {
        lastSpawnY = currentScroll;
        const count = 2;
        const spreadSize = isMobile ? 1 : SCROLL_RADIUS;

        for (let i = 0; i < count; i++) {
          const randomX = Math.random() * drawDims.w;
          spawnPixels(randomX, scanLineY, spreadSize);
        }
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, cachedRect.width, cachedRect.height);

      if (img.naturalWidth) {
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawDims.x, drawDims.y, drawDims.w, drawDims.h);
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
      rafId = requestAnimationFrame(draw); // only continues while visible
    };

    // Only run the rAF loop while the canvas is in the viewport
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) {
        cachedRect = canvas.getBoundingClientRect(); // refresh rect on re-entry
        rafId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafId);
      }
    }, { threshold: 0 });

    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [image]);

  return (
    <canvas ref={canvasRef} className="block w-full h-full" />
  );
}
