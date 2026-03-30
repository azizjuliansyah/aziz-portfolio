"use client";

import { Mail, Phone, MapPin, Download } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface BioSectionProps {
  profile: {
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    social_links?: Array<{
      id: string | number;
      name: string;
      link: string;
      image?: string | null;
    }>;
    cv?: string | null;
    bio?: string | null;
  };
  onCvModalOpen: () => void;
}

export function BioSection({ profile, onCvModalOpen }: BioSectionProps) {
  return (
    <section className="py-24 px-6 md:px-20 bg-surface-container-low relative overflow-hidden" id="bio">
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
      <ScrollReveal variant="slideUp">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-16 relative z-10 ">
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
              {profile.social_links?.map((social) => (
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
              onClick={onCvModalOpen}
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
      </ScrollReveal>
    </section>
  );
}
