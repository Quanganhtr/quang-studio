import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import ProjectTitleLink from "@/components/ui/ProjectTitleLink";
import TestimonialQuote from "@/components/ui/TestimonialQuote";
import NextProjectBanner from "@/components/ui/NextProjectBanner";
import WordReveal from "@/components/ui/WordReveal";
import Footer from "@/components/sections/Footer";
import { PROJECTS } from "@/lib/projects";

// Pre-render a static page for every project slug.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — Quang Studio` };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const project = PROJECTS[projectIndex];
  if (!project) notFound();

  if (project.comingSoon) {
    return (
      <>
        <Navbar />
        <main>
          <section
            className="section-container max-w-none flex flex-col items-center justify-center text-center gap-4 md:gap-6 px-2 md:px-8 lg:px-14 border-b border-ui"
            style={{ minHeight: "100dvh" }}
          >
            <span className="text-base-bold text-muted-foreground">
              {project.index} — {project.category}
            </span>
            <h2 className="type-h2">{project.title}</h2>
            <p className="text-base-regular text-muted-foreground">Coming soon.</p>
            <Button
              variant="solid"
              size="lg"
              label="Back to work"
              hoverLabel="Back to work"
              href="/work"
            />
          </section>
          <Footer />
        </main>
      </>
    );
  }

  const nextProject = PROJECTS[(projectIndex + 1) % PROJECTS.length];
  const prevProject = PROJECTS[(projectIndex - 1 + PROJECTS.length) % PROJECTS.length];

  return (
    <>
      <Navbar />
      <main>

        {/* ── Section 1 — project name ──────────────────────────────────── */}
        <section
          className="section-container max-w-none flex flex-col items-center justify-center text-center gap-4 md:gap-6 px-2 md:px-8 lg:px-14 py-80 border-b border-ui"
        >
          <span className="text-base-bold text-muted-foreground">
            {project.index} — {project.category}
          </span>
          <ProjectTitleLink title={project.title} liveUrl={project.liveUrl} />
        </section>

        {/* ── Section 2 — cover media ──────────────────────────────────── */}
        <section className="w-full aspect-video lg:aspect-auto lg:min-h-dvh flex items-center justify-center bg-muted border-b border-ui">
          {project.coverVideo && (
            <video
              src={project.coverVideo}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </section>

        {/* ── Section 3 — performance highlight ─────────────────────────── */}
        {project.tagline && (
          <section className="w-full grid grid-cols-1 md:grid-cols-2 border-b border-ui">
            <div className="border-b md:border-b-0 md:border-r border-ui px-2 md:px-8 lg:px-14 py-16">
              <div className="md:sticky md:top-16 flex flex-col items-start text-left gap-6 bg-background">
                <WordReveal text={project.tagline} className="type-h2 text-left" />
                <p className="text-base-regular text-muted-foreground max-w-xl">{project.description}</p>
                <Button
                  variant="solid"
                  size="lg"
                  label="View live site"
                  hoverLabel="View live site"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </div>

            {project.stats && (
              <div className="flex flex-col">
                <div className="flex items-start px-2 md:px-8 lg:px-14 py-6 md:py-8 lg:py-14 min-h-35 md:min-h-44 lg:min-h-63 md:sticky md:top-0 bg-background">
                  <p className="text-base-regular text-muted-foreground whitespace-pre-line">
                    {project.statsCaption}
                  </p>
                </div>
                {project.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-start justify-between gap-6 px-2 md:px-8 lg:px-14 py-6 md:py-8 lg:py-14 min-h-35 md:min-h-44 lg:min-h-63 md:sticky md:top-0 bg-background border-t border-ui"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="type-h3">{stat.value}</span>
                      {stat.share && <span className="text-lg-bold text-muted-foreground">{stat.share}</span>}
                    </div>
                    <span className="text-base-regular text-muted-foreground text-right">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Section 4 — image grid ──────────────────────────────────── */}
        <section
          className="w-full grid grid-cols-1 md:grid-cols-2 border-b border-ui"
          style={{ minHeight: "100dvh" }}
        >
          <div className="flex items-center justify-center bg-muted border-b md:border-b-0 md:border-r border-ui">
            {project.gridLeftVideo && (
              <video
                src={project.gridLeftVideo}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            )}
          </div>
          <div className="flex items-center justify-center bg-muted">
            {project.gridRightImage && (
              <img
                src={project.gridRightImage}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </section>

        {/* ── Section 5 — testimonial ──────────────────────────────────── */}
        <section
          className="w-full flex flex-col items-center justify-center text-center gap-4 md:gap-6 px-2 md:px-8 lg:px-14 py-24 md:py-32 border-b border-ui"
        >
          {project.testimonial && (
            <>
              <TestimonialQuote quote={project.testimonial.quote} />
              <p className="text-base-regular text-muted-foreground">
                {project.testimonial.author} — {project.testimonial.role}
              </p>
            </>
          )}
        </section>

        {/* ── Section 6 — closing media ────────────────────────────────── */}
        <section className="w-full aspect-video lg:aspect-auto lg:min-h-dvh flex items-center justify-center bg-muted border-b border-ui">
          {project.closingVideo && (
            <video
              src={project.closingVideo}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </section>

        {/* ── Section 7 — closing image ─────────────────────────────────── */}
        <section className="w-full aspect-video lg:aspect-auto lg:min-h-dvh flex items-center justify-center bg-muted border-b border-ui">
          {project.closingImage && (
            <img
              src={project.closingImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </section>

        {/* ── Section 8 — scope + project navigation ───────────────────── */}
        <NextProjectBanner project={project} prevProject={prevProject} nextProject={nextProject} />

        {/* ── Section 9 — footer ───────────────────────────────────────── */}
        <Footer />

      </main>
    </>
  );
}
