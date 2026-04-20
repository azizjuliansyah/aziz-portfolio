"use client";

export function useSmoothScroll() {
  const scrollToHash = (hash: string) => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const element = document.getElementById(hash);
      if (element) {
        // Use native smooth scroll with offset for fixed header
        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  return { scrollToHash };
}
