"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActionButton } from "@/components/ui/ActionButton";
import {
  User, Globe, Calendar, ArrowRight, CheckCircle2, Eye, Trash2, Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Profile {
  id: string;
  name: string;
  title?: string | null;
  avatar?: string | File | null;
  is_active?: boolean;
  updated_at?: string | null;
}

interface ProfileGridProps {
  profiles: Profile[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateProfile: () => void;
  onToggleActive: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export function ProfileGrid({
  profiles,
  searchQuery,
  onSearchChange,
  onCreateProfile,
  onToggleActive,
  onDeleteClick,
}: ProfileGridProps) {
  const router = useRouter();

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Public Profiles
          </h1>
          <p className="text-on-surface/60 text-sm">Manage multiple portfolio versions for different audiences</p>
        </div>
        <Button onClick={onCreateProfile} leftIcon={Plus} className="shadow-lg shadow-blue-500/20">
          Create Profile
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="bg-surface-container-low border-outline/10">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search profiles by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline/10 rounded-xl text-sm focus:border-primary focus:ring-primary focus:ring-offset-0 outline-none transition-all text-on-surface"
          />
        </div>
      </Card>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <Card
            key={profile.id}
            noPadding
            className={`group transition-all duration-300 overflow-hidden cursor-pointer shadow-sm ${profile.is_active
                ? "shadow-lg shadow-primary/10 animate-border-beam"
                : "hover:border-primary/50 border-2 border-transparent"
              }`}
            onClick={() => router.push(`/dashboard/profile/${profile.id}`)}
          >
            <div className="p-4 space-y-3 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {profile.avatar ? (
                      <Image
                        src={typeof profile.avatar === 'string' ? profile.avatar : ''}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-lg"
                        alt={profile.name}
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-on-surface truncate">{profile.name}</h3>
                      {profile.is_active && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold bg-primary text-on-primary rounded-full shadow-sm shadow-primary/20">
                          <CheckCircle2 className="w-2.5 h-2.5" /> ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-primary font-medium truncate">{profile.title || 'No title set'}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!profile.is_active ? (
                    <ActionButton
                      variant="primary"
                      title="Set as active"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onToggleActive(profile.id);
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="success"
                      title="View Public Portfolio"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        window.open("/", "_blank");
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </ActionButton>
                  )}
                  <ActionButton
                    variant="danger"
                    title="Delete Profile"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onDeleteClick(profile.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </ActionButton>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-on-surface/50 pt-2 border-t border-outline/10">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Just now'}
                </span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-primary" />
              </div>
            </div>
          </Card>
        ))}

        {filteredProfiles.length === 0 && (
          <div className="col-span-full py-16 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline/20">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Globe className="w-8 h-8 text-on-surface/20" />
            </div>
            <p className="text-on-surface/60 font-medium">No profiles found.</p>
            <p className="text-sm text-on-surface/40 mt-1">Create your first public profile to get started!</p>
          </div>
        )}
      </div>
    </>
  );
}
