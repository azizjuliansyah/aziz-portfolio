"use client";

import { useEffect, useState } from "react";
import { Profile } from "@/types/profile";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { 
  Mail, Phone, MapPin, Globe, Github, Linkedin, Instagram, Twitter, 
  FileText, Briefcase, Eye, Download, ExternalLink, Code, User, Calendar
} from "lucide-react";

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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
        <div className="w-full max-w-4xl space-y-12">
          <div className="space-y-4">
            <Skeleton width={120} height={20} />
            <Skeleton className="w-full max-w-lg" height={48} />
            <Skeleton className="w-full max-w-md" height={24} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="md:col-span-2 h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-500">
          <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">No portfolio is currently live</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-xs mx-auto">Please set a profile as active in your dashboard to display it here.</p>
        </div>
      </div>
    );
  }

  const cvUrl = profile.cv ? (typeof profile.cv === "string" ? profile.cv : URL.createObjectURL(profile.cv)) : null;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-4 md:p-8 selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <main className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="relative h-40 md:h-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800">
             {/* Decorative element */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
             
             <div className="absolute -bottom-20 left-8 md:left-16">
                <div className="relative w-36 h-36 md:w-48 h-48 rounded-3xl overflow-hidden border-[6px] border-white dark:border-zinc-900 shadow-2xl bg-gray-100 dark:bg-zinc-800 transition-transform hover:scale-[1.02] duration-500">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar as string}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-800">
                      <span className="text-5xl text-gray-300 font-black">{profile.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="pt-24 pb-12 px-8 md:px-16">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {profile.title}
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {profile.location && (
                    <div className="flex items-center gap-2 group transition-colors">
                      <MapPin className="w-4 h-4 text-blue-500" /> 
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.email && (
                    <div className="flex items-center gap-2">
                       <Mail className="w-4 h-4 text-blue-500" />
                       <a href={`mailto:${profile.email}`} className="hover:text-blue-600 transition-colors underline decoration-blue-500/30 underline-offset-4">{profile.email}</a>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {profile.cv && (
                  <Button 
                    onClick={() => setIsCvModalOpen(true)} 
                    variant="outline" 
                    leftIcon={FileText}
                    className="rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    View Curriculum Vitae
                  </Button>
                )}
                <div className="flex gap-2">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-gray-900 text-white hover:bg-black transition-all hover:-translate-y-1 shadow-md" title="GitHub">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-[#0077b5] text-white hover:brightness-110 transition-all hover:-translate-y-1 shadow-md" title="LinkedIn">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* About Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Background</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium font-serif italic border-l-4 border-blue-500 pl-6 py-2">
                {profile.bio || "No background story provided yet. Stay tuned for updates!"}
              </p>
            </section>

            {/* Skills Section */}
            {profile.skills && profile.skills.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Expertise</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skills.map((skill: any) => (
                    <div key={skill.id} className="group p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-zinc-800 p-1">
                          <img src={skill.image} alt={skill.title} className="w-full h-full object-cover rounded-xl" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{skill.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{skill.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {profile.projects && profile.projects.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm">Featured Work</h2>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {profile.projects.map((project: any) => (
                    <div key={project.id} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
                      <div className="grid md:grid-cols-5 gap-0">
                        <div className="md:col-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden">
                          <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <span className="text-white text-xs font-bold uppercase tracking-widest">{project.info || "Visual Case Study"}</span>
                          </div>
                        </div>
                        <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-between space-y-4">
                          <div className="space-y-3">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{project.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 font-medium">
                              {project.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500">
                              <Calendar className="w-3.5 h-3.5" /> 
                              {new Date(project.created_at).getFullYear()}
                            </div>
                            {project.link && (
                              <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-zinc-800 hover:bg-blue-600 hover:text-white text-gray-900 dark:text-white rounded-2xl transition-all font-bold text-sm">
                                Explore Live <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="p-8 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="relative z-10 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black">Let's build something exceptional together.</h3>
                    <p className="text-indigo-100/70 font-medium leading-relaxed">
                      Always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <a href={`mailto:${profile.email}`} className="flex items-center justify-center w-full py-4 bg-white text-blue-900 rounded-2xl transition-all font-extrabold shadow-xl hover:-translate-y-1 active:scale-95">
                      Get In Touch
                    </a>
                  </div>
               </div>
            </div>

            {/* Quick Summary / Status */}
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 space-y-6">
               <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Current Status</h4>
               <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Available for Freelance</span>
                  </div>
                  {profile.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium pb-4 border-b border-gray-50 dark:border-zinc-800">
                      <MapPin className="w-4 h-4 text-blue-500" /> Based in {profile.location}
                    </div>
                  )}
                    <div className="space-y-3">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Follow my updates</p>
                      <div className="flex flex-wrap gap-2">
                         {profile.instagram && <a href={profile.instagram} className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-pink-600 transition-colors" title="Instagram"><Instagram className="w-4 h-4" /></a>}
                         {profile.twitter && <a href={profile.twitter} className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-blue-400 transition-colors" title="Twitter"><Twitter className="w-4 h-4" /></a>}
                         {profile.social_links?.map((link: any) => (
                           <a 
                             key={link.id} 
                             href={link.link} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                             title={link.name}
                           >
                             {link.image ? (
                               <img src={link.image} alt={link.name} className="w-4 h-4 object-contain grayscale group-hover:grayscale-0 transition-all" />
                             ) : (
                               <Globe className="w-4 h-4" />
                             )}
                             <span className="sr-only">{link.name}</span>
                           </a>
                         ))}
                      </div>
                      {(!profile.instagram && !profile.twitter && (!profile.social_links || profile.social_links.length === 0)) && (
                        <p className="text-xs text-gray-400 italic">No social links provided.</p>
                      )}
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 pb-12 border-t border-gray-100 dark:border-zinc-900 pt-12 flex flex-col items-center gap-6 max-w-5xl mx-auto">
        <div className="flex gap-8 text-sm font-black uppercase tracking-widest text-gray-400">
          <a href="#" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Projects</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-400 text-sm font-medium italic">© {new Date().getFullYear()} {profile.name}. Handcrafted with precision.</p>
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-full border border-emerald-100 dark:border-emerald-800/30">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
             <span className="text-[10px] uppercase font-black tracking-widest text-emerald-700 dark:text-emerald-400">Live Production Profile</span>
          </div>
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
            <div className="w-full aspect-[1/1.4] sm:aspect-[1/1.2] md:aspect-video rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
              {cvUrl.toLowerCase().endsWith('.pdf') || (profile.cv instanceof File && profile.cv.type === 'application/pdf') ? (
                <iframe src={cvUrl} className="w-full h-[60vh] md:h-[70vh]" title="CV Preview" />
              ) : (
                <img src={cvUrl} alt="CV Preview" className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain shadow-2xl" />
              )}
            </div>
          )}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-zinc-800">
            <p className="text-sm text-gray-500 font-medium">Reviewing {profile.name}'s professional history</p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={() => setIsCvModalOpen(false)} className="rounded-xl">
                Close
              </Button>
              {cvUrl && (
                <a href={cvUrl} download={`CV_${profile.name.replace(/\s+/g, '_')}`}>
                   <Button type="button" leftIcon={Download} className="rounded-xl shadow-lg shadow-blue-500/20">
                     Download PDF
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
