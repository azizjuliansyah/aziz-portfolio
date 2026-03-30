"use client";

import { useEffect, useState, use } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useSkills } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useExperience } from "@/hooks/useExperience";
import { useCertificates } from "@/hooks/useCertificates";
import { Skill } from "@/types/skill";
import { Project } from "@/types/project";
import { SocialLink } from "@/types/socialLink";
import { WorkExperience } from "@/types/experience";
import { Certificate } from "@/types/certificate";

// Component Imports
import { SkillModal } from "@/components/dashboard/skills/SkillModal";
import { ProjectModal } from "@/components/dashboard/projects/ProjectModal";
import { SocialLinkModal } from "@/components/dashboard/social-links/SocialLinkModal";
import { ExperienceModal } from "@/components/dashboard/experience/ExperienceModal";
import { ExperienceDetailModal } from "@/components/dashboard/experience/ExperienceDetailModal";
import { CertificateModal } from "@/components/dashboard/certificates/CertificateModal";
import {
  ProfileEditorLayout,
  ProfileBasicForm,
  ProfileTabContent,
} from "@/components/dashboard/profile";
import { DashboardLoadingSkeleton } from "@/components/dashboard/common";

type ProfileTab = "basic" | "experience" | "skills" | "projects" | "certificates" | "social-links";

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { profile, isLoading: isProfileLoading, isSubmitting: isProfileSubmitting, updateProfile } = useProfile(id);
  const { 
    skills, 
    isLoading: isSkillsLoading, 
    isSubmitting: isSkillSubmitting, 
    isDeleting: isSkillDeleting,
    reorderSkills, 
    createSkill, 
    updateSkill, 
    deleteSkill 
  } = useSkills(id);
  const { 
    projects, 
    isLoading: isProjectsLoading, 
    isSubmitting: isProjectSubmitting, 
    isDeleting: isProjectDeleting,
    reorderProjects, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjects(id);
  const { 
    socialLinks, 
    isLoading: isSocialLinksLoading, 
    isSubmitting: isSocialLinkSubmitting, 
    isDeleting: isSocialLinkDeleting,
    reorderSocialLinks, 
    createSocialLink, 
    updateSocialLink, 
    deleteSocialLink 
  } = useSocialLinks(id);
  const {
    experiences,
    isLoading: isExperiencesLoading,
    isSubmitting: isExperienceSubmitting,
    isDeleting: isExperienceDeleting,
    reorderExperiences,
    createExperience,
    updateExperience,
    deleteExperience
  } = useExperience(id);
  const {
    certificates,
    isLoading: isCertificatesLoading,
    isSubmitting: isCertificateSubmitting,
    isDeleting: isCertificateDeleting,
    reorderCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate
  } = useCertificates(id);
  
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ProfileTab;

  const [activeTab, setActiveTab] = useState<ProfileTab>(tabParam || "basic");

  // Update tab when query param changes
  useEffect(() => {
    if (tabParam && ["basic", "experience", "skills", "projects", "certificates", "social-links"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Profile States
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState<File | string | null>(null);
  const [cv, setCv] = useState<File | string | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  // Skills & Projects Common States
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [currentEntry, setCurrentEntry] = useState<Skill | Project | SocialLink | WorkExperience | Certificate | null>(null);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setTitle(profile.title || "");
      setEmail(profile.email || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
      setAvatar(profile.avatar || null);
      setCv(profile.cv || null);
    }
  }, [profile]);

  const handleProfileFieldChange = (field: string, value: string | File | null) => {
    switch (field) {
      case "name": setName(value as string); break;
      case "title": setTitle(value as string); break;
      case "email": setEmail(value as string); break;
      case "bio": setBio(value as string); break;
      case "phone": setPhone(value as string); break;
      case "location": setLocation(value as string); break;
      case "avatar": setAvatar(value); break;
      case "cv": setCv(value); break;
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("email", email || "");
    formData.append("bio", bio || "");
    formData.append("phone", phone || "");
    formData.append("location", location || "");

    if (avatar instanceof File) formData.append("avatar", avatar);
    if (cv instanceof File) formData.append("cv", cv);

    await updateProfile(formData);
  };

  // Common Modal Handlers
  const handleOpenEntryModal = (entry: any = null) => {
    setCurrentEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleOpenDetailModal = (entry: any = null) => {
    setCurrentEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleCloseEntryModal = () => {
    setIsEntryModalOpen(false);
    setCurrentEntry(null);
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!deleteTargetId) return;

    let success = false;
    switch (activeTab) {
      case "skills": success = await deleteSkill(deleteTargetId); break;
      case "projects": success = await deleteProject(deleteTargetId); break;
      case "social-links": success = await deleteSocialLink(deleteTargetId); break;
      case "experience": success = await deleteExperience(deleteTargetId); break;
      case "certificates": success = await deleteCertificate(deleteTargetId); break;
    }

    if (success) {
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  // Submit Handlers for Skills/Projects
  const onSkillSubmit = async (formData: FormData) => {
    if (currentEntry?.id) {
      return await updateSkill(currentEntry.id, formData);
    } else {
      if (id) formData.append("profileId", id);
      return await createSkill(formData);
    }
  };

  const onProjectSubmit = async (formData: FormData) => {
    if (currentEntry?.id) {
      const success = await updateProject(currentEntry.id, formData);
      if (success) handleCloseEntryModal();
      return success;
    } else {
      if (id) formData.append("profileId", id);
      const success = await createProject(formData);
      if (success) handleCloseEntryModal();
      return success;
    }
  };

  const onSocialLinkSubmit = async (formData: FormData) => {
    if (activeTab !== "social-links") return false;
    if (currentEntry?.id) {
      return await updateSocialLink(currentEntry.id, formData);
    } else {
      if (id) formData.append("profileId", id);
      return await createSocialLink(formData);
    }
  };

  const onExperienceSubmit = async (data: Partial<WorkExperience>) => {
    if (activeTab !== "experience") return false;

    // Convert to appropriate API format, add profileId if creating
    const payload = { ...data };

    if (currentEntry?.id) {
      return await updateExperience(currentEntry.id, payload);
    } else {
      if (id) payload.profile_id = id;
      return await createExperience(payload);
    }
  };

  const onCertificateSubmit = async (formData: FormData) => {
    if (currentEntry?.id) {
      return await updateCertificate(currentEntry.id, formData);
    } else {
      if (id) formData.append("profileId", id);
      return await createCertificate(formData);
    }
  };

  const profileData = {
    name,
    title,
    location,
    avatar,
  };

  if (isProfileLoading || (activeTab === "skills" && isSkillsLoading) || (activeTab === "projects" && isProjectsLoading) || (activeTab === "social-links" && isSocialLinksLoading) || (activeTab === "experience" && isExperiencesLoading) || (activeTab === "certificates" && isCertificatesLoading)) {
    return (
      <DashboardLayout user={user} onLogout={logout} title="Admin Settings">
        <DashboardLoadingSkeleton />
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout user={user} onLogout={logout} title={`Manage - ${profile?.name}`}>
      <ProfileEditorLayout
        profile={profileData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBack={() => router.push("/dashboard/profile")}
        onAddEntry={handleOpenEntryModal}
      >
        {activeTab === "basic" ? (
          <ProfileBasicForm
            name={name}
            title={title}
            email={email}
            bio={bio}
            phone={phone}
            location={location}
            avatar={avatar}
            cv={cv}
            isSubmitting={isProfileSubmitting}
            isCvModalOpen={isCvModalOpen}
            onChange={handleProfileFieldChange}
            onSubmit={handleProfileSubmit}
            onCvModalOpen={() => setIsCvModalOpen(true)}
            onCvModalClose={() => setIsCvModalOpen(false)}
          />
        ) : (
          <ProfileTabContent
            activeTab={activeTab}
            skills={skills}
            projects={projects}
            certificates={certificates}
            socialLinks={socialLinks}
            experiences={experiences}
            onEditSkill={handleOpenEntryModal}
            onDeleteSkill={openDeleteModal}
            onEditProject={handleOpenEntryModal}
            onDeleteProject={openDeleteModal}
            onEditCertificate={handleOpenEntryModal}
            onDeleteCertificate={openDeleteModal}
            onEditSocialLink={handleOpenEntryModal}
            onDeleteSocialLink={openDeleteModal}
            onViewExperience={handleOpenDetailModal}
            onEditExperience={handleOpenEntryModal}
            onDeleteExperience={openDeleteModal}
            onReorderSkills={reorderSkills}
            onReorderProjects={reorderProjects}
            onReorderCertificates={reorderCertificates}
            onReorderSocialLinks={reorderSocialLinks}
            onReorderExperiences={reorderExperiences}
          />
        )}
      </ProfileEditorLayout>

      {/* Modals */}
      <SkillModal
        isOpen={isEntryModalOpen && activeTab === "skills"}
        onClose={handleCloseEntryModal}
        onSubmit={onSkillSubmit}
        currentSkill={currentEntry}
        isLoading={isSkillSubmitting}
      />

      <ProjectModal
        isOpen={isEntryModalOpen && activeTab === "projects"}
        onClose={handleCloseEntryModal}
        onSubmit={onProjectSubmit}
        currentProject={currentEntry}
        isLoading={isProjectSubmitting}
      />

      <SocialLinkModal
        isOpen={isEntryModalOpen && activeTab === "social-links"}
        onClose={handleCloseEntryModal}
        onSubmit={onSocialLinkSubmit}
        currentLink={currentEntry}
        isLoading={isSocialLinkSubmitting}
      />

      <ExperienceModal
        isOpen={isEntryModalOpen && activeTab === "experience"}
        onClose={handleCloseEntryModal}
        onSubmit={onExperienceSubmit}
        currentExperience={currentEntry}
        isLoading={isExperienceSubmitting}
      />

      <ExperienceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setCurrentEntry(null);
        }}
        experience={currentEntry as any}
      />

      <CertificateModal
        isOpen={isEntryModalOpen && activeTab === "certificates"}
        onClose={handleCloseEntryModal}
        onSubmit={onCertificateSubmit}
        currentCertificate={currentEntry as Partial<Certificate>}
        isLoading={isCertificateSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        isLoading={activeTab === "skills" ? isSkillDeleting : activeTab === "projects" ? isProjectDeleting : activeTab === "social-links" ? isSocialLinkDeleting : activeTab === "certificates" ? isCertificateDeleting : isExperienceDeleting}
        title={`Delete ${activeTab === 'skills' ? 'Skill' : activeTab === 'projects' ? 'Project' : activeTab === 'social-links' ? 'Social Link' : activeTab === 'certificates' ? 'Certificate' : 'Experience'}`}
        message={`Are you sure you want to delete this ${activeTab === 'skills' ? 'skill' : activeTab === 'projects' ? 'project' : activeTab === 'social-links' ? 'social link' : activeTab === 'certificates' ? 'certificate' : 'experience'}?`}
      />
    </DashboardLayout>
  );
}
