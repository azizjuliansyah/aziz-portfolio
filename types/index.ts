/**
 * Centralized type exports
 * Single source of truth for all application types
 */

// Domain Types
export type { Profile, Profile as PortfolioProfile } from "./profile";
export type { Project, Project as ProjectType } from "./project";
export type { Skill, Skill as SkillType } from "./skill";
export type { SocialLink, SocialLink as SocialLinkType } from "./socialLink";
export type { WorkExperience, WorkExperience as WorkExperienceType } from "./experience";
export type { Settings, Settings as SettingsType } from "./settings";
export type { Certificate } from "./certificate";

// API Types
export type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  ReorderResponse,
} from "./api";

export {
  isApiResponse,
  isApiErrorResponse,
  createSuccessResponse,
  createPaginatedResponse,
} from "./api";

// Error Types
export type { AppError } from "./error";

export type {
  ApiError,
  NetworkError,
  ValidationError,
} from "./error";

export {
  isError,
  isAppError,
  getErrorMessage,
  parseApiError,
} from "./error";
