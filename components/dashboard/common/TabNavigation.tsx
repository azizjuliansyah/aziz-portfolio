"use client";

import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b border-outline/10 px-6 pt-4 bg-surface-container-low/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`pb-4 px-4 text-sm font-medium transition-colors border-b-2 relative cursor-pointer ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface/50 hover:text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
