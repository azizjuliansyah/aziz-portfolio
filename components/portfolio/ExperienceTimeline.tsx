"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

interface ExperienceTimelineProps {
  workExperience: Array<{
    id: string | number;
    position: string;
    company_name: string;
    start_date: string;
    end_date: string;
    responsibilities?: Array<{
      id: string | number;
      responsibility: string;
    }>;
  }>;
}

export function ExperienceTimeline({ workExperience }: ExperienceTimelineProps) {
  return (
    <section className="py-24 px-6 md:px-20 bg-surface relative overflow-hidden" id="experience">
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

      <ScrollReveal variant="slideUp">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Professional History</h2>
          </div>

          <div className="max-w-4xl space-y-8 border-l border-outline-variant/30 pl-8 ml-4 relative">
            {workExperience?.map((exp, index) => (
              <ScrollReveal key={exp.id} variant="fadeIn" delay={index * 150}>
                <div className="relative group/exp">
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
                        {exp.responsibilities.map((res) => (
                          <li key={res.id} className="flex items-start gap-3 hover:text-on-surface transition-colors duration-200">
                            <span className="text-primary/60 mt-1.5 flex-shrink-0"><ArrowRight className="w-4 h-4"/></span>
                            <span>{res.responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}

          {!workExperience?.length && (
            <div className="py-12 text-outline italic font-body">Professional history will be documented soon.</div>
          )}
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}
