"use client";

import { ArrowUpRight } from "lucide-react";

interface ProjectFeaturedImageProps {
  thumbnail: string;
  title: string;
  onImageClick: (url: string) => void;
}

export function ProjectFeaturedImage({ thumbnail, title, onImageClick }: ProjectFeaturedImageProps) {
  return (
    <section className="mb-24 relative">
      <div
        className="relative w-full aspect-[21/9] overflow-hidden rounded-lg bg-surface-container shadow-2xl featured-image-container cursor-pointer group"
        onClick={() => onImageClick(thumbnail)}
      >
        <style>{`
          .featured-image-container {
            position: relative;
          }
          .featured-image-container::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%);
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }
          .featured-image-container:hover::after {
            opacity: 1;
          }
          .featured-image {
            filter: grayscale(50%) brightness(0.9);
            opacity: 0.8;
            transition: filter 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(1);
          }
          .featured-image-container:hover .featured-image {
            filter: grayscale(0%) brightness(1);
            opacity: 1;
            transform: scale(1.03);
          }
          .featured-zoom-hint {
            opacity: 0;
            transform: scale(0.9);
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .featured-image-container:hover .featured-zoom-hint {
            opacity: 1;
            transform: scale(1);
          }
        `}</style>
        <img
          className="w-full h-full object-cover featured-image"
          src={thumbnail}
          alt={title}
        />
        {/* Zoom hint icon */}
        <div className="featured-zoom-hint absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
            <ArrowUpRight className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
