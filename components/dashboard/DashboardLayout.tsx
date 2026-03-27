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
  return (
    <div className="min-h-screen bg-surface flex font-label text-on-surface">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 md:ml-64 transition-all">
        <Topbar title={title} user={user} />
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
