"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { Skeleton } from "@/components/ui/Skeleton";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useSkills } from "@/hooks/useSkills";
import { useAuth } from "@/hooks/useAuth";
import { SkillCard } from "@/components/dashboard/skills/SkillCard";
import { SkillModal } from "@/components/dashboard/skills/SkillModal";
import { Skill } from "@/types/skill";

export default function SkillsPage() {
  const {
    skills,
    isLoading,
    isSubmitting,
    isDeleting,
    reorderSkills,
    createSkill,
    updateSkill,
    deleteSkill
  } = useSkills();

  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpenModal = (skill: Skill | null = null) => {
    setCurrentSkill(skill);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSkill(null);
  };

  const onModalSubmit = async (formData: FormData) => {
    if (currentSkill?.id) {
      return await updateSkill(currentSkill.id, formData);
    } else {
      return await createSkill(formData);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (deleteTargetId) {
      const success = await deleteSkill(deleteTargetId);
      if (success) {
        setIsDeleteModalOpen(false);
        setDeleteTargetId(null);
      }
    }
  };

  return (
    <DashboardLayout user={user} onLogout={logout} title="Skills Management">
      <PageHeader 
        title="Technical Skills" 
        description="Manage your expertise and technical stack"
      >
        <Button onClick={() => handleOpenModal()} leftIcon={Plus}>
          Add New Skill
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton width={24} height={24} className="rounded-md" />
                  <Skeleton width={48} height={48} className="rounded-xl" />
                </div>
                <div className="flex gap-1">
                  <Skeleton width={32} height={32} className="rounded-lg" />
                  <Skeleton width={32} height={32} className="rounded-lg" />
                </div>
              </div>
              <Skeleton width={120} height={24} />
              <div className="space-y-2">
                <Skeleton className="w-full" height={14} />
                <Skeleton className="w-full" height={14} />
                <Skeleton className="w-2/3" height={14} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={reorderSkills}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext items={skills.map(s => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <SkillCard 
                  key={skill.id} 
                  skill={skill} 
                  index={index}
                  onEdit={() => handleOpenModal(skill)}
                  onDelete={() => openDeleteModal(skill.id)}
                />
              ))}
              {skills.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500">No skills added yet. Start by adding one!</p>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <SkillModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onSubmit={onModalSubmit}
        currentSkill={currentSkill}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? It will be permanently removed from your portfolio."
      />
    </DashboardLayout>
  );
}
