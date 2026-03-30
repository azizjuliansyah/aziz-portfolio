"use client";

import { ArrowUpRight } from "lucide-react";

interface ProjectGalleryProps {
  images: Array<{
    id: string | number;
    name: string;
  }>;
  onImageClick: (url: string) => void;
}

export function ProjectGallery({ images, onImageClick }: ProjectGalleryProps) {
  return (
    <section className="mb-32 relative">
      {/* Subtle hexagon accent */}
      <div className="absolute -left-20 top-20 opacity-[0.03] pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="150,10 270,80 270,210 150,280 30,210 30,80" stroke="var(--color-primary)" strokeWidth="2" fill="var(--color-primary)" />
        </svg>
      </div>

      <h2 className="font-headline text-2xl font-bold mb-12 uppercase tracking-widest text-on-surface-variant/50 text-center relative z-10">
        Visual Deep-Dive
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
        {images.map((image, index) => {
          const isWide = index === 0 || index === 3;
          const colSpan = isWide ? "md:col-span-8" : "md:col-span-4";

          return (
            <div
              key={image.id}
              className={`${colSpan} gallery-item-${index} overflow-hidden rounded-lg bg-surface-container-low shadow-md cursor-pointer`}
              onClick={() => onImageClick(image.name)}
            >
              <style>{`
                .gallery-item-${index} {
                  transition: box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .gallery-item-${index}:hover {
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .gallery-img-${index} {
                  filter: grayscale(80%) brightness(0.85);
                  opacity: 0.7;
                  transition: filter 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                  transform: scale(1);
                }
                .gallery-item-${index}:hover .gallery-img-${index} {
                  filter: grayscale(0%) brightness(1);
                  opacity: 1;
                  transform: scale(1.06);
                }
                .gallery-zoom-hint-${index} {
                  opacity: 0;
                  transform: scale(0.9);
                  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .gallery-item-${index}:hover .gallery-zoom-hint-${index} {
                  opacity: 1;
                  transform: scale(1);
                }
              `}</style>
              <img
                className={`w-full h-full object-cover gallery-img-${index}`}
                src={image.name}
                alt={image.name}
              />
              {/* Zoom hint icon */}
              <div className={`gallery-zoom-hint-${index} absolute inset-0 flex items-center justify-center pointer-events-none`}>
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
