import { useState, useEffect } from "react";
import { Skill } from "@/types/skill";
import { skillService } from "@/services/skillService";
import { useToast } from "@/hooks/useToast";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const data = await skillService.fetchSkills();
      setSkills(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch skills");
    } finally {
      setIsLoading(false);
    }
  };

  const reorderSkills = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over.id);

      const newSkills = arrayMove(skills, oldIndex, newIndex);
      const updatedSkills = newSkills.map((skill, index) => ({
        ...skill,
        order: index,
      }));
      
      setSkills(updatedSkills);

      try {
        await skillService.reorderSkills(updatedSkills.map((s) => ({ id: s.id, order: s.order })));
      } catch (error: any) {
        toast.error(error.message || "Failed to save reorder");
        fetchSkills(); // Revert
      }
    }
  };

  const createSkill = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await skillService.createSkill(formData);
      toast.success("Skill created successfully");
      fetchSkills();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create skill");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSkill = async (id: string, formData: FormData) => {
    setIsSubmitting(true);
    try {
      await skillService.updateSkill(id, formData);
      toast.success("Skill updated successfully");
      fetchSkills();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update skill");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSkill = async (id: string) => {
    setIsDeleting(true);
    try {
      await skillService.deleteSkill(id);
      toast.success("Skill deleted successfully");
      setSkills(skills.filter((s) => s.id !== id));
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete skill");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    skills,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    refreshSkills: fetchSkills,
  };
};
