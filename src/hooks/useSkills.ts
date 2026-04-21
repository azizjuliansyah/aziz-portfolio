import { Skill } from "@/types";
import { skillService } from "@/services/skillService";
import { useCRUD } from "@/hooks/useCRUD";

/**
 * Skills CRUD hook
 * Uses generic useCRUD hook with skill-specific configuration
 */
export const useSkills = (profileId?: string) => {
  const crud = useCRUD(skillService, {
    entityName: "Skill",
    profileId,
  });

  return {
    ...crud,
    // Rename generic properties to domain-specific names
    skills: crud.items,
    reorderSkills: crud.reorderItems,
    createSkill: crud.createItem,
    updateSkill: crud.updateItem,
    deleteSkill: crud.deleteItem,
    refreshSkills: crud.refreshItems,
  };
};
