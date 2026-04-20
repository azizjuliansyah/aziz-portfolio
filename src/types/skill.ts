export interface Skill {
  id: string;
  title: string;
  image: string | File;
  order: number;
}

export type CreateSkillInput = Omit<Skill, "id" | "order">;
export type UpdateSkillInput = Partial<CreateSkillInput> & { id: string };
