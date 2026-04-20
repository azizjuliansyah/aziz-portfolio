"use client";

import { useEffect, useRef } from "react";

export function useHashNavigation(loading: boolean) {
  const hasScrolled = useRef(false);

  useEffect(() => {
    const scrollToHash = (hash: string) => {
      const element = document.getElementById(hash);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return true;
      }
      return false;
    };

    if (!loading && !hasScrolled.current) {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          if (scrollToHash(hash)) {
            hasScrolled.current = true;
          }
        }, 300);
      }
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        hasScrolled.current = false;
        setTimeout(() => {
          if (scrollToHash(newHash)) {
            hasScrolled.current = true;
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [loading]);
}
