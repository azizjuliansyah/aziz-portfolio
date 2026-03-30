"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

interface ProjectHeroProps {
  project: {
    title: string;
    info?: string;
    link?: string;
    created_at: string;
  };
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <header className="mb-16 relative">
      {/* Simple hex accent */}
      <div className="absolute -top-16 -left-20 opacity-[0.05] pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="100,10 180,50 180,130 100,170 20,130 20,50" stroke="var(--color-primary)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Top Actions Row - Back & Live Prototype */}
      <div className="flex justify-between items-start my-8">
        {/* Back Button */}
        <Link
          href="/"
          onClick={() => sessionStorage.setItem('scrollToSection', 'projects')}
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full border border-outline/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <span className="font-label font-bold text-sm text-outline group-hover:text-primary uppercase tracking-widest transition-colors duration-300">
            Back to Projects
          </span>
        </Link>

        {/* Live Prototype Button */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <span className="font-label font-bold text-sm text-primary uppercase tracking-widest">Live Prototype</span>
            <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
              <ArrowUpRight className="w-6 h-6" />
            </div>
          </a>
        )}
      </div>

      {/* Project Info & Title */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-outline px-3 py-1 bg-surface-container rounded-full">
            {project.info || "Engineering & Design"}
          </span>
          <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold">
            {new Date(project.created_at).getFullYear()}
          </span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface leading-[0.9]">
          {project.title}.
        </h1>
      </div>
    </header>
  );
}
