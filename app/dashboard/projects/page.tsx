"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
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
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard";
import { ProjectModal } from "@/components/dashboard/projects/ProjectModal";
import { Project } from "@/types/project";

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderProjects,
    createProject,
    updateProject,
    deleteProject
  } = useProjects();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const { logout } = useAuth();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  const handleOpenModal = (project: Project | null = null) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
  };

  const onModalSubmit = async (formData: FormData) => {
    if (currentProject?.id) {
      const success = await updateProject(currentProject.id, formData);
      if (success) handleCloseModal();
      return success;
    } else {
      const success = await createProject(formData);
      if (success) handleCloseModal();
      return success;
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (deleteTargetId) {
      const success = await deleteProject(deleteTargetId);
      if (success) {
        setIsDeleteModalOpen(false);
        setDeleteTargetId(null);
      }
    }
  };

  return (
    <DashboardLayout user={user} onLogout={logout} title="Projects Management">
      <PageHeader 
        title="Portfolio Projects" 
        description="Manage your showcase work and contributions"
      >
        <Button onClick={() => handleOpenModal()} leftIcon={Plus}>
          Add New Project
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} noPadding className="h-full flex flex-col">
              <Skeleton className="aspect-video w-full" />
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between">
                  <Skeleton width={140} height={24} />
                  <Skeleton width={20} height={20} />
                </div>
                <Skeleton width={100} height={14} />
                <div className="space-y-2">
                  <Skeleton className="w-full" height={14} />
                  <Skeleton className="w-full" height={14} />
                  <Skeleton className="w-2/3" height={14} />
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                  {[1, 2, 3].map(j => (
                    <Skeleton key={j} width={32} height={32} className="rounded-md" />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={reorderProjects}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  index={index}
                  onEdit={() => handleOpenModal(project)}
                  onDelete={() => openDeleteModal(project.id)}
                />
              ))}
              {projects.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500">No projects added yet.</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={onModalSubmit}
        currentProject={currentProject}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated gallery images will also be removed."
      />
    </DashboardLayout>
  );
}
