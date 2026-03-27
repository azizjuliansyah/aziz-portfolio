# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 portfolio website with a built-in admin dashboard. The site displays a public portfolio with projects, skills, experience, and social links. Admin users can log in to manage all content through a dashboard interface.

**Tech Stack:**
- **Framework:** Next.js 16 (App Router) with TypeScript
- **Database:** Supabase (PostgreSQL) with custom schema
- **State:** Redux Toolkit for auth and toast notifications
- **Styling:** Tailwind CSS v4 with Material Design 3 color tokens
- **Auth:** Custom JWT implementation with bcrypt password hashing
- **UI Components:** Custom component library with Material-inspired theming

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Architecture

### Application Structure

```
app/
├── api/                    # API routes (Supabase CRUD operations)
│   ├── auth/              # Login, logout, session verification
│   ├── public/            # Public endpoints for portfolio display
│   ├── dashboard/         # Dashboard stats and data
│   ├── projects/          # Project CRUD + reordering
│   ├── skills/            # Skill CRUD + reordering
│   ├── experience/        # Experience CRUD + reordering
│   ├── social-links/      # Social link CRUD + reordering
│   ├── profile/           # User profile management
│   ├── portfolio-profile/ # Active profile selection
│   └── settings/          # App settings (theme, etc.)
├── dashboard/             # Admin dashboard pages
├── projects/[id]/         # Public project detail pages
├── store/                 # Redux store (auth, toast slices)
├── layout.tsx             # Root layout with providers
└── page.tsx               # Public portfolio landing page

components/
├── ui/                    # Reusable UI components
├── dashboard/             # Dashboard-specific components
└── auth/                  # Authentication components

hooks/                     # Custom React hooks for data fetching
types/                     # TypeScript type definitions
config/db.ts               # Supabase client configuration
```

### Design System

The project uses a custom Material Design 3-inspired design system with CSS variables:

**Color Tokens:** Uses semantic color names like `--color-primary`, `--color-surface`, `--color-on-surface`, `--color-surface-container-*`

**Typography Tiers:**
- `font-headline`: Space Grotesk (headings, display text)
- `font-body`: Newsreader (body content, italic emphasis)
- `font-label`: Manrope (UI elements, buttons, labels)

**Theme System:**
- Three themes: `light`, `dark`, `system`
- Stored in `app_settings` table with `enable_global_theme` flag
- Applies class to `<html>` element in root layout
- Tailwind v4 selector-based dark mode: `--dark-mode: selector`

### Authentication Flow

1. **Login:** `/api/auth/login` - Validates credentials, returns JWT
2. **Session:** JWT stored in httpOnly cookie (`auth_token`)
3. **Verification:** `/api/auth/me` validates token on protected routes
4. **Client:** Redux `authSlice` manages user state
5. **Session Manager:** Client-side component refreshes session on mount

### Data Patterns

**Supabase Client Usage:**
- Public API routes use `supabase` client (anon key)
- Admin operations use `supabaseAdmin` (service role key)
- All queries use `.select()` with proper joins for nested data

**Custom Hooks Pattern:**
- Each domain (skills, projects, etc.) has a custom hook in `hooks/`
- Hooks handle API calls, loading states, and error handling
- Used in dashboard components for CRUD operations

**Reordering Pattern:**
- Skills, projects, experience, and social links support drag-and-drop reordering
- Each has a `reorder` API route accepting ordered array of IDs
- Frontend uses `@dnd-kit` library for drag-and-drop

### Important Conventions

**API Route Pattern:**
- All routes use `supabaseAdmin` for privileged operations
- Return `NextResponse.json()` with proper status codes
- Include error handling with try/catch returning 500 on errors
- Use named exports for route handlers in App Router

**Component Organization:**
- UI components are generic and reusable
- Dashboard components are page-specific
- All components use Tailwind classes with design system tokens
- Client components marked with `"use client"` directive

**TypeScript Types:**
- Domain types defined in `types/` directory
- Match Supabase table structure
- Used consistently across API routes and components

**State Management:**
- Redux used for: auth state, toast notifications
- Local component state for: UI interactions, modals, form data
- No Redux for server data - fetched via hooks

### Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
```

### Database Schema (Key Tables)

- `users`: Admin accounts with password hash
- `portfolio_profiles`: Multiple portfolio configurations (one can be active)
- `projects`: Portfolio projects with thumbnails, images
- `skills`: Categorized skills with images
- `work_experience`: Job history with nested `responsibilities`
- `social_links`: Social media/profile links
- `app_settings`: Global settings including theme

### Common Tasks

**Adding a new API endpoint:**
1. Create route in `app/api/` directory
2. Import `supabaseAdmin` from `@/config/db`
3. Handle errors with try/catch returning appropriate status codes
4. Return JSON responses using `NextResponse.json()`

**Adding a new dashboard feature:**
1. Create domain types in `types/`
2. Create API routes for CRUD operations
3. Create custom hook in `hooks/` for data fetching
4. Create UI components in `components/dashboard/`
5. Create page in `app/dashboard/` using `DashboardLayout`

**Theming components:**
- Use semantic color tokens: `bg-surface`, `text-on-surface`, `border-outline`
- Use typography classes: `font-headline`, `font-body`, `font-label`
- Container variants: `bg-surface-container-low/high`
- For primary actions: `bg-primary text-on-primary`
