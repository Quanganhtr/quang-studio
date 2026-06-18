"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const REVEAL = {
  initial:    { opacity: 0, y: 24 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: EASE },
};

const META = [
  { label: "Role",     value: "[Role placeholder]"     },
  { label: "Client",   value: "[Client placeholder]"   },
  { label: "Year",     value: "[Year placeholder]"     },
  { label: "Platform", value: "[Platform placeholder]" },
];

function ImgPlaceholder({ ratio = "16/9", label = "Image placeholder" }: { ratio?: string; label?: string }) {
  return (
    <div
      className="w-full bg-muted flex flex-col items-center justify-center gap-2"
      style={{ aspectRatio: ratio }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground opacity-40">
        <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="text-sm-regular text-muted-foreground opacity-60">{label}</span>
    </div>
  );
}

function TextPlaceholder({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded-none"
          style={{ width: i === lines - 1 ? "60%" : "100%", opacity: 0.5 }}
        />
      ))}
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── 1. Title ──────────────────────────────────────────────────────── */}
        <section className="section-container max-w-none pt-40 md:pt-80 lg:pt-120 pb-8 md:pb-12 px-2 md:px-8 lg:px-14">
          <motion.div {...REVEAL} className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <span className="text-base-bold text-muted-foreground">[Category]</span>
              <span className="text-base-bold text-muted-foreground opacity-40">·</span>
              <span className="text-base-bold text-muted-foreground">[Year]</span>
            </div>
            <h1 className="type-h2">
              <span className="text-foreground">[Project title]</span>
              <span className="text-accent-foreground"> — [one-line hook goes here.]</span>
            </h1>
          </motion.div>
        </section>

        {/* ── 2. Meta row ───────────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-t border-b border-ui p-0">
          <motion.div {...REVEAL} className="grid grid-cols-2 md:grid-cols-4">
            {META.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex flex-col gap-2 px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-10 ${
                  i < META.length - 1 ? "border-r border-ui" : ""
                } ${i >= 2 ? "border-t border-ui md:border-t-0" : ""}`}
              >
                <span className="text-sm-regular text-muted-foreground">{label}</span>
                <span className="text-base-bold">{value}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── 3. Hero image ─────────────────────────────────────────────────── */}
        <section className="section-container max-w-none p-0 border-b border-ui">
          <motion.div {...REVEAL}>
            <ImgPlaceholder ratio="16/9" label="Hero image" />
          </motion.div>
        </section>

        {/* ── 4. Overview ───────────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui p-0">
          <div className="grid grid-cols-1 md:grid-cols-12">

            <motion.div
              {...REVEAL}
              className="md:col-span-5 flex flex-col border-b border-ui md:border-b-0 md:border-r"
            >
              <div className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
                <h2 className="type-h3">Overview</h2>
              </div>
              <div className="px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16 flex flex-col gap-6">
                <p className="text-lg-medium text-muted-foreground">[Short summary placeholder — one or two punchy sentences about what this project is.]</p>
                <div className="flex flex-col gap-2">
                  <span className="text-sm-regular text-muted-foreground">Link</span>
                  <Button variant="solid" size="lg" label="VIEW LIVE →" hoverLabel="LET'S GO" className="self-start" />
                </div>
              </div>
            </motion.div>

            <motion.div
              {...{ ...REVEAL, transition: { duration: 0.65, ease: EASE, delay: 0.1 } }}
              className="md:col-span-7 flex flex-col"
            >
              <div className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
                <h2 className="type-h3">The challenge</h2>
              </div>
              <div className="px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16 flex flex-col gap-6">
                <TextPlaceholder lines={5} />
                <TextPlaceholder lines={4} />
                <TextPlaceholder lines={3} />
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── 5. Image duo ──────────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <motion.div {...REVEAL} className="border-b border-ui md:border-b-0 md:border-r">
              <ImgPlaceholder ratio="4/3" label="Image 1" />
            </motion.div>
            <motion.div {...{ ...REVEAL, transition: { duration: 0.65, ease: EASE, delay: 0.1 } }}>
              <ImgPlaceholder ratio="4/3" label="Image 2" />
            </motion.div>
          </div>
        </section>

        {/* ── 6. Callout quote ──────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui px-2 py-16 md:px-8 md:py-24 lg:px-14 lg:py-32">
          <motion.h2 {...REVEAL} className="type-h2">
            <span className="text-accent-foreground">[Key insight or design principle — </span>
            <span className="text-foreground">something that shaped the whole project.</span>
            <span className="text-accent-foreground">]</span>
          </motion.h2>
        </section>

        {/* ── 7. Solution section ───────────────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui p-0">
          <div className="grid grid-cols-1 md:grid-cols-12">

            <motion.div
              {...{ ...REVEAL, transition: { duration: 0.65, ease: EASE, delay: 0.1 } }}
              className="md:col-span-7 flex flex-col border-b border-ui md:border-b-0 md:border-r"
            >
              <div className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
                <h2 className="type-h3">The solution</h2>
              </div>
              <div className="px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16 flex flex-col gap-6">
                <TextPlaceholder lines={5} />
                <TextPlaceholder lines={4} />
              </div>
            </motion.div>

            <motion.div
              {...REVEAL}
              className="md:col-span-5 flex flex-col"
            >
              <div className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
                <h2 className="type-h3">Outcomes</h2>
              </div>
              <div className="px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16 flex flex-col gap-8">
                {["[Outcome 1]", "[Outcome 2]", "[Outcome 3]"].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 border-b border-ui pb-8 last:border-0 last:pb-0">
                    <span className="text-base-bold text-muted-foreground">0{i + 1}</span>
                    <span className="text-lg-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── 8. Full-width showcase image ──────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui p-0">
          <motion.div {...REVEAL}>
            <ImgPlaceholder ratio="21/9" label="Showcase image — wide" />
          </motion.div>
        </section>

        {/* ── 9. Three-image grid ───────────────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui p-0">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {["Detail A", "Detail B", "Detail C"].map((label, i) => (
              <motion.div
                key={label}
                {...{ ...REVEAL, transition: { duration: 0.65, ease: EASE, delay: i * 0.08 } }}
                className={i < 2 ? "border-b border-ui md:border-b-0 md:border-r" : ""}
              >
                <div className="border-b border-ui px-2 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
                  <span className="text-base-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <ImgPlaceholder ratio="1/1" label={label} />
                <div className="px-2 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6 border-t border-ui">
                  <TextPlaceholder lines={2} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 10. Next project ──────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-b border-ui p-0">
          <motion.a
            {...REVEAL}
            href="/work"
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-2 py-12 md:px-8 md:py-16 lg:px-14 lg:py-20 group cursor-pointer"
          >
            <div className="flex flex-col gap-3">
              <span className="text-sm-regular text-muted-foreground">Next project</span>
              <h2 className="type-h3 group-hover:text-accent-foreground transition-colors duration-300">[Next project title]</h2>
            </div>
            <Button variant="solid" size="lg" label="VIEW PROJECT →" hoverLabel="LET'S GO" className="self-start md:self-auto" />
          </motion.a>
        </section>

        <Footer />
      </main>
    </>
  );
}
