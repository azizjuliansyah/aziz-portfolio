"use client";

import { useEffect, useRef, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scroll
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close on outside click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className={`bg-surface rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-outline-variant/15`}
      >
        {(title || showCloseButton) && (
          <div className="px-6 py-4 border-b border-outline-variant/15 flex justify-between items-center shrink-0">
            {title && <h2 className="text-xl font-headline font-bold text-on-surface">{title}</h2>}
            {showCloseButton && (
              <button 
                onClick={onClose} 
                className="text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        <div className="p-2 md:p-6 overflow-y-auto w-full flex-1">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-outline-variant/15 flex items-center justify-end gap-3 shrink-0 bg-surface">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
