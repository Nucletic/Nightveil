import { useLayoutEffect, useState } from 'react';

type VideoRect = { top: number; left: number; width: number; height: number; right: number; bottom: number };

export function useLargestVideo(): VideoRect | null {
  const [videoRect, setVideoRect] = useState<VideoRect | null>(null);

  useLayoutEffect(() => {
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const videos = Array.from(document.querySelectorAll<HTMLVideoElement>('video'));

        let largestRect: DOMRect | null = null;
        let largestArea = 0;

        for (const video of videos) {
          const rect = video.getBoundingClientRect();

          if (rect.width <= 0 || rect.height <= 0) continue;

          const area = rect.width * rect.height;

          if (area > largestArea) {
            largestArea = area;
            largestRect = rect;
          }
        }

        setVideoRect((prev) => {
          if (!largestRect) {
            return prev === null ? prev : null;
          }

          // prettier-ignore
          const next: VideoRect = {
            top: largestRect.top,
            left: largestRect.left,
            width: largestRect.width,
            height: largestRect.height,
            right: largestRect.right,
            bottom: largestRect.bottom
          };

          if (prev && prev.top === next.top && prev.left === next.left && prev.width === next.width && prev.height === next.height) {
            return prev;
          }

          return next;
        });
      });
    };

    // Initial detection
    update();

    // Detect video added/removed
    const mutationObserver = new MutationObserver(update);

    mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

    // Detect video resizing
    const resizeObserver = new ResizeObserver(update);

    const observeVideos = () => {
      document.querySelectorAll<HTMLVideoElement>('video').forEach((video) => resizeObserver.observe(video));
    };

    observeVideos();

    // Re-check observers when DOM changes
    const observer = new MutationObserver(() => {
      observeVideos();
      update();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Video position changes when scrolling
    window.addEventListener('scroll', update, { passive: true });

    // Video dimensions can change on viewport resize
    window.addEventListener('resize', update);

    return () => {
      cancelAnimationFrame(raf);

      mutationObserver.disconnect();
      observer.disconnect();
      resizeObserver.disconnect();

      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return videoRect;
}
