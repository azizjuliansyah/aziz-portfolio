import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton = ({ className = "", width, height, circle = false }: SkeletonProps) => {
  return (
    <div
      className={`bg-surface-container-high animate-pulse ${
        circle ? "rounded-full" : "rounded-lg"
      } ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
};
