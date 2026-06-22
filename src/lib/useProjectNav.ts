"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/lib/projects";
import { getProjectMediaUrls, preloadMedia } from "@/lib/preloadProjectMedia";

const MIN_LOADING_MS = 1000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Preloads a project's media before navigating, so the detail page never
// shows a late-loading blank video. `loadingSlug` lets the caller show a
// spinner on whichever entry point (button/thumbnail) was actually clicked.
// The spinner stays up for at least MIN_LOADING_MS even on a fast/cached
// load, so it doesn't just flash.
export function useProjectNav() {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const openProject = async (slug: string) => {
    if (loadingSlug) return;
    setLoadingSlug(slug);
    const project = PROJECTS.find((p) => p.slug === slug);
    await Promise.all([
      project ? preloadMedia(getProjectMediaUrls(project)) : Promise.resolve(),
      wait(MIN_LOADING_MS),
    ]);
    router.push(`/work/${slug}`);
  };

  return { loadingSlug, openProject };
}
