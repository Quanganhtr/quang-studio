"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VELOCITY_THRESHOLD  = 5600;
const BETWEEN_TRIGGERS_MS = 1000;
const AUTO_DISMISS_MS     = 4000;
const MAX_TRIGGERS        = 3;
const PEEK                = 8;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MESSAGES = [
  { title: "Hey, slow down!", desc: "You scroll too fast — I spent 100+ hours writing this.", img: "/sad.png"      },
  { title: "Seriously???", desc: "Good stuff here. Take a breath pls.",           img: "/angry.png"    },
  { title: "Ok, I give up.",   desc: "But come back and read it sometime, yeah?",                    img: "/hopeless.png" },
];

interface ToastData { id: number; messageIndex: number; }

function useCardSize() {
  const [card, setCard] = useState(156);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => setCard(e.matches ? 200 : 156);
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return card;
}

export default function FastScrollToast() {
  const CARD = useCardSize();
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
    setToasts(prev => prev.filter(t => t.id !== id));
    const timer = dismissTimers.current.get(id);
    if (timer) { clearTimeout(timer); dismissTimers.current.delete(id); }
  }, []);

  useEffect(() => {
    const addToast = () => {
      const id  = ++idCounter.current;
      const idx = messageIndex.current % MESSAGES.length;
      messageIndex.current += 1;
      activeCount.current  += 1;
      setToasts(prev => [...prev, { id, messageIndex: idx }]);
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
          if (velocity > VELOCITY_THRESHOLD && Date.now() > cooldownUntil.current && activeCount.current < MAX_TRIGGERS) {
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

  const peekTotal = (toasts.length - 1) * PEEK;

  return (
    <motion.div
      className="fixed bottom-2 left-2 md:bottom-6 md:left-auto md:right-6 z-50 overflow-hidden"
      style={{ width: CARD }}
      animate={{ height: CARD + peekTotal }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <AnimatePresence>
        {toasts.map((toast, i) => {
          const isActive = i === toasts.length - 1;
          const msg = MESSAGES[toast.messageIndex];
          return (
            <motion.div
              key={toast.id}
              initial={{ y: -(CARD), scale: 1 }}
              animate={{
                y:       i * PEEK,
                scale:   isActive ? 1 : 1 - (toasts.length - 1 - i) * 0.05,
                opacity: isActive ? 1 : 0.5,
              }}
              exit={{ y: -(CARD), opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute top-0 left-0 bg-card flex flex-col justify-end p-4"
              style={{ width: CARD, height: CARD, zIndex: i + 1, fontFamily: "var(--font-mono)", transformOrigin: "top center" }}
            >
              {isActive && (
                <>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-card-foreground transition-colors"
                    aria-label="Dismiss"
                  >
                    <i className="ri-close-line text-base" />
                  </button>
                  <div className="flex flex-col gap-3">
                    <img src={msg.img} alt="" className="w-14 h-14 md:w-18 md:h-18" />
                    <div className="min-w-0">
                      <p className="text-base-bold text-background leading-tight">{msg.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground leading-snug">{msg.desc}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
