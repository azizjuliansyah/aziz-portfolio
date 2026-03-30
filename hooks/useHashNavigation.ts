"use client";

import { useEffect, useRef } from "react";

export function useHashNavigation(loading: boolean) {
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!loading && !hasScrolled.current) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Use scrollIntoView for more reliable scrolling
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            // Calculate offset for fixed header (80px)
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 80;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Mark as scrolled to prevent re-scrolling
            hasScrolled.current = true;
          }
        }, 300);
      }
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        // Allow manual scroll after hash change - reset flag
        hasScrolled.current = false;
        setTimeout(() => {
          const element = document.getElementById(newHash);
          if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - 80;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            hasScrolled.current = true;
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [loading]);
}
