import { Certificate } from "@/types/certificate";
import { certificateService } from "@/services/certificateService";
import { useCRUD } from "@/hooks/useCRUD";

/**
 * Certificates CRUD hook
 * Uses generic useCRUD hook with certificate-specific configuration
 */
export const useCertificates = (profileId?: string) => {
  const crud = useCRUD(certificateService, {
    entityName: "Certificate",
    profileId,
  });

  return {
    ...crud,
    // Rename generic properties to domain-specific names
    certificates: crud.items,
    reorderCertificates: crud.reorderItems,
    createCertificate: crud.createItem,
    updateCertificate: crud.updateItem,
    deleteCertificate: crud.deleteItem,
    refreshCertificates: crud.refreshItems,
  };
};
