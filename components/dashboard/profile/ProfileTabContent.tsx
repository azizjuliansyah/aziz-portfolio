"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { Skill } from "@/types/skill";
import { Project, ProjectImage } from "@/types/project";
import { SocialLink } from "@/types/socialLink";
import { WorkExperience as Experience } from "@/types/experience";
import { Certificate } from "@/types/certificate";

// Component Imports
import { SkillCard } from "@/components/dashboard/skills/SkillCard";
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard";
import { SocialLinkCard } from "@/components/dashboard/social-links/SocialLinkCard";
import { ExperienceCard } from "@/components/dashboard/experience/ExperienceCard";
import { CertificateCard } from "@/components/dashboard/certificates/CertificateCard";

type ProfileTab = "basic" | "experience" | "skills" | "projects" | "social-links" | "certificates";

// Reusing centralized types instead of local interfaces

interface ProfileTabContentProps {
  activeTab: ProfileTab;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  socialLinks: SocialLink[];
  experiences: Experience[];
  onEditSkill: (skill: Skill) => void;
  onDeleteSkill: (id: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onEditCertificate: (certificate: Certificate) => void;
  onDeleteCertificate: (id: string) => void;
  onEditSocialLink: (link: SocialLink) => void;
  onDeleteSocialLink: (id: string) => void;
  onViewExperience: (exp: Experience) => void;
  onEditExperience: (exp: Experience) => void;
  onDeleteExperience: (id: string) => void;
  onReorderSkills: (event: DragEndEvent) => void;
  onReorderProjects: (event: DragEndEvent) => void;
  onReorderCertificates: (event: DragEndEvent) => void;
  onReorderSocialLinks: (event: DragEndEvent) => void;
  onReorderExperiences: (event: DragEndEvent) => void;
}

export function ProfileTabContent({
  activeTab,
  skills,
  projects,
  certificates,
  socialLinks,
  experiences,
  onEditSkill,
  onDeleteSkill,
  onEditProject,
  onDeleteProject,
  onEditCertificate,
  onDeleteCertificate,
  onEditSocialLink,
  onDeleteSocialLink,
  onViewExperience,
  onEditExperience,
  onDeleteExperience,
  onReorderSkills,
  onReorderProjects,
  onReorderCertificates,
  onReorderSocialLinks,
  onReorderExperiences,
}: ProfileTabContentProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const renderExperienceTab = () => (
    <div className="animate-in fade-in duration-300">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderExperiences}
      >
        <SortableContext items={experiences.map((e) => e.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                index={index}
                onView={() => onViewExperience(exp)}
                onEdit={() => onEditExperience(exp)}
                onDelete={() => onDeleteExperience(exp.id)}
              />
            ))}
            {experiences.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface-container-low border-outline/20">
                <p className="text-on-surface/50">No experiences added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  const renderSkillsTab = () => (
    <div className="animate-in fade-in duration-300">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderSkills}
      >
        <SortableContext items={skills.map((s) => s.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                index={index}
                onEdit={() => onEditSkill(skill)}
                onDelete={() => onDeleteSkill(skill.id)}
              />
            ))}
            {skills.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface-container-low border-outline/20">
                <p className="text-on-surface/50">No skills added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  const renderProjectsTab = () => (
    <div className="animate-in fade-in duration-300">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderProjects}
      >
        <SortableContext items={projects.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onEdit={() => onEditProject(project)}
                onDelete={() => onDeleteProject(project.id)}
              />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface-container-low border-outline/20">
                <p className="text-on-surface/50">No projects added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  const renderCertificatesTab = () => (
    <div className="animate-in fade-in duration-300">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderCertificates}
      >
        <SortableContext items={certificates.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert, index) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                index={index}
                onEdit={() => onEditCertificate(cert)}
                onDelete={() => onDeleteCertificate(cert.id)}
              />
            ))}
            {certificates.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface-container-low border-outline/20">
                <p className="text-on-surface/50">No certificates added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  const renderSocialLinksTab = () => (
    <div className="animate-in fade-in duration-300">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderSocialLinks}
      >
        <SortableContext items={socialLinks.map((s) => s.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialLinks.map((link, index) => (
              <SocialLinkCard
                key={link.id}
                socialLink={link}
                index={index}
                onEdit={() => onEditSocialLink(link)}
                onDelete={() => onDeleteSocialLink(link.id)}
              />
            ))}
            {socialLinks.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface-container-low border-outline/20">
                <p className="text-on-surface/50">No social links added yet.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

  switch (activeTab) {
    case "experience":
      return renderExperienceTab();
    case "skills":
      return renderSkillsTab();
    case "projects":
      return renderProjectsTab();
    case "certificates":
      return renderCertificatesTab();
    case "social-links":
      return renderSocialLinksTab();
    default:
      return null;
  }
}
