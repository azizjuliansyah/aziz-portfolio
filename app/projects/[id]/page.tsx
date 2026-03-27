"use client";

import { useEffect, useState, use } from "react";
import { 
  ArrowLeft, ArrowUpRight, Github, Linkedin, Twitter, 
  Terminal, Layers, Database, Cloud, Palette, Shield, Info, ArrowRight, ArrowUp
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body">
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

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Hero Section */}
        <header className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 items-end">
          <div className="md:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-outline px-3 py-1 bg-surface-container rounded-full">
                {project.info || "Engineering & Design"}
              </span>
              <span className="font-label text-xs uppercase tracking-[0.2em] text-primary font-bold">
                {new Date(project.created_at).getFullYear()}
              </span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter text-on-surface mb-8 leading-[0.9]">
              {project.title}.
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed max-w-2xl italic">
              {project.description}
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end items-start md:items-end gap-6 pb-2">
            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <span className="font-label font-bold text-sm text-primary uppercase tracking-widest">Live Prototype</span>
                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </a>
            )}
          </div>
        </header>

        {/* Main Featured Image */}
        <section className="mb-24">
          <div className="relative w-full aspect-[21/9] overflow-hidden rounded-lg bg-surface-container shadow-2xl">
            <img 
              className="w-full h-full object-cover"
              src={project.thumbnail}
              alt={project.title}
            />
          </div>
        </section>

        {/* Project Story & Tech Stack */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-32 items-start">
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
          <section className="mb-32">
            <h2 className="font-headline text-2xl font-bold mb-12 uppercase tracking-widest text-on-surface-variant/50 text-center">
              Visual Deep-Dive
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px] md:auto-rows-[400px]">
              {project.project_images.map((image: any, index: number) => {
                const isWide = index === 0 || index === 3;
                const colSpan = isWide ? "md:col-span-8" : "md:col-span-4";
                
                return (
                  <div key={image.id} className={`${colSpan} overflow-hidden rounded-lg bg-surface-container-low group shadow-md hover:shadow-xl transition-shadow duration-500`}>
                    <img 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      src={image.name}
                      alt={image.name}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Navigation Footer */}
        <section className="flex flex-col md:flex-row justify-between items-center py-20 border-t border-outline-variant/15 gap-8">
          <div className="text-left w-full md:w-auto">
            <span className="font-label text-[10px] uppercase tracking-widest text-outline block mb-2">Back to projects</span>
            <Link className="font-headline text-3xl font-bold hover:text-primary transition-colors flex items-center gap-4" href="/#projects">
              <ArrowLeft className="w-8 h-8" /> Overview
            </Link>
          </div>
          <div className="text-center md:text-right w-full md:w-auto">
             <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-headline text-3xl font-bold hover:text-primary transition-colors flex items-center gap-4 justify-end w-full"
            >
              Back to top <ArrowUp className="w-8 h-8" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15">
        <div className="font-label text-xs uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} Monograph Studio. Built with Intent.
        </div>
        <div className="flex items-center space-x-8">
          {profile?.github && <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href={profile.github}>Github</a>}
          {profile?.linkedin && <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href={profile.linkedin}>LinkedIn</a>}
          <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href="#">Source</a>
        </div>
      </footer>
    </div>
  );
}
