"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../store/features/authSlice";
import { useRouter } from "next/navigation";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/Card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useTheme } from "@/components/ThemeProvider";

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const themeOptions = [
    { id: "light", name: "Light Mode", icon: Sun, description: "Classic bright appearance" },
    { id: "dark", name: "Dark Mode", icon: Moon, description: "Easier on the eyes in the dark" },
    { id: "system", name: "System Default", icon: Monitor, description: "Sync with your device settings" },
  ];

  return (
    <DashboardLayout title="Settings" user={user} onLogout={handleLogout}>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card noPadding>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Appearance</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Customize how the dashboard looks for you</p>
          </CardHeader>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Theme Preference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTheme(option.id as any)}
                  className={`
                    flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group
                    ${theme === option.id 
                      ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 ring-4 ring-blue-600/10" 
                      : "border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50"}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
                    ${theme === option.id 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:text-blue-500"}
                  `}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <span className={`font-semibold mb-1 ${theme === option.id ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                    {option.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {option.description}
                  </span>
                  
                  {theme === option.id && (
                    <div className="absolute top-4 right-4 text-blue-600">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
