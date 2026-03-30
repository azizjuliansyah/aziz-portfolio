"use client";

import { useState } from "react";
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useTheme } from "../ThemeProvider";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  user: User | null;
  onLogout: () => void;
}

export function DashboardLayout({ children, title = "Dashboard", user, onLogout }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-surface flex font-label text-on-surface overflow-hidden">
      <Sidebar
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title={title}
          user={user}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
