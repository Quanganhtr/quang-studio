"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import PixelTransition, { PixelTransitionHandle } from "@/components/ui/PixelTransition";
import CustomCursor from "@/components/ui/CustomCursor";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const transitionRef = useRef<PixelTransitionHandle>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    const toColor = next === "dark" ? "#000000" : "#ffffff";

    transitionRef.current?.play(toColor, () => {
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      <PixelTransition ref={transitionRef} />
      <CustomCursor />
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
