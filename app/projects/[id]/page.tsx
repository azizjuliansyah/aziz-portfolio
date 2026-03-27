"use client";

import { useEffect, useState, use } from "react";
import {
  ArrowLeft, ArrowUpRight, Github, Linkedin, Twitter,
  Terminal, Layers, Database, Cloud, Palette, Shield, Info, ArrowRight, ArrowUp, X
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, profileRes] = await Promise.all([
          fetch(`/api/public/projects/${id}`),
          fetch("/api/public/profile")
        ]);

        const [projectData, profileData] = await Promise.all([
          projectRes.json(),
          profileRes.json()
        ]);

        setProject(projectData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxImage) {
        setLightboxImage(null);
      }
    };

    if (lightboxImage) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  // Custom smooth scroll to top function with easing
  const scrollToTop = () => {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 1200; // 1.2 seconds for smoother scroll
    let startTimestamp: number | null = null;

    // Easing function: easeOutCubic
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const animation = (currentTime: number) => {
      if (startTimestamp === null) startTimestamp = currentTime;
      const elapsed = currentTime - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
          <div className="h-4 w-32 bg-primary/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center p-8">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Project not found</h1>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body relative overflow-x-hidden">
      {/* Simple Grid Pattern Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* TopAppBar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl rounded-2xl bg-surface/80 backdrop-blur-xl shadow-xl z-50 flex justify-between items-center px-8 py-4 border border-outline-variant/10">
        <div className="text-2xl font-bold text-on-surface italic font-headline tracking-tighter">
          Studio.Dev
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="/#home">Home</Link>
          <Link className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="/#bio">Bio</Link>
          <Link className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="/#skills">Skills</Link>
          <Link className="text-primary font-bold underline decoration-2 underline-offset-8 font-label text-sm transition-colors duration-300" href="/#projects">Projects</Link>
        </div>
        <a 
          href={`mailto:${profile?.email}`}
          className="bg-primary hover:bg-primary-dim text-on-primary px-5 py-2.5 rounded-xl font-label text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          Get in Touch
        </a>
      </nav>

      <main className="pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
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
              href="/#projects"
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

        {/* Main Featured Image */}
        <section className="mb-24 relative">
          <div
            className="relative w-full aspect-[21/9] overflow-hidden rounded-lg bg-surface-container shadow-2xl featured-image-container cursor-pointer group"
            onClick={() => setLightboxImage(project.thumbnail)}
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
              src={project.thumbnail}
              alt={project.title}
            />
            {/* Zoom hint icon */}
            <div className="featured-zoom-hint absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
                <ArrowUpRight className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </section>

        {/* Project Story & Tech Stack */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32 items-start relative">
          {/* Simple geometric accent */}
          <div className="absolute -right-20 -bottom-20 opacity-[0.04] pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="200,20 360,110 360,270 200,360 40,270 40,110" stroke="var(--color-tertiary)" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="md:col-span-7 pr-0 lg:pr-12">
            <h2 className="font-headline text-2xl font-bold mb-8 uppercase tracking-widest text-on-surface-variant/50">
              The Narrative
            </h2>
            <div className="font-body text-lg md:text-xl text-on-surface leading-relaxed space-y-6">
              <p className="whitespace-pre-wrap">
                {project.description}
              </p>
              <p>
                In the digital landscape of 2024, scalability is no longer a luxury—it's a survival requirement.
                The {project.title} project began as a challenge to rethink how distributed systems handle state
                across disparate geographic zones without compromising the developer experience.
              </p>
            </div>
          </div>
          <aside className="md:col-span-5 bg-surface-container p-8 md:p-12 rounded-lg">
            <h3 className="font-headline text-lg font-bold mb-8 uppercase tracking-widest">Technical Stack</h3>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Core Engine</span>
                <p className="font-label font-bold text-on-surface">React / TypeScript</p>
              </div>
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Development</span>
                <p className="font-label font-bold text-on-surface">Next.js / Tailwind CSS</p>
              </div>
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Supabase</span>
                <p className="font-label font-bold text-on-surface">PostgreSQL / Auth / Storage</p>
              </div>
            </div>
            <div className="mt-12 pt-12 border-t border-outline-variant/15">
              <h4 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">Key Metrics</h4>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <span className="font-body italic text-on-surface-variant">Performance</span>
                  <span className="font-headline font-bold text-primary text-xl">Lighthouse 100</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-body italic text-on-surface-variant">Responsive</span>
                  <span className="font-headline font-bold text-primary text-xl">Universal</span>
                </li>
              </ul>
            </div>
          </aside>
        </section>

        {/* Project Gallery */}
        {project.project_images && project.project_images.length > 0 && (
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
              {project.project_images.map((image: any, index: number) => {
                const isWide = index === 0 || index === 3;
                const colSpan = isWide ? "md:col-span-8" : "md:col-span-4";

                return (
                  <div
                    key={image.id}
                    className={`${colSpan} gallery-item-${index} overflow-hidden rounded-lg bg-surface-container-low shadow-md cursor-pointer`}
                    onClick={() => setLightboxImage(image.name)}
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
        )}

        {/* Navigation Footer */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-8 relative">

          <div className="w-full md:w-auto"></div>

          <div className="text-center md:text-right w-full md:w-auto">
             <button
              onClick={scrollToTop}
              className="font-headline text-3xl font-bold text-on-surface hover:text-primary transition-all duration-300 flex items-center gap-4 justify-end w-full group"
            >
              <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">Back to top</span>
              <ArrowUp className="w-8 h-8 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15 relative">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="font-label text-xs uppercase tracking-widest text-outline relative z-10">
          © {new Date().getFullYear()} Monograph Studio. Built with Intent.
        </div>
        <div className="flex items-center space-x-8 relative z-10">
          {profile?.github && <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href={profile.github}>Github</a>}
          {profile?.linkedin && <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href={profile.linkedin}>LinkedIn</a>}
          <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href="#">Source</a>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxImage(null)}
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
              setLightboxImage(null);
            }}
            className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={lightboxImage}
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
      )}
    </div>
  );
}
