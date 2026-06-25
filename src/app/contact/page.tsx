"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/gtag";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const CONTACT_LINKS = [
  { label: "Email",    value: "quanganhtran2908@gmail.com", href: "mailto:quanganhtran2908@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/quanganhtr", href: "https://www.linkedin.com/in/quanganhtr" },
  { label: "Dribbble", value: "dribbble.com/quanganh29",   href: "https://dribbble.com/quanganh29" },
  { label: "Behance",  value: "behance.net/quanganhtran2908", href: "https://www.behance.net/quanganhtran2908" },
];

type Status = "idle" | "loading" | "success" | "error";

function ContactForm() {
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    trackEvent("contact_form_submit");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        trackEvent("contact_form_success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        trackEvent("contact_form_error", { reason: "http_error" });
      }
    } catch {
      setStatus("error");
      trackEvent("contact_form_error", { reason: "network_error" });
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 border-b border-ui pb-4">
        <label className="text-sm-regular text-muted-foreground">Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          required
          className="bg-transparent text-base-bold outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-2 border-b border-ui pb-4">
        <label className="text-sm-regular text-muted-foreground">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="your@email.com"
          required
          className="bg-transparent text-base-bold outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-2 border-b border-ui pb-4">
        <label className="text-sm-regular text-muted-foreground">Message</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="What's on your mind?"
          rows={6}
          required
          className="bg-transparent text-base-bold outline-none resize-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="flex flex-col gap-3 items-start">
        <Button
          type="submit"
          variant="solid"
          size="lg"
          label={status === "loading" ? "SENDING..." : "SEND IT →"}
          hoverLabel="GOOD CHOICE"
          disabled={status === "loading"}
          className="self-start"
        />
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base-bold text-muted-foreground"
          >
            Message sent — I'll get back to you soon.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base-bold text-muted-foreground"
          >
            Something went wrong. Try emailing me directly.
          </motion.p>
        )}
      </div>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Title ─────────────────────────────────────────────────────── */}
        <section className="section-container max-w-none pt-40 md:pt-80 lg:pt-120 pb-8 md:pb-12 px-2 md:px-8 lg:px-14 border-b border-ui">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE }}
            className="type-h2"
          >
            <span className="text-accent-foreground">{"Drop me a line, a brief, "}</span>
            {"or a meme."}
            <span className="text-accent-foreground">{" I respond to "}</span>
            {"all three."}
          </motion.h2>
        </section>

        {/* ── Content ───────────────────────────────────────────────────── */}
        <section className="section-container max-w-none border-t border-b border-ui p-0 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-12">

            {/* Left: contact links */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE }}
              viewport={{ once: true, margin: "-80px" }}
              className="md:col-span-5 flex flex-col border-b border-ui md:border-b-0 md:border-r"
            >
              <div className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
                <h3 className="type-h3">Find me here</h3>
              </div>
              <div className="flex flex-col px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16">
                {CONTACT_LINKS.map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-row items-center justify-between border-b border-ui py-5 group"
                  >
                    <span className="text-base-bold text-muted-foreground">{label}</span>
                    <span className="text-base-bold group-hover:underline underline-offset-4">{value}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: contact form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
              viewport={{ once: true, margin: "-80px" }}
              className="md:col-span-7 flex flex-col"
            >
              <div className="border-b border-ui px-2 py-6 md:px-8 md:py-8 lg:px-14 lg:py-14">
                <h3 className="type-h3">Send a message</h3>
              </div>
              <div className="px-2 py-8 md:px-8 md:py-12 lg:px-14 lg:py-16">
                <ContactForm />
              </div>
            </motion.div>

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
