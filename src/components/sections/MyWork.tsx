"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function MyWork() {
  return (
    <section className="flex flex-col">
      {/* 100dvh title container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        viewport={{ once: true, margin: "-100px" }}
        className="sticky top-0 h-dvh flex items-center justify-center px-8 z-0"
      >
        <h2 className="type-h2 text-center">
          MY CTRL+Z LIFE
        </h2>
      </motion.div>

      {/* Studio image */}
      <div className="relative w-full z-1">
        <Image
          src="/Studio BG.png"
          alt="Studio"
          width={0}
          height={0}
          sizes="100vw"
          unoptimized
          className="w-full h-auto block"
        />
      </div>
    </section>
  );
}
