import { useState, useEffect } from "react";
import { WorkExperience } from "@/types/experience";
import { experienceService } from "@/services/experienceService";
import { useToast } from "@/hooks/useToast";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

export const useExperience = (profileId?: string) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchExperiences();
  }, [profileId]);

  const fetchExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await experienceService.fetchExperiences(profileId);
      setExperiences(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch experiences");
    } finally {
      setIsLoading(false);
    }
  };

  const reorderExperiences = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = experiences.findIndex((exp) => exp.id === active.id);
      const newIndex = experiences.findIndex((exp) => exp.id === over.id);

      const newExperiences = arrayMove(experiences, oldIndex, newIndex);
      const updatedExperiences = newExperiences.map((exp, index) => ({
        ...exp,
        order: index,
      }));
      
      setExperiences(updatedExperiences);

      try {
        await experienceService.reorderExperiences(updatedExperiences.map((e) => ({ id: e.id, order: e.order })));
      } catch (error: any) {
        toast.error(error.message || "Failed to save reorder");
        fetchExperiences(); // Revert
      }
    }
  };

  const createExperience = async (data: Partial<WorkExperience>) => {
    setIsSubmitting(true);
    try {
      await experienceService.createExperience(data);
      toast.success("Experience created successfully");
      fetchExperiences();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create experience");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateExperience = async (id: string, data: Partial<WorkExperience>) => {
    setIsSubmitting(true);
    try {
      await experienceService.updateExperience(id, data);
      toast.success("Experience updated successfully");
      fetchExperiences();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update experience");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExperience = async (id: string) => {
    setIsDeleting(true);
    try {
      await experienceService.deleteExperience(id);
      toast.success("Experience deleted successfully");
      setExperiences(experiences.filter((e) => e.id !== id));
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete experience");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    experiences,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    refreshExperiences: fetchExperiences,
  };
};
