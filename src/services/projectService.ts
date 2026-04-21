import { API_ENDPOINTS } from "@/constants/api";
import type { Project } from "@/types";
import { BaseService } from "./baseService";

class ProjectService extends BaseService<Project> {
  protected endpoint = API_ENDPOINTS.PROJECTS;
  protected entityName = "project";
  protected contentType = "multipart/form-data" as const;
}

export const projectService = new ProjectService();
