"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VELOCITY_THRESHOLD  = 2400;
const BETWEEN_TRIGGERS_MS = 1000;
const AUTO_DISMISS_MS     = 4000;
const MAX_TRIGGERS        = 3;

const MESSAGES = [
  {
    title: "Hey, slow down!",
    desc:  "You scroll too fast — I spent 100+ hours writing this content.",
    img:   "/sad.png",
  },
  {
    title: "Seriously though...",
    desc:  "There's actually good stuff here. Take a breath.",
    img:   "/angry.png",
  },
  {
    title: "Ok, I give up.",
    desc:  "But come back and read it sometime, yeah?",
    img:   "/hopeless.png",
  },
];

interface ToastData {
  id: number;
  messageIndex: number;
  leaving: boolean;
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: number) => void;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const msg = MESSAGES[toast.messageIndex];

  return (
    <div
        className="w-60 relative overflow-hidden bg-card text-card-foreground p-4"
        style={{
          fontFamily: "var(--font-mono)",
          transition: toast.leaving
            ? "transform 0.3s ease-in, opacity 0.3s ease-in"
            : "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out",
          transform: toast.leaving
            ? "translateY(20px)"
            : entered
            ? "translateY(0)"
            : "translateY(100px)",
          opacity: toast.leaving ? 0 : entered ? 1 : 0,
        }}
      >
        <button
          onClick={() => onDismiss(toast.id)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-card-foreground transition-colors"
          aria-label="Dismiss"
        >
          <i className="ri-close-line text-base" />
        </button>

        <div className="flex flex-col gap-3">
          <img src={msg.img} alt="" width={124} height={124} />

          <div className="min-w-0">
            <p className="text-sm font-bold text-background leading-tight">
              {msg.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground leading-snug">
              {msg.desc}
            </p>
          </div>
        </div>
    </div>
  );
}

export default function FastScrollToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const activeCount   = useRef(0);
  const messageIndex  = useRef(0);
  const cooldownUntil = useRef(0);
  const lastY         = useRef<number | null>(null);
  const lastT         = useRef(Date.now());
  const idCounter     = useRef(0);
  const dismissTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: number) => {
    activeCount.current = Math.max(0, activeCount.current - 1);
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    const timer = dismissTimers.current.get(id);
    if (timer) { clearTimeout(timer); dismissTimers.current.delete(id); }
  }, []);

  useEffect(() => {
    const addToast = () => {
      const id  = ++idCounter.current;
      const idx = messageIndex.current % MESSAGES.length;
      messageIndex.current += 1;
      activeCount.current  += 1;
      setToasts(prev => [...prev, { id, messageIndex: idx, leaving: false }]);
      const timer = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
      dismissTimers.current.set(id, timer);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const t = Date.now();

      if (lastY.current !== null) {
        const dt = t - lastT.current;
        if (dt > 0) {
          const velocity = (Math.abs(y - lastY.current) / dt) * 1000;
          if (
            velocity > VELOCITY_THRESHOLD &&
            Date.now() > cooldownUntil.current &&
            activeCount.current < MAX_TRIGGERS
          ) {
            cooldownUntil.current = Date.now() + BETWEEN_TRIGGERS_MS;
            addToast();
          }
        }
      }

      lastY.current = y;
      lastT.current = t;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      dismissTimers.current.forEach(timer => clearTimeout(timer));
    };
  }, [dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
