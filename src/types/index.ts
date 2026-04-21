/**
 * Centralized type exports
 * Single source of truth for all application types
 */

// Domain Types
export type { Profile, Profile as PortfolioProfile, UpdateProfileInput } from "./profile";
export type { Project, Project as ProjectType, ProjectImage } from "./project";
export type { Skill, Skill as SkillType, CreateSkillInput, UpdateSkillInput } from "./skill";
export type { SocialLink, SocialLink as SocialLinkType } from "./socialLink";
export type { WorkExperience, WorkExperience as WorkExperienceType, WorkExperienceResponsibility } from "./experience";
export type { Settings, Settings as SettingsType, UpdateSettingsInput, Theme } from "./settings";
export type { Certificate } from "./certificate";
export type { User, AuthResponse, LoginCredentials, RegisterData } from "./auth";

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

export {
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
