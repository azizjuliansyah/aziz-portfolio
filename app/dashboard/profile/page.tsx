"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { Input } from "@/components/ui/Input";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useProfiles } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { ProfileGrid } from "@/components/dashboard/profile";
import { DashboardLoadingSkeleton } from "@/components/dashboard/common";

export default function ProfileListPage() {
  const { profiles, isLoading, isSubmitting, isDeleting, createProfile, deleteProfile, toggleActive } = useProfiles();
  const { logout } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [createProfileErrors, setCreateProfileErrors] = useState<Record<string, string>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateProfileErrors({});

    const result = await createProfile(newProfileName);
    if (result.success && result.data) {
      setIsCreateModalOpen(false);
      setNewProfileName("");
      setCreateProfileErrors({});
      router.push(`/dashboard/profile/${result.data.id}`);
    } else if (result.errors) {
      setCreateProfileErrors(result.errors);
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
        <DashboardLoadingSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={logout} title="Public Profiles">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <ProfileGrid
          profiles={profiles}
          onCreateProfile={() => setIsCreateModalOpen(true)}
          onToggleActive={toggleActive}
          onDeleteClick={openDeleteModal}
        />

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
              error={createProfileErrors.name}
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
          message="Are you sure you want to delete this profile? All associated information will be permanently removed. This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
