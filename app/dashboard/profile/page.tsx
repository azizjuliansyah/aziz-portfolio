"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { FileInput } from "@/components/ui/FileInput";
import { Save, User, Mail, Phone, MapPin, Github, Linkedin, Instagram, Twitter, FileText, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { profile, isLoading, isSubmitting, updateProfile } = useProfile();
  const { logout } = useAuth();
  
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [avatar, setAvatar] = useState<File | string | null>(null);
  const [cv, setCv] = useState<File | string | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setTitle(profile.title || "");
      setEmail(profile.email || "");
      setBio(profile.bio || "");
      setPhone(profile.phone || "");
      setLocation(profile.location || "");
      setGithub(profile.github || "");
      setLinkedin(profile.linkedin || "");
      setInstagram(profile.instagram || "");
      setTwitter(profile.twitter || "");
      setAvatar(profile.avatar || null);
      setCv(profile.cv || null);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("github", github);
    formData.append("linkedin", linkedin);
    formData.append("instagram", instagram);
    formData.append("twitter", twitter);

    if (avatar instanceof File) formData.append("avatar", avatar);
    if (cv instanceof File) formData.append("cv", cv);

    await updateProfile(formData);
  };

  if (isLoading) {
    return (
      <DashboardLayout user={user} onLogout={logout} title="Profile Settings">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm">
            <Skeleton width={128} height={128} className="rounded-full" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <Skeleton width={200} height={32} />
              <Skeleton width={300} height={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="space-y-4">
              <Skeleton width={150} height={24} className="mb-4" />
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton width={100} height={14} />
                  <Skeleton className="w-full" height={40} />
                </div>
              ))}
            </Card>
            <Card className="space-y-4">
              <Skeleton width={150} height={24} className="mb-4" />
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton width={100} height={14} />
                  <Skeleton className="w-full" height={40} />
                </div>
              ))}
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={logout} title="Profile Settings">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Hero Section */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <ImageInput
              value={avatar}
              onChange={setAvatar}
              shape="circle"
              label=""
            />
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{name || "Your Name"}</h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium">{title || "Professional Title"}</p>
              <p className="text-gray-500 dark:text-gray-400 max-w-lg text-sm line-clamp-2">
                {bio || "Tell the world about yourself..."}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <Mail className="w-4 h-4" /> {email}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" /> {location || "Location not set"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
               <Button type="submit" isLoading={isSubmitting} leftIcon={Save} className="shadow-lg shadow-blue-500/20">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Basic Information */}
          <Card title="Basic Information" icon={User} className="space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Professional Title" value={title} onChange={(e) => setTitle(e.target.value)} icon={Briefcase} required />
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} icon={Phone} />
              <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} icon={MapPin} />
            </div>
            <Textarea label="Bio / Professional Summary" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
          </Card>

          {/* Documents & Links */}
          <div className="space-y-8">
            <Card title="Resume / CV" icon={FileText} className="space-y-4">
              <FileInput
                label="Upload CV (PDF or Image)"
                value={cv}
                onChange={setCv}
                helperText="Recommended: PDF under 5MB"
              />
            </Card>

            <Card title="Social Links" icon={Github} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <Input label="GitHub" value={github} onChange={(e) => setGithub(e.target.value)} icon={Github} placeholder="https://github.com/..." />
                <Input label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} icon={Linkedin} placeholder="https://linkedin.com/in/..." />
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} icon={Instagram} />
                   <Input label="Twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} icon={Twitter} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
