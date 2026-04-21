import { API_ENDPOINTS } from "@/constants/api";
import type { WorkExperience } from "@/types";
import { BaseService } from "./baseService";

class ExperienceService extends BaseService<WorkExperience> {
  protected endpoint = API_ENDPOINTS.EXPERIENCE;
  protected entityName = "experience";
  protected contentType = "application/json" as const;
}

export const experienceService = new ExperienceService();
