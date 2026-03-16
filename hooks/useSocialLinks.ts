import { useState, useEffect } from "react";
import { SocialLink } from "@/types/socialLink";
import { socialLinkService } from "@/services/socialLinkService";
import { useToast } from "@/hooks/useToast";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";

export const useSocialLinks = (profileId?: string) => {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchSocialLinks();
  }, [profileId]);

  const fetchSocialLinks = async () => {
    setIsLoading(true);
    try {
      const data = await socialLinkService.fetchSocialLinks(profileId);
      setSocialLinks(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch social links");
    } finally {
      setIsLoading(false);
    }
  };

  const reorderSocialLinks = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = socialLinks.findIndex((s) => s.id === active.id);
      const newIndex = socialLinks.findIndex((s) => s.id === over.id);

      const newSocialLinks = arrayMove(socialLinks, oldIndex, newIndex);
      const updatedSocialLinks = newSocialLinks.map((s, index) => ({
        ...s,
        order: index,
      }));
      
      setSocialLinks(updatedSocialLinks);

      try {
        await socialLinkService.reorderSocialLinks(updatedSocialLinks.map((s) => ({ id: s.id, order: s.order })));
      } catch (error: any) {
        toast.error(error.message || "Failed to save reorder");
        fetchSocialLinks(); // Revert
      }
    }
  };

  const createSocialLink = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await socialLinkService.createSocialLink(formData);
      toast.success("Social link created successfully");
      fetchSocialLinks();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to create social link");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSocialLink = async (id: string, formData: FormData) => {
    setIsSubmitting(true);
    try {
      await socialLinkService.updateSocialLink(id, formData);
      toast.success("Social link updated successfully");
      fetchSocialLinks();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to update social link");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSocialLink = async (id: string) => {
    setIsDeleting(true);
    try {
      await socialLinkService.deleteSocialLink(id);
      toast.success("Social link deleted successfully");
      setSocialLinks(socialLinks.filter((s) => s.id !== id));
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to delete social link");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    socialLinks,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
    refreshSocialLinks: fetchSocialLinks,
  };
};
