export interface Profile {
  id: string;
  name: string;
  title: string;
  email: string;
  bio: string;
  avatar: string | File;
  cv: string | File;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
}

export type UpdateProfileInput = Partial<Profile>;
