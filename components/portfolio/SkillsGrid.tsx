"use client";

import { Terminal, Layers, Database, Cloud, Palette, Shield } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const skillIconMap: Record<string, any> = {
  "Core Systems": Terminal,
  "Frontend Craft": Layers,
  "Data Persistence": Database,
  "Infrastructure": Cloud,
  "UI/UX Systems": Palette,
  "Cyber Security": Shield,
};

interface SkillsGridProps {
  skills: Array<{
    id: string | number;
    title: string;
    image?: string | null;
  }>;
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <section className="py-24 px-6 md:px-20 bg-surface-container-low relative overflow-hidden" id="skills">
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
      <ScrollReveal variant="slideUp">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <h2 className="font-headline text-5xl font-bold tracking-tight">The Toolkit</h2>
            <p className="font-label text-sm text-outline max-w-xs text-right">A curated selection of technologies utilized to build robust digital foundations.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-16 pt-12">
            {skills?.map((skill, index) => {
              const Icon = skillIconMap[skill.title] || Terminal;
              return (
                <ScrollReveal key={skill.id} variant="scale" delay={index * 100}>
                  <div className="flex flex-col items-center justify-end w-[80px] md:w-[100px] group cursor-default">
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
              </ScrollReveal>
            );
          })}
          {!skills?.length && (
            <div className="w-full py-12 text-center text-outline italic font-body">No skills documented yet.</div>
          )}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}
