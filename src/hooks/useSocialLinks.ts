import { SocialLink } from "@/types";
import { socialLinkService } from "@/services/socialLinkService";
import { useCRUD } from "@/hooks/useCRUD";

/**
 * Social Links CRUD hook
 * Uses generic useCRUD hook with social link-specific configuration
 */
export const useSocialLinks = (profileId?: string) => {
  const crud = useCRUD(socialLinkService, {
    entityName: "Social Link",
    profileId,
  });

  return {
    ...crud,
    // Rename generic properties to domain-specific names
    socialLinks: crud.items,
    reorderSocialLinks: crud.reorderItems,
    createSocialLink: crud.createItem,
    updateSocialLink: crud.updateItem,
    deleteSocialLink: crud.deleteItem,
    refreshSocialLinks: crud.refreshItems,
  };
};
