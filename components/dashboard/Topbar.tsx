"use client";

import { Bell, Menu } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  title: string;
  user: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
  onMenuClick?: () => void;
}

export function Topbar({ title, user, onMenuClick }: TopbarProps) {
  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-20 border-b border-outline/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-on-surface/60 rounded-lg hover:bg-surface-container-high transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="hidden md:block text-xl font-semibold text-on-surface">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface/60 hover:bg-surface-container-high rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>
        <Link href="/dashboard/settings" className="flex items-center gap-3 pl-4 border-l border-outline/10 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-on-surface">{user?.name || "User"}</p>
            <p className="text-xs text-on-surface/60">{user?.email || "email@example.com"}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 overflow-hidden">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || "U"
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
