"use client";

import { ReactNode } from "react";
import { useScrollAnimation, animationVariants } from "@/hooks/useScrollAnimation";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: keyof typeof animationVariants;
  delay?: number;
  className?: string;
  threshold?: number;
}

/**
 * Wrapper component for scroll-triggered animations
 * Automatically animates children when they enter viewport
 */
export function ScrollReveal({
  children,
  variant = "fadeIn",
  delay = 0,
  className = "",
  threshold = 0.1,
}: ScrollRevealProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold });

  const animation = animationVariants[variant];
  const delayStyle = delay > 0 ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div
      ref={elementRef}
      className={`${isVisible ? animation.visible : animation.hidden} ${className}`}
      style={delayStyle}
    >
      {children}
    </div>
  );
}

/**
 * Stagger children animation with delays
 */
export function StaggerReveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div ref={elementRef} className={className}>
      {isVisible && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          {children}
        </div>
      )}
    </div>
  );
}
