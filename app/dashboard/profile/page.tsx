"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import {
  User, UserPlus, Trash2, Settings2, Globe, Calendar, Search, ArrowRight, Plus, Eye, CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfiles } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileListPage() {
  const { profiles, isLoading, isSubmitting, isDeleting, createProfile, deleteProfile, toggleActive } = useProfiles();
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const profile = await createProfile(newProfileName);
    if (profile) {
      setIsCreateModalOpen(false);
      setNewProfileName("");
      router.push(`/dashboard/profile/${profile.id}`);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const success = await deleteProfile(deleteTargetId);
    if (success) {
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout user={user} onLogout={logout} title="Public Profiles">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton width={200} height={32} />
              <Skeleton width={400} height={24} />
            </div>
            <Skeleton width={120} height={40} />
          </div>
          <Card className="bg-surface-container-low border-outline/10">
            <Skeleton width={1180} height={40} className="rounded-lg"></Skeleton>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Skeleton width={40} height={40} className="rounded-lg" />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <Skeleton width={100} height={20} className="rounded-lg" />
                        <Skeleton width={150} height={15} className="rounded-lg" />
                      </div>
                    </div>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={logout} title="Public Profiles">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              Public Profiles
            </h1>
            <p className="text-on-surface/60 text-sm">Manage multiple portfolio versions for different audiences</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={Plus} className="shadow-lg shadow-blue-500/20">
            Create Profile
          </Button>
        </div>

        <Card className="bg-surface-container-low border-outline/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search profiles by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-outline/10 rounded-xl text-sm focus:border-primary focus:ring-primary focus:ring-offset-0 outline-none transition-all text-on-surface"
            />
          </div>
        </Card>

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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {profile.avatar ? (
                        <img
                          src={typeof profile.avatar === 'string' ? profile.avatar : ''}
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
                      <Button
                        variant="ghost"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                        title="Set as active"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleActive(profile.id);
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
                        title="View Public Portfolio"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open("/", "_blank");
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(profile.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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

        {/* Create Profile Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Public Profile"
        >
          <form onSubmit={handleCreateProfile} className="space-y-6">
            <Input
              label="Profile Name"
              placeholder="e.g. My Professional Portfolio, Side Project Profile"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              required
              autoFocus
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} leftIcon={UserPlus}>
                Create Profile
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Public Profile"
          message="Are you sure you want to delete this profile? All associated information, skills, and projects will be permanently removed. This action cannot be undone."
        />

      </div>
    </DashboardLayout>
  );
}
