"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeProviderContext {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "system" }: { children: React.ReactNode, defaultTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Sync state with prop if server-side value changes (e.g. on navigation)
  useEffect(() => {
    setTheme(defaultTheme);
  }, [defaultTheme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    
    // CRITICAL: Only use localStorage if the server says 'system' (meaning no global override in DB)
    // Or if there's no default theme at all.
    if (defaultTheme === "system" && savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(defaultTheme);
    }
    setMounted(true);
  }, [defaultTheme]); // Re-sync if defaultTheme changes

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Determine effective theme
    const effectiveTheme = theme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;

    // Apply classes
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
    
    // Persist if not system
    if (theme !== "system") {
      localStorage.setItem("theme", theme);
    } else {
      localStorage.removeItem("theme");
    }
  }, [theme, mounted]);

  // Prevent hydration flash if needed, but suppressHydrationWarning handles this in layout
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
