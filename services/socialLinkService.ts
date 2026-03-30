import { SocialLink } from "@/types/socialLink";
import { BaseService } from "./baseService";

class SocialLinkService extends BaseService<SocialLink> {
  protected endpoint = "/api/social-links";
  protected entityName = "social link";
  protected contentType = "multipart/form-data" as const;
}

export const socialLinkService = new SocialLinkService();
