"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ProjectLightboxProps {
  image: string | null;
  onClose: () => void;
}

export function ProjectLightbox({ image, onClose }: ProjectLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (image) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .lightbox-image {
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={image}
          alt="Full size preview"
          className="lightbox-image max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Hint text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-label tracking-wide">
        Press ESC or click anywhere to close
      </div>
    </div>
  );
}
