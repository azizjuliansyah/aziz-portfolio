import { WorkExperience } from "@/types";
import { experienceService } from "@/services/experienceService";
import { useCRUD } from "@/hooks/useCRUD";

/**
 * Experience CRUD hook
 * Uses generic useCRUD hook with experience-specific configuration
 */
export const useExperience = (profileId?: string) => {
  const crud = useCRUD(experienceService, {
    entityName: "Experience",
    profileId,
  });

  return {
    ...crud,
    // Rename generic properties to domain-specific names
    experiences: crud.items,
    reorderExperiences: crud.reorderItems,
    createExperience: crud.createItem,
    updateExperience: crud.updateItem,
    deleteExperience: crud.deleteItem,
    refreshExperiences: crud.refreshItems,
  };
};
