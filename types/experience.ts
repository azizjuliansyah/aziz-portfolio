export interface WorkExperienceResponsibility {
  id: string;
  experience_id: string;
  responsibility: string;
  order: number;
  created_at?: string;
}

export interface WorkExperience {
  id: string;
  profile_id?: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string;
  order: number;
  created_at?: string;
  responsibilities?: WorkExperienceResponsibility[]; // Nested for convenience in UI
}
