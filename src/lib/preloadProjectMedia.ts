import type { Project } from "@/lib/projects";

function isVideo(src: string) {
  return /\.(mp4|webm|mov)$/i.test(src);
}

export function getProjectMediaUrls(project: Project): string[] {
  return [project.coverVideo, project.gridLeftVideo, project.gridRightImage, project.closingVideo, project.closingImage]
    .filter((url): url is string => Boolean(url));
}

// Resolves once every URL has either loaded (video can play through without
// stalling, image decoded) or errored — capped so a slow network can't block forever.
export function preloadMedia(urls: string[], maxWaitMs = 4000): Promise<void> {
  if (urls.length === 0) return Promise.resolve();

  return new Promise((resolve) => {
    let loaded = 0;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      resolve();
    };
    const markLoaded = () => {
      loaded += 1;
      if (loaded >= urls.length) finish();
    };

    urls.forEach((src) => {
      let counted = false;
      const mark = () => { if (counted) return; counted = true; markLoaded(); };

      if (isVideo(src)) {
        const video = document.createElement("video");
        video.preload = "auto";
        video.muted = true;
        video.oncanplaythrough = mark;
        video.onerror = mark;
        video.src = src;
      } else {
        const img = new Image();
        img.onload = mark;
        img.onerror = mark;
        img.src = src;
      }
    });

    setTimeout(finish, maxWaitMs);
  });
}
