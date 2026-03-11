import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { projectService } from "@/services/projectService";
import { useToast } from "@/hooks/useToast";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.fetchProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  const reorderProjects = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      const updatedProjects = newProjects.map((p, index) => ({
        ...p,
        order: index,
      }));
      
      setProjects(updatedProjects);

      try {
        await projectService.reorderProjects(updatedProjects.map((p) => ({ id: p.id, order: p.order })));
      } catch (error: any) {
        toast.error(error.message || "Failed to save reorder");
        fetchProjects(); // Revert
      }
    }
  };

  const createProject = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await projectService.createProject(formData);
      toast.success("Project created successfully");
      fetchProjects();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProject = async (id: string, formData: FormData) => {
    setIsSubmitting(true);
    try {
      await projectService.updateProject(id, formData);
      toast.success("Project updated successfully");
      fetchProjects();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id: string) => {
    setIsDeleting(true);
    try {
      await projectService.deleteProject(id);
      toast.success("Project deleted successfully");
      setProjects(projects.filter((p) => p.id !== id));
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    projects,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderProjects,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
};
