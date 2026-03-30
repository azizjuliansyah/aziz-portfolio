import { WorkExperience } from "@/types/experience";
import { BaseService } from "./baseService";

class ExperienceService extends BaseService<WorkExperience> {
  protected endpoint = "/api/experience";
  protected entityName = "experience";
  protected contentType = "application/json" as const;
}

export const experienceService = new ExperienceService();
