"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { 
  Mail, Phone, MapPin, Download, ExternalLink, Github, Linkedin, Twitter, 
  Terminal, Layers, Database, Cloud, Palette, Shield, Info, ArrowRight
} from "lucide-react";

const skillIconMap: Record<string, any> = {
  "Core Systems": Terminal,
  "Frontend Craft": Layers,
  "Data Persistence": Database,
  "Infrastructure": Cloud,
  "UI/UX Systems": Palette,
  "Cyber Security": Shield,
};

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);

  useEffect(() => {
    const fetchActiveProfile = async () => {
      try {
        const res = await fetch("/api/public/profile");
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch active profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProfile();
  }, []);

  // Handle hash navigation for direct links and refresh
  useEffect(() => {
    if (!loading) {
      const scrollToHash = (hash: string) => {
        // Use requestAnimationFrame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          const element = document.getElementById(hash);
          if (element) {
            // Custom smooth scroll with easing
            const startPosition = window.pageYOffset;
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80; // 80px offset for fixed nav
            const distance = targetPosition - startPosition;
            const duration = 1000; // 1 second
            let startTimestamp: number | null = null;

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
          }
        });
      };

      // Check for initial hash on page load/refresh
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        scrollToHash(hash);
      }

      // Listen for hash changes (when clicking nav links)
      const handleHashChange = () => {
        const newHash = window.location.hash.replace('#', '');
        if (newHash) {
          // Small delay to ensure any navigation has completed
          setTimeout(() => scrollToHash(newHash), 100);
        }
      };

      window.addEventListener('hashchange', handleHashChange);

      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-surface-container-high rounded-full"></div>
          <div className="h-4 w-32 bg-surface-container-high rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center p-8">
          <h1 className="text-2xl font-headline font-bold text-on-surface">No profile is currently live</h1>
          <p className="text-on-surface-variant mt-2 font-body italic">Please set a profile as active in your dashboard.</p>
        </div>
      </div>
    );
  }

  const cvUrl = profile.cv ? (typeof profile.cv === "string" ? profile.cv : URL.createObjectURL(profile.cv)) : null;

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body relative overflow-hidden">
      
      {/* Global Decorative Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Ambient Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px] mix-blend-screen" />
        <div className="absolute top-[30%] left-[-15%] w-[500px] h-[500px] rounded-full bg-tertiary/20 mix-blend-screen blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[800px] h-[800px] rounded-full bg-secondary/15 blur-[200px] mix-blend-screen" />
        
        {/* Prominent Geometric Floating Accents */}
        {/* 1. Large Hollow Circle */}
        <div className="absolute top-[25%] right-[30%] w-64 h-64 border-[6px] border-primary/40 rounded-full animate-float shadow-[0_0_40px_rgba(var(--color-primary),0.2)] backdrop-blur-3xl" />
        
        {/* 2. Rotating Square with Glassmorphism */}
        <div className="absolute bottom-[-8%] left-[-4%] w-56 h-56 border border-on-surface/20 bg-surface/30 backdrop-blur-xl rotate-45 animate-float-reverse shadow-2xl flex items-center justify-center">
            <div className="w-24 h-24 border-[3px] border-primary/50 rotate-45" />
        </div>
        
        {/* 3. Bold Glowing Cross */}
        <div className="absolute top-[45%] left-[9%] flex items-center justify-center animate-spin-slow">
          <div className="absolute w-40 h-[4px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(var(--color-primary),0.6)] rounded-full" />
          <div className="absolute h-40 w-[4px] bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(var(--color-primary),0.6)] rounded-full" />
        </div>
        
        {/* 4. Prominent Dot Grid */}
        <div className="absolute bottom-[10%] right-[-2%] grid grid-cols-4 gap-6 animate-float opacity-80">
           {[...Array(24)].map((_, i) => (
             <div key={i} className="w-2 h-2 rounded-full bg-primary/60 shadow-[0_0_15px_rgba(var(--color-primary),0.4)]" />
           ))}
        </div>
        
        {/* 5. Intersecting Rings */}
        <div className="absolute top-[0%] left-[10%] opacity-60 animate-spin-slow">
           <svg width="250" height="250" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
             <circle cx="125" cy="125" r="80" stroke="var(--color-tertiary)" strokeWidth="3" fill="none" strokeDasharray="12 12" />
             <circle cx="125" cy="125" r="105" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.5" />
           </svg>
        </div>
      </div>

      {/* Grid Pattern Overlay (Soft Line Grid) - theme-adaptive */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.35]"
        style={{ 
          backgroundImage: "linear-gradient(var(--color-outline) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }}
      ></div>

      {/* TopAppBar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl rounded-2xl bg-surface/80 backdrop-blur-xl shadow-xl z-50 flex justify-between items-center px-8 py-4 border border-outline-variant/10">
        <div className="text-2xl font-bold text-on-surface italic font-headline tracking-tighter">
          Studio.Dev
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a className="text-primary font-bold underline decoration-2 underline-offset-8 font-label text-sm transition-colors duration-300" href="#home">Home</a>
          <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="#bio">Bio</a>
          <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="#experience">Experience</a>
          <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="#skills">Skills</a>
          <a className="text-on-surface/70 font-medium hover:text-primary transition-colors duration-300 font-label text-sm" href="#projects">Projects</a>
        </div>
        <a 
          href={`mailto:${profile.email}`}
          className="bg-primary hover:bg-primary-dim text-on-primary px-5 py-2.5 rounded-xl font-label text-sm font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          Get in Touch
        </a>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-20 pt-24 overflow-hidden" id="home">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10 transition-all"></div>
        <div className="w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 z-10">
            <p className="font-label uppercase tracking-widest text-primary font-bold mb-4 opacity-80 animate-in fade-in slide-in-from-left-4 duration-700">
              Architecture of Code
            </p>
            <h1 className="font-headline text-6xl md:text-8xl font-bold tracking-tighter text-on-surface leading-[0.9] mb-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              {profile.name.split(' ')[0]}<br />
              <span className="text-outline">{profile.name.split(' ').slice(1).join(' ')}</span>
            </h1>
            <h2 className="font-body italic text-2xl md:text-4xl text-on-surface-variant max-w-xl animate-in fade-in slide-in-from-left-12 duration-1000 delay-200">
              {profile.title}
            </h2>
          </div>
          <div
            className="md:col-span-5 relative animate-in fade-in zoom-in duration-1000"
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
          >
            {/* Card Stack Container */}
            <div className="relative aspect-[4/5] w-full">
              {/* Back Card 2 - Tertiary tint, farthest */}
              <div
                style={{
                  transitionProperty: 'transform, box-shadow',
                  transitionDuration: '900ms',
                  transitionDelay: avatarHovered ? '60ms' : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: avatarHovered
                    ? 'rotate(14deg) translateX(52px) translateY(20px)'
                    : 'rotate(6deg) translateX(24px) translateY(12px)',
                  boxShadow: avatarHovered
                    ? '8px 20px 60px rgba(0,0,0,0.14)'
                    : '4px 8px 30px rgba(0,0,0,0.08)',
                }}
                className="absolute inset-0 rounded-2xl bg-tertiary/20 border border-tertiary/30"
              />
              {/* Back Card 1 - Primary tint, middle */}
              <div
                style={{
                  transitionProperty: 'transform, box-shadow',
                  transitionDuration: '700ms',
                  transitionDelay: avatarHovered ? '30ms' : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: avatarHovered
                    ? 'rotate(7deg) translateX(26px) translateY(12px)'
                    : 'rotate(3deg) translateX(12px) translateY(6px)',
                  boxShadow: avatarHovered
                    ? '6px 14px 40px rgba(18,74,240,0.14)'
                    : '4px 8px 24px rgba(0,0,0,0.06)',
                }}
                className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
              />
              {/* Main Photo Card - front */}
              <div
                style={{
                  transitionProperty: 'transform, box-shadow',
                  transitionDuration: '600ms',
                  transitionDelay: '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: avatarHovered
                    ? 'rotate(-1.5deg) translateY(-12px)'
                    : 'rotate(0deg) translateY(0px)',
                  boxShadow: avatarHovered
                    ? '0 40px 90px rgba(18,74,240,0.22), 0 10px 30px rgba(0,0,0,0.13)'
                    : '0 20px 60px rgba(18,74,240,0.12), 0 4px 16px rgba(0,0,0,0.08)',
                }}
                className="absolute inset-0 rounded-2xl overflow-hidden bg-surface-container"
              >
                {profile.avatar ? (
                  <img
                    alt={profile.name}
                    style={{
                      transitionProperty: 'transform, filter',
                      transitionDuration: '800ms',
                      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: avatarHovered ? 'scale(1.05)' : 'scale(1)',
                      filter: avatarHovered ? 'grayscale(0%)' : 'grayscale(100%)',
                    }}
                    className="w-full h-full object-cover"
                    src={profile.avatar}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                    <span className="text-8xl text-outline opacity-20 font-headline">{profile.name.charAt(0)}</span>
                  </div>
                )}
                {/* Subtle inner vignette on hover */}
                <div
                  style={{
                    transitionProperty: 'opacity',
                    transitionDuration: '800ms',
                    transitionTimingFunction: 'ease-out',
                    opacity: avatarHovered ? 1 : 0,
                  }}
                  className="absolute inset-0 bg-gradient-to-t from-surface/30 via-transparent to-transparent pointer-events-none"
                />
              </div>
            </div>
            {/* Extended Hero Decor */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/30 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            <div className="absolute top-10 -right-10 w-48 h-48 bg-secondary/30 rounded-full blur-[90px] -z-10"></div>
          </div>
        </div>
      </header>

      {/* Bio & Social Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden" id="bio">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>

        {/* Blueprint Dot Grid */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-outline) 1.2px, transparent 1.2px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Corner accent - bottom right decorative bracket */}
        <div className="absolute bottom-10 right-10 pointer-events-none opacity-30">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M120 0 L120 120 L0 120" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" />
            <path d="M110 10 L110 110 L10 110" stroke="var(--color-tertiary)" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
        </div>
        {/* Top-left label accent */}
        <div className="absolute top-10 left-10 pointer-events-none opacity-25">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120 L0 0 L120 0" stroke="var(--color-primary)" strokeWidth="2.5" fill="none" />
            <path d="M10 110 L10 10 L110 10" stroke="var(--color-tertiary)" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-12 gap-16 relative z-10">
          <div className="md:col-span-4 space-y-12">
            <div className="space-y-6">
              <h3 className="font-label text-xs uppercase tracking-[0.3em] text-outline">Contact Details</h3>
              <ul className="space-y-4 font-label text-sm font-semibold">
                {profile.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    {profile.email}
                  </li>
                )}
                {profile.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    {profile.phone}
                  </li>
                )}
                {profile.location && (
                  <li className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    {profile.location}
                  </li>
                )}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="font-label text-xs uppercase tracking-[0.3em] text-outline">Social Graph</h3>
              <div className="flex flex-wrap gap-4">
                {profile.social_links?.map((social: any) => (
                  <a 
                    key={social.id} 
                    href={social.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm overflow-hidden p-2 group hover:-translate-y-1 hover:shadow-md"
                  >
                    {social.image ? (
                      <img 
                        src={social.image} 
                        alt={social.name} 
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" 
                      />
                    ) : (
                      <span className="font-bold text-lg">{social.name.charAt(0).toUpperCase()}</span>
                    )}
                  </a>
                ))}
                {!profile.social_links?.length && (
                  <span className="text-sm text-outline italic">No social links provided.</span>
                )}
              </div>
            </div>
            {profile.cv && (
              <button 
                onClick={() => setIsCvModalOpen(true)}
                className="inline-flex items-center gap-3 font-label text-sm font-bold text-primary px-5 py-3 rounded-xl hover:bg-primary/10 transition-colors group border border-transparent hover:border-primary/20"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Preview Curriculum Vitae
                <span className="w-8 h-px bg-primary group-hover:w-16 transition-all duration-300 ml-2"></span>
              </button>
            )}
          </div>
          <div className="md:col-span-8">
            <h3 className="font-headline text-4xl mb-8 leading-tight">
              Crafting the <span className="italic font-body">unseen infrastructure</span> of modern digital monographs.
            </h3>
            <div className="space-y-6 font-body text-xl text-on-surface-variant leading-relaxed">
              <p className="whitespace-pre-wrap">
                {profile.bio || "With over a decade of experience, I approach software through the lens of architectural minimalism. I believe a codebase should be as intentional as a structural blueprint, prioritizing longevity over ephemeral trends."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-surface relative overflow-hidden" id="experience">
        {/* Diagonal Stripe Pattern (right half) */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(-45deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 20px)",
          }}
        />
        {/* Concentric Circle Rings */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-30 -z-10">
          <svg width="700" height="700" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="350" cy="350" r="320" stroke="var(--color-primary)" strokeWidth="1" strokeDasharray="8 16" />
            <circle cx="350" cy="350" r="240" stroke="var(--color-tertiary)" strokeWidth="1.5" strokeDasharray="4 12" />
            <circle cx="350" cy="350" r="160" stroke="var(--color-primary)" strokeWidth="1" opacity="0.5" />
            <circle cx="350" cy="350" r="80" stroke="var(--color-tertiary)" strokeWidth="2" opacity="0.4" />
            <circle cx="350" cy="350" r="8" fill="var(--color-primary)" opacity="0.4" />
          </svg>
        </div>
        {/* Top section label */}
        <div className="absolute top-8 left-8 opacity-20 pointer-events-none font-label text-[10px] tracking-[0.4em] uppercase text-primary font-bold">// professional_history.timeline</div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Professional History</h2>
          </div>
          
          <div className="max-w-4xl space-y-8 border-l border-outline-variant/30 pl-8 ml-4 relative">
            {profile.work_experience?.map((exp: any, i: number) => (
              <div key={exp.id} className="relative group/exp">
                {/* Timeline Dot */}
                <span className="absolute -left-[41px] top-6 w-5 h-5 rounded-full bg-surface border-[4px] border-primary group-hover/exp:scale-125 transition-transform duration-300 z-10 shadow-[0_0_0_4px_rgba(var(--surface-container-low))]"></span>
                
                <div className="bg-surface-container-low rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">{exp.position}</h3>
                      <p className="font-label text-base text-primary font-bold">{exp.company_name}</p>
                    </div>
                    <div className="text-on-surface-variant font-label text-xs font-semibold whitespace-nowrap bg-surface-container-high px-3 py-1.5 rounded-lg inline-block self-start w-fit shadow-sm border border-outline/5">
                      {exp.start_date} — {exp.end_date}
                    </div>
                  </div>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="space-y-2.5 font-body text-base text-on-surface-variant leading-relaxed list-none">
                      {exp.responsibilities.map((res: any) => (
                        <li key={res.id} className="flex items-start gap-3 hover:text-on-surface transition-colors duration-200">
                          <span className="text-primary/60 mt-1.5 flex-shrink-0"><ArrowRight className="w-4 h-4"/></span>
                          <span>{res.responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            
            {!profile.work_experience?.length && (
              <div className="py-12 text-outline italic font-body">Professional history will be documented soon.</div>
            )}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden" id="skills">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline/10 to-transparent"></div>

        {/* Large Hex / Polygon Background Graphic */}
        <div className="absolute -right-24 -bottom-24 opacity-[0.06] pointer-events-none">
          <svg width="560" height="560" viewBox="0 0 560 560" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="280,20 520,150 520,410 280,540 40,410 40,150" stroke="var(--color-primary)" strokeWidth="3" fill="var(--color-primary)" />
          </svg>
        </div>
        {/* Small hex accent top-left */}
        <div className="absolute -left-12 -top-12 opacity-[0.08] pointer-events-none">
          <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="140,10 260,75 260,205 140,270 20,205 20,75" stroke="var(--color-tertiary)" strokeWidth="2" fill="none" />
          </svg>
        </div>
        {/* Grid lines overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(var(--color-on-surface) 1px, transparent 1px), linear-gradient(90deg, var(--color-on-surface) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="font-headline text-5xl font-bold tracking-tight">The Toolkit</h2>
            <p className="font-label text-sm text-outline max-w-xs text-right">A curated selection of technologies utilized to build robust digital foundations.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16 pt-12">
            {profile.skills?.map((skill: any) => {
              const Icon = skillIconMap[skill.title] || Terminal;
              return (
                <div key={skill.id} className="flex flex-col items-center justify-end w-[80px] md:w-[100px] group cursor-default">
                  <div className="w-14 h-14 md:w-[72px] md:h-[72px] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110 mb-4">
                    {skill.image ? (
                      <img 
                        src={skill.image} 
                        alt={skill.title} 
                        className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300" 
                      />
                    ) : (
                      <Icon className="w-10 h-10 md:w-12 md:h-12 text-on-surface-variant group-hover:text-primary transition-colors duration-300" />
                    )}
                  </div>
                  <h4 className="font-label text-xs md:text-sm font-bold text-outline group-hover:text-on-surface transition-colors duration-300 text-center w-full truncate">
                    {skill.title}
                  </h4>
                </div>
              );
            })}
            {!profile.skills?.length && (
              <div className="w-full py-12 text-center text-outline italic font-body">No skills documented yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-24 bg-surface relative overflow-hidden" id="projects">
        {/* Abstract Corner Light */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-primary/5 to-transparent -z-10"></div>
        {/* Scan-line overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] -z-10"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, var(--color-on-surface) 0px, var(--color-on-surface) 1px, transparent 1px, transparent 6px)",
          }}
        />
        {/* Top-right corner bracket */}
        <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0 L80 0 L80 80" stroke="var(--color-primary)" strokeWidth="3" fill="none" />
          </svg>
        </div>
        {/* Bottom-left corner bracket */}
        <div className="absolute bottom-10 left-10 opacity-20 pointer-events-none">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M80 80 L0 80 L0 0" stroke="var(--color-primary)" strokeWidth="3" fill="none" />
          </svg>
        </div>
        {/* Subtle vertical label */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 opacity-15 pointer-events-none hidden md:block">
          <p className="font-label text-[10px] tracking-[0.5em] uppercase text-on-surface font-bold" style={{ writingMode: 'vertical-rl' }}>Selected Works</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">
          <h2 className="font-headline text-5xl font-bold mb-16">Selected Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {profile.projects?.map((project: any, index: number) => {
              const isLarge = index === 0 || index === 3;
              const colSpan = isLarge ? "md:col-span-8" : "md:col-span-4";
              const height = isLarge ? "h-[500px]" : "h-[500px]"; // Adjusted to match design
              
              if (index > 3) return null; // Limit to 4 for the bento grid

              return (
                <div
                  key={project.id}
                  className={`${colSpan} project-card-${project.id} relative overflow-hidden bg-surface-container-lowest rounded-lg ${height} shadow-sm`}
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
                  <img
                    alt={project.title}
                    className={`w-full h-full object-cover project-img-${project.id}`}
                    src={project.thumbnail}
                  />
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15 relative overflow-hidden">
        {/* Footer dot grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-outline) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient top bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="font-label text-xs uppercase tracking-widest text-outline">
          © {new Date().getFullYear()} Monograph Studio. Built with Intent.
        </div>
        <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
          {profile.social_links?.map((social: any) => (
            <a 
              key={social.id} 
              className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" 
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.name}
            </a>
          ))}
          <a className="font-label text-xs uppercase tracking-widest text-outline hover:text-on-surface transition-all" href="#">Source</a>
        </div>
      </footer>

      {/* CV Preview Modal */}
      <Modal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        title="Curriculum Vitae"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          {cvUrl && (
            <div className="w-full h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden border border-outline-variant/15 bg-surface-container-low relative shadow-inner">
              {cvUrl.toLowerCase().endsWith('.pdf') ? (
                <iframe src={cvUrl} className="w-full h-full object-fill absolute inset-0 border-none" title="CV Preview" />
              ) : (
                <img src={cvUrl} alt="CV Preview" className="w-full h-full object-contain p-4 shadow-2xl absolute inset-0" />
              )}
            </div>
          )}
          <div className="flex justify-between items-center pt-6 border-t border-outline-variant/15">
            <p className="text-sm text-on-surface-variant font-medium">Reviewing {profile.name}'s professional history</p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsCvModalOpen(false)} className="rounded-xl">
                Close
              </Button>
              {cvUrl && (
                <a href={cvUrl} download={`CV_${profile.name.replace(/\s+/g, '_')}`}>
                   <Button type="button" className="rounded-xl shadow-lg shadow-primary/20">
                     <Download className="w-4 h-4 mr-2" /> Download Document
                   </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
