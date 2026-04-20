/**
 * Zod validation schemas for forms
 */

import { z } from "zod";

// ==================== Profile Validation ====================

export const profileBasicSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  title: z.string()
    .min(1, "Professional title is required")
    .max(100, "Title must be less than 100 characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional()
    .or(z.literal("")),
  phone: z.string()
    .regex(/^\+?[\d\s-]*$/, "Phone number can only contain digits, spaces, dashes, and optional +")
    .optional()
    .or(z.literal("")),
  location: z.string()
    .max(200, "Location must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  avatar: z.any().optional(),
  cv: z.any().optional(),
});

export type ProfileBasicFormData = z.infer<typeof profileBasicSchema>;

// ==================== Skill Validation ====================

export const skillSchema = z.object({
  title: z.string()
    .min(1, "Skill name is required")
    .max(100, "Skill name must be less than 100 characters"),
  image: z.any()
    .refine((file) => !file || file instanceof File || typeof file === "string", {
      message: "Image must be a file or string",
    })
    .optional(),
  order: z.number().int().optional(),
});

export type SkillFormData = z.infer<typeof skillSchema>;

// ==================== Project Validation ====================

export const projectSchema = z.object({
  title: z.string()
    .min(1, "Project title is required")
    .max(100, "Project title must be less than 100 characters"),
  overview: z.string()
    .min(1, "Project overview is required")
    .max(2000, "Overview must be less than 2000 characters"),
  link: z.string()
    .url("Invalid URL format")
    .or(z.literal(""))
    .optional(),
  info: z.string()
    .max(500, "Info must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  thumbnail: z.any()
    .refine((file) => !file || file instanceof File || typeof file === "string", {
      message: "Thumbnail must be a file or string",
    })
    .optional(),
  images: z.array(z.any()).optional(),
  order: z.number().int().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// ==================== Experience Validation ====================

export const responsibilitySchema = z.object({
  id: z.string().optional(),
  responsibility: z.string()
    .min(1, "Responsibility is required")
    .max(500, "Responsibility must be less than 500 characters"),
  order: z.number().int().optional(),
});

export const experienceSchema = z.object({
  company_name: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  position: z.string()
    .min(1, "Position is required")
    .max(100, "Position must be less than 100 characters"),
  start_date: z.string()
    .min(1, "Start date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .or(z.literal(""))
    .optional(),
  responsibilities: z.array(responsibilitySchema).optional(),
  order: z.number().int().optional(),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;

// ==================== Social Link Validation ====================

export const socialLinkSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  link: z.string()
    .min(1, "Link is required")
    .url("Invalid URL format"),
  image: z.any()
    .refine((file) => !file || file instanceof File || typeof file === "string", {
      message: "Image must be a file or string",
    })
    .optional(),
  order: z.number().int().optional(),
});

export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

// ==================== Settings Validation ====================

export const accountSettingsSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .optional()
    .or(z.literal("")),
  avatar: z.any().optional(),
});

export type AccountSettingsFormData = z.infer<typeof accountSettingsSchema>;

export const themeSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    errorMap: () => ({ message: "Theme must be light, dark, or system" }),
  } as any),
  enable_global_theme: z.boolean().optional(),
});

export type ThemeSettingsFormData = z.infer<typeof themeSettingsSchema>;

// ==================== Validation Utilities ====================

/**
 * Validate form data against schema and return errors
 */
export function validateForm<T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: result.error };
}

/**
 * Get formatted error messages from Zod error
 */
export function getFormErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    if (err.path.length > 0) {
      const field = err.path.join(".");
      errors[field] = err.message;
    }
  });

  return errors;
}

/**
 * Validate and return data or throw error
 */
export function validateOrThrow<T extends z.ZodType>(
  schema: T,
  data: unknown
): z.infer<T> {
  return schema.parse(data);
}
