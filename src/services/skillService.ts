import { API_ENDPOINTS } from "@/constants/api";
import type { Skill } from "@/types";
import { BaseService } from "./baseService";

class SkillService extends BaseService<Skill> {
  protected endpoint = API_ENDPOINTS.SKILLS;
  protected entityName = "skill";
  protected contentType = "multipart/form-data" as const;
}

export const skillService = new SkillService();
