/**
 * Application route constants
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: {
    HOME: "/dashboard",
    PROFILE: "/dashboard/profile",
    PROJECTS: "/dashboard/projects",
    SKILLS: "/dashboard/skills",
    EXPERIENCE: "/dashboard/experience",
    EDUCATION: "/dashboard/education",
    SERVICES: "/dashboard/services",
    CONTACTS: "/dashboard/contacts",
    BLOGS: "/dashboard/blogs",
    SETTINGS: "/dashboard/settings",
  },
} as const;
export type AppRoutes = typeof ROUTES;

