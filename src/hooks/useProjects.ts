import { Project } from "@/types/project";
import { projectService } from "@/services/projectService";
import { useCRUD } from "@/hooks/useCRUD";

/**
 * Projects CRUD hook
 * Uses generic useCRUD hook with project-specific configuration
 */
export const useProjects = (profileId?: string) => {
  const crud = useCRUD(projectService, {
    entityName: "Project",
    profileId,
  });

  return {
    ...crud,
    // Rename generic properties to domain-specific names
    projects: crud.items,
    reorderProjects: crud.reorderItems,
    createProject: crud.createItem,
    updateProject: crud.updateItem,
    deleteProject: crud.deleteItem,
    refreshProjects: crud.refreshItems,
  };
};
