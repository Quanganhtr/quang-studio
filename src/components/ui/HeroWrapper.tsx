"use client";

import { useEffect, useState } from "react";

export default function HeroWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: isMobile ? "120svh" : "100dvh" }}
    >
      {children}
    </div>
  );
}
