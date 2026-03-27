"use client";

import { LucideIcon, LayoutDashboard, User, Settings, LogOut, Code, Info, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-container border-r border-outline/10 fixed h-full z-10 transition-transform">
      <div className="p-6 border-b border-outline/10 flex items-center gap-2">
        <div className="w-10 h-8 bg-primary rounded-lg flex items-center justify-center text-on-primary font-bold">A's</div>
        <h1 className="text-xl font-bold text-on-surface tracking-tight">Portfolio<span className="text-primary">.</span></h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="px-2 py-2 text-xs font-semibold text-on-surface/40 uppercase tracking-wider">Main</div>
        <NavLink icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={pathname === "/dashboard"} />
        <NavLink icon={User} label="Public Profile" href="/dashboard/profile" active={pathname.startsWith("/dashboard/profile")} />

        <div className="px-2 py-2 pt-6 text-xs font-semibold text-on-surface/40 uppercase tracking-wider">Account</div>
        <NavLink icon={Settings} label="Admin Settings" href="/dashboard/settings" active={pathname === "/dashboard/settings"} />
      </nav>

      <div className="p-4 border-t border-outline/10">
        <button
          onClick={onLogout}
          className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-error hover:bg-error/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function NavLink({ icon: Icon, label, href = "#", active = false }: { icon: LucideIcon, label: string, href?: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors
        ${active
          ? "text-primary bg-primary/10"
          : "text-on-surface/70 hover:bg-on-surface/5"}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}

