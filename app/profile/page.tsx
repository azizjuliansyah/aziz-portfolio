"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { loginSuccess, logout } from "../store/features/authSlice";
import { User, Mail, Lock, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader } from "@/components/ui/Card";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.image || null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      if (data.logoutRequired) {
        dispatch(logout());
        router.push("/login");
        return;
      }

      dispatch(loginSuccess({ user: data.user, token: (window as any).localStorage.getItem("token") || "" })); // Token is in cookie, but slice expects it. 
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="User Profile" 
      user={user} 
      onLogout={() => {
        dispatch(logout());
        router.push("/login");
      }}
    >
      <div className="max-w-2xl mx-auto">
        <Card noPadding>
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Update your account detail and profile picture</p>
          </CardHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {message && (
              <div className={`p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-600 dark:bg-green-900/10" : "bg-red-50 text-red-600 dark:bg-red-900/10"}`}>
                {message.text}
              </div>
            )}

            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-5 h-5" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-xs text-gray-500">Allowed JPG, PNG. Max size 2MB</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                placeholder="Your Name"
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                placeholder="your@email.com"
              />
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={isLoading} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
