"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect which section is currently active based on scroll position
 * Uses Intersection Observer API for efficient section detection
 */
export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is intersecting and is the topmost visible section
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Sort by how much of the section is visible (highest ratio first)
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const topmostSection = visibleEntries[0].target.id;
          setActiveSection(topmostSection);
        }
      },
      {
        rootMargin: "-50% 0px -50% 0px", // Trigger when section is in the middle of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1.0], // Multiple thresholds for better detection
      }
    );

    // Observe all sections
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [sectionIds]);

  return activeSection;
}
