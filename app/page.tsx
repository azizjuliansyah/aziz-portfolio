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
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container font-body">
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
          <div className="md:col-span-5 relative animate-in fade-in zoom-in duration-1000">
            <div className="aspect-[4/5] bg-surface-container rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(18,74,240,0.06)] transform rotate-2 hover:rotate-0 transition-transform duration-700">
              {profile.avatar ? (
                <img 
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src={profile.avatar}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                  <span className="text-8xl text-outline opacity-20 font-headline">{profile.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </header>

      {/* Bio & Social Section */}
      <section className="py-24 bg-surface-container-low" id="bio">
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid md:grid-cols-12 gap-16">
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
      <section className="py-24 bg-surface" id="experience">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
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
      <section className="py-24 bg-surface-container-low" id="skills">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
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
      <section className="py-24 bg-surface" id="projects">
        <div className="max-w-7xl mx-auto px-6 md:px-20">
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
                  className={`${colSpan} group relative overflow-hidden bg-surface-container-lowest rounded-lg ${height} shadow-sm hover:shadow-xl transition-all duration-500`}
                >
                  <img 
                    alt={project.title}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                    src={project.thumbnail}
                  />
                  <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-surface-container via-transparent/20 to-transparent">
                    <p className="font-label text-xs font-bold uppercase tracking-widest text-primary mb-2">
                      {project.info || "Visual Case Study"}
                    </p>
                    <h3 className="font-headline text-4xl font-bold mb-4">{project.title}</h3>
                    <p className="font-body text-lg text-on-surface-variant max-w-md mb-6 line-clamp-2">
                      {project.description}
                    </p>
                    <a className="text-on-surface font-label font-bold flex items-center gap-2 group/link" href={`/projects/${project.id}`}>
                      Case Study
                      <ArrowRight className="w-5 h-5 text-primary group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-outline-variant/15">
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
