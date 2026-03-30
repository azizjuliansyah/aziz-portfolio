export interface Certificate {
  id: string;
  profile_id?: string;
  title: string;
  issuer: string;
  date_issued: string;
  credential_id?: string;
  credential_url?: string;
  image_url: string | File;
  order: number;
  created_at?: string;
}

export type CreateCertificateInput = Omit<Certificate, "id" | "order" | "created_at">;
export type UpdateCertificateInput = Partial<CreateCertificateInput> & { id: string };
