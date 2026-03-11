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
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed h-full z-10 transition-transform">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Portfolio<span className="text-blue-600">.</span></h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <div className="px-2 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</div>
        <NavLink icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={pathname === "/dashboard"} />
        <NavLink icon={User} label="Public Profile" href="/dashboard/profile" active={pathname === "/dashboard/profile"} />
        <NavLink icon={Code} label="Skills" href="/dashboard/skills" active={pathname === "/dashboard/skills"} />
        <NavLink icon={Briefcase} label="Projects" href="/dashboard/projects" active={pathname === "/dashboard/projects"} />
        
        <div className="px-2 py-2 pt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</div>
        <NavLink icon={Settings} label="Admin Settings" href="/dashboard/settings" active={pathname === "/dashboard/settings"} />
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={onLogout}
          className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
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
            ? "text-blue-600 bg-blue-50 dark:bg-blue-900/10" 
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}

