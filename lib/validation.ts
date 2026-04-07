import { z } from "zod";

/**
 * Validation Schemas for all entities
 * Provides type-safe validation for API requests
 */

/**
 * Skill Validation Schema
 */
export const skillSchema = z.object({
  title: z.string().min(1, "Skill title is required"),
  image: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Icon or image must be provided",
  }),
});

export const skillUpdateSchema = skillSchema.partial();

/**
 * Project Validation Schema
 */
export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  link: z.string().url("Invalid URL format").optional().or(z.literal("")),
  info: z.string().optional(),
  thumbnail: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Project thumbnail image is required",
  }),
});

export const projectUpdateSchema = projectSchema.partial();

/**
 * Work Experience Validation Schema
 */
export const workExperienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Job position is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  profile_id: z.string().optional(),
});

export const workExperienceUpdateSchema = workExperienceSchema.partial();

/**
 * Social Link Validation Schema
 */
export const socialLinkSchema = z.object({
  name: z.string().min(1, "Platform name is required (e.g., WhatsApp, GitHub)"),
  link: z.string().url("Invalid URL format").or(z.literal("")),
  image: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Social icon is required",
  }),
  profile_id: z.string().optional(),
});

export const socialLinkUpdateSchema = socialLinkSchema.partial();

/**
 * Certificate Validation Schema
 */
export const certificateSchema = z.object({
  title: z.string().min(1, "Certificate title is required"),
  issuer: z.string().min(1, "Issuing organization is required"),
  date_issued: z.string().min(1, "Issue date is required"),
  credential_id: z.string().optional(),
  credential_url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  image_url: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Certificate image is required",
  }),
  profile_id: z.string().optional(),
});

export const certificateUpdateSchema = certificateSchema.partial();

/**
 * Reorder Items Validation Schema
 */
export const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "ID is required"),
      order: z.number().int().min(0, "Order must be a non-negative integer"),
    })
  ).min(1, "At least one item is required"),
});

/**
 * Type exports for inferred types
 */
export type SkillInput = z.infer<typeof skillSchema>;
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;
export type WorkExperienceUpdateInput = z.infer<typeof workExperienceUpdateSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type SocialLinkUpdateInput = z.infer<typeof socialLinkUpdateSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type CertificateUpdateInput = z.infer<typeof certificateUpdateSchema>;
export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;

/**
 * Profile Validation Schema
 */
export const profileSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email address is required").email("Invalid email format"),
  image: z.any().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;
