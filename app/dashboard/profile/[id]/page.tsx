"use client";

import { useEffect, useState, use } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { FileInput } from "@/components/ui/FileInput";
import { Modal } from "@/components/ui/Modal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { 
  User, Mail, Phone, MapPin, FileText, Briefcase, CheckCircle2, Globe, Eye, Download, Code, Plus, ArrowLeft
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useSkills } from "@/hooks/useSkills";
import { useProjects } from "@/hooks/useProjects";
import { useSocialLinks } from "@/hooks/useSocialLinks";
import { useExperience } from "@/hooks/useExperience";

// Dnd Kit Imports
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

// Component Imports
import { SkillCard } from "@/components/dashboard/skills/SkillCard";
import { SkillModal } from "@/components/dashboard/skills/SkillModal";
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard";
import { ProjectModal } from "@/components/dashboard/projects/ProjectModal";
import { SocialLinkCard } from "@/components/dashboard/social-links/SocialLinkCard";
import { SocialLinkModal } from "@/components/dashboard/social-links/SocialLinkModal";
import { ExperienceCard } from "@/components/dashboard/experience/ExperienceCard";
import { ExperienceModal } from "@/components/dashboard/experience/ExperienceModal";
import { ExperienceDetailModal } from "@/components/dashboard/experience/ExperienceDetailModal";

type ProfileTab = "basic" | "experience" | "skills" | "projects" | "social-links";

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
  
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ProfileTab;

  const [activeTab, setActiveTab] = useState<ProfileTab>(tabParam || "basic");

  // Update tab when query param changes
  useEffect(() => {
    if (tabParam && ["basic", "experience", "skills", "projects", "social-links"].includes(tabParam)) {
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
  const [currentEntry, setCurrentEntry] = useState<any>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    if (activeTab === "skills") {
      success = await deleteSkill(deleteTargetId);
    } else if (activeTab === "projects") {
      success = await deleteProject(deleteTargetId);
    } else if (activeTab === "social-links") {
      success = await deleteSocialLink(deleteTargetId);
    } else if (activeTab === "experience") {
      success = await deleteExperience(deleteTargetId);
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

  const onExperienceSubmit = async (data: any) => {
    if (activeTab !== "experience") return false;
    
    // Convert to appropriate API format, add profileId if creating
    const payload = { ...data };
    
    if (currentEntry?.id) {
      return await updateExperience(currentEntry.id, payload);
    } else {
      if (id) payload.profileId = id;
      return await createExperience(payload);
    }
  };

  const cvUrl = cv ? (typeof cv === "string" ? cv : URL.createObjectURL(cv)) : null;

  if (isProfileLoading || (activeTab === "skills" && isSkillsLoading) || (activeTab === "projects" && isProjectsLoading) || (activeTab === "social-links" && isSocialLinksLoading) || (activeTab === "experience" && isExperiencesLoading)) {
    return (
      <DashboardLayout user={user} onLogout={logout} title="Admin Settings">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton width={200} height={32} />
              <Skeleton width={400} height={24} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="h-full" contentClassName="flex flex-col items-center space-y-4">
                <Skeleton width={128} height={128} className="rounded-full" />
                <Skeleton width={150} height={24} />
                <Skeleton width={200} height={16} />
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card className="h-[400px]" contentClassName="space-y-4">
                <Skeleton width={200} height={24} className="mb-4" />
                <Skeleton className="w-full" height={40} />
                <Skeleton className="w-full" height={40} />
                <Skeleton className="w-full" height={40} />
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={logout} title={`Manage - ${profile?.name}`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-2 text-sm text-on-surface/50 hover:text-primary transition-colors w-fit group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to profiles
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-on-surface">
                {profile?.name}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full border border-primary/20">
                Editing
              </span>
            </div>
          </div>
          {(activeTab === "skills" || activeTab === "projects" || activeTab === "social-links" || activeTab === "experience") && (
            <Button onClick={() => handleOpenEntryModal()} leftIcon={Plus} className="shadow-lg shadow-blue-500/20">
              {activeTab === "skills" ? "Add Skill" : activeTab === "projects" ? "Add Project" : activeTab === "social-links" ? "Add Social Link" : "Add Experience"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Column: Profile Preview */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm h-[max-content] sticky top-8">
              <div className="flex flex-col items-center text-center space-y-4 py-2">
                <div className="relative group w-28 h-28 rounded-full overflow-hidden border-4 border-surface shadow-lg bg-surface-container-high flex items-center justify-center">
                  {avatar ? (
                    <img
                      src={typeof avatar === "string" ? avatar : URL.createObjectURL(avatar)}
                      alt="Profile Preview"
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <User className="w-10 h-10 text-gray-400 relative z-10" />
                  )}
                </div>

                <div className="space-y-1 w-full px-2">
                  <h2 className="text-lg font-bold text-on-surface truncate">{name || "Your Name"}</h2>
                  <p className="text-sm font-medium text-primary truncate">{title || "Professional Title"}</p>
                  {location && (
                    <p className="text-xs text-on-surface/60 truncate flex items-center justify-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {location}
                    </p>
                  )}
                </div>

                <div className="w-full pt-4 mt-2 border-t border-outline/10">
                  <span className="inline-flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-wider text-on-tertiary-container bg-tertiary-container px-3 py-1.5 rounded-full font-bold w-max mx-auto">
                    <Globe className="w-3.5 h-3.5" /> Public Portfolio
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Content Tabs */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col p-0 overflow-hidden shadow-sm">

              {/* Tabs Header */}
              <div className="flex border-b border-outline/10 px-6 pt-4 bg-surface-container-low/50 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab("basic")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap ${activeTab === "basic"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Basic Info
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("experience")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap ${activeTab === "experience"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Experience
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("skills")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap ${activeTab === "skills"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Skills
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("projects")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap ${activeTab === "projects"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Projects
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("social-links")}
                  className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative whitespace-nowrap ${activeTab === "social-links"
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface/50 hover:text-on-surface"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Social Links
                  </div>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 flex-1 bg-surface-container min-h-[500px]">

                {/* Basic Information Tab */}
                {activeTab === "basic" && (
                  <form onSubmit={handleProfileSubmit} className="h-full flex flex-col animate-in fade-in duration-300">
                    <div className="space-y-6 flex-1 w-full">
                      
                      <div className="grid gap-6 sm:grid-cols-12">
                        <div className="sm:col-span-12 md:col-span-4">
                          <div className="max-w-48">
                            <ImageInput
                              label="Profile Avatar"
                              value={avatar}
                              onChange={setAvatar}
                              aspectRatio="aspect-square"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-12 md:col-span-8 flex flex-col justify-start gap-5">
                          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                          <Input label="Professional Title" value={title} onChange={(e) => setTitle(e.target.value)} icon={Briefcase} required />
                        </div>
                        <div className="sm:col-span-12">
                          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="sm:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-5">
                          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} icon={Phone} />
                          <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} icon={MapPin} />
                        </div>
                        <div className="sm:col-span-12">
                          <Textarea label="Bio / Professional Summary" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                               <FileText className="w-4 h-4 text-blue-600" />
                                Resume / CV
                             </h3>
                             {cvUrl && (
                               <Button 
                                 type="button" 
                                 variant="secondary" 
                                 leftIcon={Eye} 
                                 onClick={() => setIsCvModalOpen(true)}
                               >
                                 Preview CV
                               </Button>
                             )}
                          </div>
                          <FileInput
                            label="Upload CV (PDF or Image)"
                            value={cv}
                            onChange={setCv}
                            helperText="Recommended: PDF under 5MB"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-outline/10 flex justify-end">
                      <Button type="submit" isLoading={isProfileSubmitting} leftIcon={CheckCircle2} className="w-full sm:w-auto shadow-lg shadow-primary/20">
                        Save Profile Details
                      </Button>
                    </div>
                  </form>
                )}

                {/* Experience Tab */}
                {activeTab === "experience" && (
                  <div className="animate-in fade-in duration-300">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={reorderExperiences}
                    >
                      <SortableContext items={experiences.map(e => e.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {experiences.map((exp, index) => (
                            <ExperienceCard 
                              key={exp.id} 
                              experience={exp} 
                              index={index}
                              onView={() => handleOpenDetailModal(exp)}
                              onEdit={() => handleOpenEntryModal(exp)}
                              onDelete={() => openDeleteModal(exp.id)}
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
                )}

                {/* Skills Tab */}
                {activeTab === "skills" && (
                  <div className="animate-in fade-in duration-300">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={reorderSkills}
                    >
                      <SortableContext items={skills.map(s => s.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {skills.map((skill, index) => (
                            <SkillCard 
                              key={skill.id} 
                              skill={skill} 
                              index={index}
                              onEdit={() => handleOpenEntryModal(skill)}
                              onDelete={() => openDeleteModal(skill.id)}
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
                )}

                {/* Projects Tab */}
                {activeTab === "projects" && (
                  <div className="animate-in fade-in duration-300">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={reorderProjects}
                    >
                      <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {projects.map((project, index) => (
                            <ProjectCard 
                              key={project.id} 
                              project={project} 
                              index={index}
                              onEdit={() => handleOpenEntryModal(project)}
                              onDelete={() => openDeleteModal(project.id)}
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
                )}

                {/* Social Links Tab */}
                {activeTab === "social-links" && (
                  <div className="animate-in fade-in duration-300">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={reorderSocialLinks}
                    >
                      <SortableContext items={socialLinks.map(s => s.id)} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {socialLinks.map((link, index) => (
                            <SocialLinkCard 
                              key={link.id} 
                              socialLink={link} 
                              index={index}
                              onEdit={() => handleOpenEntryModal(link)}
                              onDelete={() => openDeleteModal(link.id)}
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
                )}

              </div>
            </Card>
          </div>
        </div>

        {/* CV Preview Modal */}
        <Modal
          isOpen={isCvModalOpen}
          onClose={() => setIsCvModalOpen(false)}
          title="Resume / CV Preview"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            {cvUrl && (
              <div className="w-full aspect-[1/1.4] sm:aspect-[1/1.2] md:aspect-video rounded-xl overflow-hidden border border-outline/10 bg-surface-container-low flex items-center justify-center">
                {cvUrl.toLowerCase().endsWith('.pdf') || (cv instanceof File && cv.type === 'application/pdf') ? (
                  <iframe src={cvUrl} className="w-full h-[60vh] md:h-[70vh]" title="CV Preview" />
                ) : (
                  <img src={cvUrl} alt="CV Preview" className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain" />
                )}
              </div>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="secondary" onClick={() => setIsCvModalOpen(false)}>
                 Close
              </Button>
              {cvUrl && (
                <a href={cvUrl} download="Resume_CV">
                   <Button type="button" leftIcon={Download}>
                     Download PDF
                   </Button>
                </a>
              )}
            </div>
          </div>
        </Modal>

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
          experience={currentEntry}
        />

        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={onConfirmDelete}
          isLoading={activeTab === "skills" ? isSkillDeleting : activeTab === "projects" ? isProjectDeleting : activeTab === "social-links" ? isSocialLinkDeleting : isExperienceDeleting}
          title={`Delete ${activeTab === 'skills' ? 'Skill' : activeTab === 'projects' ? 'Project' : activeTab === 'social-links' ? 'Social Link' : 'Experience'}`}
          message={`Are you sure you want to delete this ${activeTab === 'skills' ? 'skill' : activeTab === 'projects' ? 'project' : activeTab === 'social-links' ? 'social link' : 'experience'}?`}
        />

      </div>
    </DashboardLayout>
  );
}
