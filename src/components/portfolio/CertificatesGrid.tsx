import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Award, Calendar, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Certificate } from "@/types/certificate";
import { ProjectLightbox } from "./ProjectLightbox";

interface CertificatesGridProps {
  certificates: Certificate[];
}

export function CertificatesGrid({ certificates }: CertificatesGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) setItemsPerView(3);
      else if (window.innerWidth >= 640) setItemsPerView(2);
      else setItemsPerView(1);
    };
    
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const getPageIndices = () => {
    const pages = [];
    for (let i = 0; i < certificates.length; i += itemsPerView) {
      if (i > certificates.length - itemsPerView) {
        const lastStart = Math.max(0, certificates.length - itemsPerView);
        if (pages.length === 0 || pages[pages.length - 1] !== lastStart) {
          pages.push(lastStart);
        }
        break;
      }
      pages.push(i);
    }
    return pages.length > 0 ? pages : [0];
  };

  const pageIndices = getPageIndices();
  const totalDots = pageIndices.length;

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScrollLeft = scrollWidth - clientWidth;
      
      // Find which page index is closest to current scrollLeft based on actual element offsets
      let closestPage = 0;
      let minDiff = Infinity;
      
      pageIndices.forEach((startIndex, idx) => {
        const item = container.children[startIndex] as HTMLElement;
        if (item) {
          const itemOffset = item.offsetLeft - container.offsetLeft;
          const diff = Math.abs(scrollLeft - itemOffset);
          if (diff < minDiff) {
            minDiff = diff;
            closestPage = idx;
          }
        }
      });

      setActiveIndex(closestPage);

      // Arrow visibility based on scroll boundaries
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < maxScrollLeft - 15);
    }
  };

  const scrollToDot = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const children = container.children;
      const targetItemIndex = pageIndices[pageIndex];
      
      if (children[targetItemIndex]) {
        const targetElement = children[targetItemIndex] as HTMLElement;
        const targetLeft = targetElement.offsetLeft - container.offsetLeft;
        
        container.scrollTo({
          left: targetLeft,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      // Initial check
      checkScroll();
      
      // Re-check on resize
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [certificates]);

  const scroll = (direction: "left" | "right") => {
    const nextIndex = direction === "left" ? activeIndex - 1 : activeIndex + 1;
    if (nextIndex >= 0 && nextIndex < totalDots) {
      scrollToDot(nextIndex);
    } else if (direction === "right" && activeIndex < totalDots - 1) {
      // Fallback for edge cases if totalDots calculation is slightly off
      scrollToDot(activeIndex + 1);
    }
  };

  if (!certificates || certificates.length === 0) return null;

  return (
    <section className="pt-24 pb-24 px-6 md:px-20 bg-surface relative overflow-hidden" id="certificates">
      {/* Blueprint Grid Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>

      <ScrollReveal variant="slideUp">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4 pr-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-primary"></div>
                <span className="font-label text-xs font-bold uppercase tracking-[0.3em] text-primary">Credentials</span>
              </div>
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
                Certifications
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* <p className="font-body text-sm text-on-surface-variant max-w-xs hidden lg:block mr-8 text-right italic opacity-70">
                Swipe or use arrows to navigate through professional validations.
              </p> */}
              
              {/* Navigation Arrows */}
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!showLeftArrow}
                  className={`w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center transition-all duration-300 ${
                    showLeftArrow 
                      ? "hover:bg-primary hover:text-on-primary hover:border-primary cursor-pointer" 
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  aria-label="Previous certificate"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!showRightArrow}
                  className={`w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center transition-all duration-300 ${
                    showRightArrow 
                      ? "hover:bg-primary hover:text-on-primary hover:border-primary cursor-pointer" 
                      : "opacity-30 cursor-not-allowed"
                  }`}
                  aria-label="Next certificate"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 px-2 -mx-2"
            style={{ scrollPadding: '1rem' }}
          >
            {certificates.map((cert, index) => (
              <div 
                key={cert.id} 
                className="flex-none w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
              >
                <div className="group flex flex-col h-full bg-surface-container-low rounded-2xl overflow-hidden border border-outline/10 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  <div 
                    className="relative aspect-video w-full overflow-hidden bg-surface-container-high cursor-pointer"
                    onClick={() => {
                      if (cert.file_url) {
                        window.open(cert.file_url as string, "_blank");
                      } else if (cert.image_url) {
                        setSelectedImage(cert.image_url as string);
                      }
                    }}
                  >
                    {cert.image_url ? (
                      <>
                        <Image
                          src={cert.image_url as string}
                          alt={cert.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          unoptimized
                        />
                        {cert.file_url && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10">
                            <span className="bg-primary text-on-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              View Document
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
                        <Award className="w-16 h-16" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-20"
                        title="View Credential"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        <Award className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        {cert.issuer}
                      </span>
                    </div>
                    
                    <h3 className="font-headline text-base sm:text-lg font-bold text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    
                    <div className="mt-auto pt-3 border-t border-outline/10 space-y-1">
                      <div className="flex items-center text-xs text-on-surface-variant">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-mono">{cert.date_issued}</span>
                      </div>
                      
                      {cert.credential_id && (
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80">
                          <span className="font-semibold shrink-0">ID:</span>
                          <span className="font-mono break-all px-1.5 py-0.5 bg-on-surface/5 rounded-md">
                            {cert.credential_id}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Progress Indicator Dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: totalDots }).map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToDot(i)}
                className={`transition-all duration-500 rounded-full cursor-pointer ${
                  activeIndex === i 
                    ? "w-8 h-1.5 bg-primary" 
                    : "w-1.5 h-1.5 bg-outline/20 hover:bg-outline/40"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ProjectLightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}
