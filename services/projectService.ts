import { Project } from "@/types/project";
import { BaseService } from "./baseService";

class ProjectService extends BaseService<Project> {
  protected endpoint = "/api/projects";
  protected entityName = "project";
  protected contentType = "multipart/form-data" as const;
}

export const projectService = new ProjectService();
