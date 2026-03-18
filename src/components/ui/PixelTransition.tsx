"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

const DESKTOP_BLOCK = 72;
const PHONE_BLOCK = 40;
const SPAWN_DURATION = 500;
const LIFE = 700;

export type PixelTransitionHandle = {
  play: (toColor: string, onComplete: () => void) => void;
};

const PixelTransition = forwardRef<PixelTransitionHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useImperativeHandle(ref, () => ({
    play(toColor: string, onComplete: () => void) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.display = "block";

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const block = w < 800 ? PHONE_BLOCK : DESKTOP_BLOCK;

      const cols = Math.ceil(w / block);
      const rows = Math.ceil(h / block);
      const total = cols * rows;

      // Shuffle all grid positions
      const positions = Array.from({ length: total }, (_, i) => i);
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      // Schedule each block: spawnAt = staggered over SPAWN_DURATION
      const startTime = performance.now();
      let switched = false;

      type Square = { x: number; y: number; spawnAt: number; bornAt: number | null };
      const squares: Square[] = positions.map((idx, i) => ({
        x: (idx % cols) * block,
        y: Math.floor(idx / cols) * block,
        spawnAt: (i / total) * SPAWN_DURATION,
        bornAt: null,
      }));

      let spawned = 0;

      const draw = (now: number) => {
        const elapsed = now - startTime;
        ctx.clearRect(0, 0, w, h);

        // Spawn new blocks
        while (spawned < total && squares[spawned].spawnAt <= elapsed) {
          squares[spawned].bornAt = now;
          spawned++;

          // Switch theme at 50% spawned
          if (!switched && spawned >= Math.floor(total / 2)) {
            switched = true;
            onComplete();
          }
        }

        let allDone = true;

        for (const s of squares) {
          if (s.bornAt === null) {
            allDone = false;
            continue;
          }

          const age = now - s.bornAt;
          if (age >= LIFE) continue; // fully faded, skip

          allDone = false;
          const alpha = 1 - age / LIFE;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = toColor;
          ctx.fillRect(s.x, s.y, block, block);
        }

        ctx.globalAlpha = 1;

        if (!allDone) {
          requestAnimationFrame(draw);
        } else {
          if (!switched) {
            switched = true;
            onComplete();
          }
          canvas.style.display = "none";
          ctx.clearRect(0, 0, w, h);
        }
      };

      requestAnimationFrame(draw);
    },
  }));

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "none",
        pointerEvents: "none",
      }}
    />
  );
});

PixelTransition.displayName = "PixelTransition";
export default PixelTransition;
