/**
 * API Endpoint constants
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  DASHBOARD: {
    STATS: "/api/dashboard/stats",
  },
  PROFILE: {
    BASE: "/api/portfolio-profile",
    BASIC: "/api/profile/basic",
    SOCIAL: "/api/profile/social",
    UPLOAD: "/api/profile/upload",
  },
  PROJECTS: "/api/projects",
  SKILLS: "/api/skills",
  EXPERIENCE: "/api/experience",
  EDUCATION: "/api/education",
  CERTIFICATES: "/api/certificates",
  SOCIAL_LINKS: "/api/social-links",
  SERVICES: "/api/services",
  CONTACTS: "/api/contacts",
  BLOGS: "/api/blogs",
  SETTINGS: "/api/settings",
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
