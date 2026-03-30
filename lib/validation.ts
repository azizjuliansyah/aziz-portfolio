import { z } from "zod";

/**
 * Validation Schemas for all entities
 * Provides type-safe validation for API requests
 */

/**
 * Skill Validation Schema
 */
export const skillSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Image must be a file or string",
  }),
});

export const skillUpdateSchema = skillSchema.partial();

/**
 * Project Validation Schema
 */
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  info: z.string().optional(),
  thumbnail: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Thumbnail must be a file or string",
  }),
});

export const projectUpdateSchema = projectSchema.partial();

/**
 * Work Experience Validation Schema
 */
export const workExperienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  profile_id: z.string().optional(),
});

export const workExperienceUpdateSchema = workExperienceSchema.partial();

/**
 * Social Link Validation Schema
 */
export const socialLinkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  link: z.string().url("Invalid URL").or(z.literal("")),
  image: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Image must be a file or string",
  }),
  profile_id: z.string().optional(),
});

export const socialLinkUpdateSchema = socialLinkSchema.partial();

/**
 * Certificate Validation Schema
 */
export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date_issued: z.string().min(1, "Date issued is required"),
  credential_id: z.string().optional(),
  credential_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  image_url: z.any().refine((file) => file instanceof File || typeof file === "string", {
    message: "Image must be a file or string",
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
