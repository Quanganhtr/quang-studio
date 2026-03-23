"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MyWork() {
  return (
    <section style={{ display: "flex", flexDirection: "column" }}>
      {/* 100dvh title container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
          zIndex: 0,
        }}
      >
        <h2 className="label-h2 text-center">
          MY CTRL+Z LIFE
        </h2>
      </motion.div>

      {/* Studio image */}
      <div style={{ width: "100%", position: "relative", zIndex: 1 }}>
        <Image
          src="/Studio BG.png"
          alt="Studio"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </section>
  );
}
