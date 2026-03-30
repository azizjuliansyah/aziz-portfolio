export interface Profile {
  id: string;
  name: string;
  title?: string;
  email?: string;
  bio?: string;
  avatar?: string | File;
  cv?: string | File;
  phone?: string;
  location?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  skills?: any[];
  projects?: any[];
  social_links?: any[];
  work_experience?: any[];
  certificates?: import('./certificate').Certificate[];
}

export type UpdateProfileInput = Partial<Profile>;
