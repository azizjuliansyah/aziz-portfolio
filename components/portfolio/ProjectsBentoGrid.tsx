"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface ProjectsBentoGridProps {
  projects: Array<{
    id: string | number;
    title: string;
    description: string;
    thumbnail: string;
    info?: string;
  }>;
}

export function ProjectsBentoGrid({ projects }: ProjectsBentoGridProps) {
  return (
    <section className="pt-12 pb-24 px-6 md:px-20 bg-surface relative overflow-hidden" id="projects">
      {/* Background Glow Orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] z-0 pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-tertiary/20 rounded-full blur-[120px] z-0 pointer-events-none translate-x-1/4"></div>
      
      {/* Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06] z-0"
        style={{
          backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
        }}
      />

      {/* Hexagon shape decoration */}
      <div className="absolute top-1/4 right-20 opacity-[0.15] pointer-events-none z-0 rotate-12 hidden md:block">
        <svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" stroke="var(--color-primary)" strokeWidth="2" fill="transparent" />
        </svg>
      </div>

      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 4px)",
        }}
      />
      
      {/* Top-right corner bracket */}
      <div className="absolute top-10 right-10 opacity-30 pointer-events-none hidden md:block z-0">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 L80 0 L80 80" stroke="var(--color-primary)" strokeWidth="3" fill="none" />
        </svg>
      </div>
      
      {/* Bottom-left corner bracket */}
      <div className="absolute bottom-10 left-10 opacity-30 pointer-events-none hidden md:block z-0">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 80 L0 80 L0 0" stroke="var(--color-tertiary)" strokeWidth="3" fill="none" />
        </svg>
      </div>

      {/* Subtle vertical label */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 opacity-30 pointer-events-none hidden xl:block z-0">
        <p className="font-label text-xs tracking-[0.5em] uppercase text-on-surface font-bold" style={{ writingMode: 'vertical-rl' }}>Featured Cases</p>
      </div>
      <ScrollReveal variant="slideUp">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-headline text-5xl font-bold mb-16">Selected Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {projects?.map((project, index) => {
              const isLarge = index === 0 || index === 3;
              const colSpan = isLarge ? "md:col-span-8" : "md:col-span-4";
              const aspectRatio = isLarge ? "aspect-[4/3]" : "aspect-[2/3]";

              if (index > 3) return null; // Limit to 4 for the bento grid

              return (
                <ScrollReveal key={project.id} variant="scale" delay={index * 150} className={colSpan}>
                  <div
                    className={`project-card-${project.id} ${aspectRatio} relative overflow-hidden bg-surface-container-lowest rounded-lg shadow-sm w-full`}
                  >
                    <style>{`
                      .project-card-${project.id} {
                        transition: box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                      }
                      .project-card-${project.id}:hover {
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                      }
                      .project-img-${project.id} {
                        filter: grayscale(100%) brightness(0.85);
                        opacity: 0.6;
                        transition: filter 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        transform: scale(1);
                      }
                  .project-card-${project.id}:hover .project-img-${project.id} {
                    filter: grayscale(0%) brightness(1);
                    opacity: 1;
                    transform: scale(1.08);
                  }
                  .project-meta-${project.id} {
                    opacity: 0.7;
                    transform: translateY(8px);
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .project-card-${project.id}:hover .project-meta-${project.id} {
                    opacity: 1;
                    transform: translateY(0);
                  }
                  .project-title-${project.id} {
                    opacity: 0.85;
                    transform: translateY(8px);
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .project-card-${project.id}:hover .project-title-${project.id} {
                    opacity: 1;
                    transform: translateY(0);
                  }
                  .project-desc-${project.id} {
                    opacity: 0.7;
                    transform: translateY(8px);
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .project-card-${project.id}:hover .project-desc-${project.id} {
                    opacity: 1;
                    transform: translateY(0);
                  }
                  .project-link-${project.id} {
                    opacity: 0.6;
                    transform: translateX(-4px);
                    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .project-card-${project.id}:hover .project-link-${project.id} {
                    opacity: 1;
                    transform: translateX(0);
                  }
                  .project-arrow-${project.id} {
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                  }
                  .project-card-${project.id}:hover .project-arrow-${project.id} {
                    transform: translateX(4px);
                  }
                `}</style>
                <div className="absolute inset-0 bg-surface-container-lowest">
                  <img
                    alt={project.title}
                    className={`w-full h-full object-cover project-img-${project.id}`}
                    src={project.thumbnail}
                    style={{ objectPosition: 'center center' }}
                  />
                </div>
                <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent">
                  <p className={`font-label text-xs font-bold uppercase tracking-widest text-primary mb-2 project-meta-${project.id}`}>
                    {project.info || "Visual Case Study"}
                  </p>
                  <h3 className={`font-headline text-4xl font-bold mb-4 project-title-${project.id}`}>{project.title}</h3>
                  <p className={`font-body text-lg text-on-surface-variant max-w-md mb-6 line-clamp-2 project-desc-${project.id}`}>
                    {project.description}
                  </p>
                  <a className={`text-on-surface font-label font-bold flex items-center gap-2 inline-flex project-link-${project.id}`} href={`/projects/${project.id}`}>
                    Case Study
                    <ArrowRight className={`w-5 h-5 text-primary project-arrow-${project.id}`} />
                  </a>
                </div>
              </div>
              </ScrollReveal>
            );
          })}
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
