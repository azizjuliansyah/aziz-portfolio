import { API_ENDPOINTS } from "@/constants/api";
import type { SocialLink } from "@/types";
import { BaseService } from "./baseService";

class SocialLinkService extends BaseService<SocialLink> {
  protected endpoint = API_ENDPOINTS.SOCIAL_LINKS;
  protected entityName = "social link";
  protected contentType = "multipart/form-data" as const;
}

export const socialLinkService = new SocialLinkService();
