"use client";

import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 1200; // 1.2 seconds for smoother scroll
    let startTimestamp: number | null = null;

    // Easing function: easeOutCubic
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animation = (currentTime: number) => {
      if (startTimestamp === null) startTimestamp = currentTime;
      const elapsed = currentTime - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
      <div className="w-full md:w-auto"></div>

      <div className="text-center md:text-right w-full md:w-auto">
        <button
          onClick={scrollToTop}
          className="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-all duration-300 flex items-center gap-4 justify-end w-full group"
        >
          <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Back to top</span>
          <ArrowUp className="w-8 h-8 group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
}
