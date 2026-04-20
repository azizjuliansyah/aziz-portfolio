/**
 * Application-wide constants
 */

// Toast & UI
export const TOAST_DURATION = 5000;
export const TOAST_SUCCESS_DURATION = 3000;
export const TOAST_ERROR_DURATION = 7000;

// API & Network
export const API_TIMEOUT = 30000;
export const DEBOUNCE_DELAY = 300;
export const SEARCH_DEBOUNCE_DELAY = 500;

// Animation
export const ANIMATION_DURATION_FAST = 150;
export const ANIMATION_DURATION_NORMAL = 300;
export const ANIMATION_DURATION_SLOW = 500;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_DOCUMENT_TYPES = ["application/pdf"];

// Validation
export const MIN_NAME_LENGTH = 1;
export const MAX_NAME_LENGTH = 100;
export const MAX_TITLE_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 255;
export const MAX_BIO_LENGTH = 500;
export const MAX_DESCRIPTION_LENGTH = 2000;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Drag & Drop
export const DRAG_DROP_OVERLAY_CLASS = "bg-primary/10 border-2 border-primary";

// Storage Paths
export const STORAGE_PATHS = {
  PROFILES: "profiles",
  SKILLS: "skills",
  PROJECTS: "projects",
  SOCIAL_LINKS: "social-links",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to perform this action",
  FORBIDDEN: "You don't have permission to perform this action",
  NOT_FOUND: "The requested resource was not found",
  INTERNAL_ERROR: "An unexpected error occurred. Please try again",
  INVALID_INPUT: "Please check your input and try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: "Invalid file type. Please upload a valid file",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: "Created successfully",
  UPDATED: "Updated successfully",
  DELETED: "Deleted successfully",
  REORDERED: "Order updated successfully",
  SAVED: "Saved successfully",
} as const;
