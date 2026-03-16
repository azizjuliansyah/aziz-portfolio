export interface SocialLink {
  id: string;
  name: string;
  image: string | File;
  link: string;
  order: number;
  profile_id?: string;
}

export type CreateSocialLinkInput = Omit<SocialLink, "id" | "order">;
export type UpdateSocialLinkInput = Partial<CreateSocialLinkInput> & { id: string };
