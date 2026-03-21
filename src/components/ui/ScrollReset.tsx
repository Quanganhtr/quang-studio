"use client";

import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return null;
}
