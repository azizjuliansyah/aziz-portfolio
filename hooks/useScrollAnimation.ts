"use client";

import { useEffect, useRef, useState } from "react";

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to detect when element enters viewport for scroll animations
 * Returns true when element is visible
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}

/**
 * Animation variants for different effects
 */
export const animationVariants = {
  fadeIn: {
    hidden: "opacity-0",
    visible: "opacity-100 transition-opacity duration-700 ease-out",
  },
  slideUp: {
    hidden: "opacity-0",
    visible: "opacity-100 transition-opacity duration-800 ease-out",
  },
  slideLeft: {
    hidden: "opacity-0",
    visible: "opacity-100 transition-opacity duration-700 ease-out",
  },
  slideRight: {
    hidden: "opacity-0",
    visible: "opacity-100 transition-opacity duration-700 ease-out",
  },
  scale: {
    hidden: "opacity-0 scale-100",
    visible: "opacity-100 scale-100 transition-all duration-600 ease-out",
  },
};
