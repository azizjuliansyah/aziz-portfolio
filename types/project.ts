export interface ProjectImage {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  thumbnail: string | File;
  link?: string;
  info?: string;
  description: string;
  order: number;
  images: ProjectImage[];
}

export type CreateProjectInput = Omit<Project, "id" | "order" | "images">;
export type UpdateProjectInput = Partial<CreateProjectInput> & { id: string };
