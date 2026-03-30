"use client";

import { useState, useEffect } from "react";
import { PortfolioTopbar, PortfolioFooter } from "@/components/portfolio";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { BioSection } from "@/components/portfolio/BioSection";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { SkillsGrid } from "@/components/portfolio/SkillsGrid";
import { ProjectsBentoGrid } from "@/components/portfolio/ProjectsBentoGrid";
import { CertificatesGrid } from "@/components/portfolio/CertificatesGrid";
import { BackgroundDecorations } from "@/components/portfolio/BackgroundDecorations";
import { CVPreviewModal } from "@/components/portfolio/CVPreviewModal";
import { PortfolioSkeleton } from "@/components/portfolio/PortfolioSkeleton";
import { useActiveProfile } from "@/hooks/useActiveProfile";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHashNavigation } from "@/hooks/useHashNavigation";

export default function Home() {
  const { profile, loading } = useActiveProfile();
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  const sectionIds = ["home", "bio", "experience", "skills", "certificates", "projects"];
  const activeSection = useActiveSection(sectionIds);

  useHashNavigation(loading);

  // Handle session storage scroll (e.g., from "Back to Projects" button)
  useEffect(() => {
    if (!loading) {
      const scrollToSection = sessionStorage.getItem('scrollToSection');
      if (scrollToSection && sectionIds.includes(scrollToSection)) {
        setTimeout(() => {
          const element = document.getElementById(scrollToSection);
          if (element) {
            const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            // Clean up session storage after scroll
            setTimeout(() => {
              sessionStorage.removeItem('scrollToSection');
            }, 1500);
          }
        }, 300);
      }
    }
  }, [loading, sectionIds]);

  if (loading) {
    return <PortfolioSkeleton />;
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
      <BackgroundDecorations />
      <PortfolioTopbar profile={profile} activeSection={activeSection} />

      <HeroSection profile={profile} />
      <BioSection profile={profile} onCvModalOpen={() => setIsCvModalOpen(true)} />
      <ExperienceTimeline workExperience={profile.work_experience || []} />
      <SkillsGrid skills={profile.skills || []} />
      <CertificatesGrid certificates={profile.certificates || []} />
      <ProjectsBentoGrid projects={profile.projects || []} />
      <PortfolioFooter profile={profile} />
      <CVPreviewModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        cvUrl={cvUrl}
        profileName={profile.name}
      />
    </div>
  );
}
