"use client";

import { createContext, useContext, useEffect, useState } from "react";
import CustomCursor from "@/components/ui/CustomCursor";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const resolved = saved ?? "dark";
    setTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      <CustomCursor />
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
