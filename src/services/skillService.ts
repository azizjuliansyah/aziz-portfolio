import { Skill } from "@/types/skill";
import { BaseService } from "./baseService";

class SkillService extends BaseService<Skill> {
  protected endpoint = "/api/skills";
  protected entityName = "skill";
  protected contentType = "multipart/form-data" as const;
}

export const skillService = new SkillService();
