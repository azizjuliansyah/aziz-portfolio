"use client";

import { use } from "react";
import Link from "next/link";
import { useProjectWithProfile } from "@/hooks/useProjectWithProfile";
import { useLightbox } from "@/hooks/useLightbox";
import { PortfolioTopbar, PortfolioFooter } from "@/components/portfolio";
import { ProjectHero } from "@/components/portfolio/ProjectHero";
import { ProjectFeaturedImage } from "@/components/portfolio/ProjectFeaturedImage";
import { ProjectDetails } from "@/components/portfolio/ProjectDetails";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectLightbox } from "@/components/portfolio/ProjectLightbox";
import { ScrollToTop } from "@/components/portfolio/ScrollToTop";
import { ProjectDetailSkeleton } from "@/components/portfolio/ProjectDetailSkeleton";

export default function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { project, profile, loading } = useProjectWithProfile(id);
  const { lightboxImage, setLightboxImage } = useLightbox();

  if (loading) {
    return <ProjectDetailSkeleton />;
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
      <PortfolioTopbar profile={profile} activeSection="projects" />

      <main className="pt-24 pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <ProjectHero project={project} />
        <ProjectFeaturedImage
          thumbnail={project.thumbnail}
          title={project.title}
          onImageClick={setLightboxImage}
        />
        <ProjectDetails project={project} />
        {project.project_images && project.project_images.length > 0 && (
          <ProjectGallery
            images={project.project_images}
            onImageClick={setLightboxImage}
          />
        )}
        <ScrollToTop />
      </main>

      {/* Footer */}
      <PortfolioFooter profile={profile} />

      {/* Lightbox Modal */}
      <ProjectLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
