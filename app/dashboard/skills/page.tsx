"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { logout } from "@/app/store/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { DeleteConfirmModal } from "@/components/ui/DeleteConfirmModal";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

interface Skill {
  id: string;
  title: string;
  image: string | File;
  description: string;
  order: number;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Partial<Skill> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over.id);

      const newSkills = arrayMove(skills, oldIndex, newIndex);
      
      // Update local state immediately for snappy UI
      const updatedSkills = newSkills.map((skill, index) => ({
        ...skill,
        order: index,
      }));
      setSkills(updatedSkills);

      // Save to backend
      try {
        await fetch("/api/skills/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: updatedSkills.map((s) => ({ id: s.id, order: s.order })),
          }),
        });
      } catch (error) {
        console.error("Failed to save reorder:", error);
        fetchSkills(); // Revert on failure
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    router.push("/login");
  };

  const handleOpenModal = (skill: Skill | null = null) => {
    setCurrentSkill(skill || { title: "", description: "", image: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSkill(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSkill) return;
    setIsSubmitting(true);

    try {
      const isEditing = !!currentSkill.id;
      const url = isEditing ? `/api/skills/${currentSkill.id}` : "/api/skills";
      const method = isEditing ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", currentSkill.title || "");
      formData.append("description", currentSkill.description || "");
      
      if (currentSkill.image instanceof File) {
        formData.append("image", currentSkill.image);
      } else if (typeof currentSkill.image === "string") {
        formData.append("image", currentSkill.image);
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        fetchSkills();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to save skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/skills/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== deleteTargetId));
        setIsDeleteModalOpen(false);
        setDeleteTargetId(null);
      }
    } catch (error) {
      console.error("Failed to delete skill:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout} title="Skills Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Technical Skills</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your expertise and technical stack</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={Plus}>
          Add New Skill
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges]}
        >
          <SortableContext items={skills.map(s => s.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <SortableSkillItem 
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

      {/* Main Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={currentSkill?.id ? "Edit Skill" : "Add New Skill"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Title"
            placeholder="e.g. React.js, Python, Figma"
            value={currentSkill?.title || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentSkill({ ...currentSkill, title: e.target.value })
            }
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Icon / Image</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-950 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 overflow-hidden">
                {currentSkill?.image ? (
                    <Image 
                    src={typeof currentSkill.image === "string" ? currentSkill.image : URL.createObjectURL(currentSkill.image)} 
                    alt="Preview" 
                    width={64}
                    height={64}
                    className="w-full h-full object-cover" 
                    unoptimized
                    />
                ) : (
                  <Plus className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="skill-image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCurrentSkill({ ...currentSkill, image: file });
                  }}
                />
                <label 
                  htmlFor="skill-image"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose File
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Description</label>
            <textarea
              className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm p-3 outline-none border min-h-[100px]"
              placeholder="Describe your proficiency..."
              value={currentSkill?.description || ""}
              onChange={(e) => setCurrentSkill({ ...currentSkill, description: e.target.value })}
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal} className="flex-1" type="button">
              Cancel
            </Button>
            <Button isLoading={isSubmitting} className="flex-1" type="submit">
              {currentSkill?.id ? "Update Skill" : "Create Skill"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? It will be permanently removed from your portfolio."
      />

    </DashboardLayout>
  );
}

function SortableSkillItem({ 
  skill, 
  index, 
  onEdit, 
  onDelete 
}: { 
  skill: Skill; 
  index: number; 
  onEdit: () => void; 
  onDelete: () => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="group relative overflow-hidden h-full flex flex-col hover:border-blue-500 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              {...listeners}
              className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-500 transition-colors"
              title="Drag to reorder"
            >
              <div className="grid grid-cols-2 gap-0.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-current rounded-full" />
                ))}
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex items-center justify-center text-blue-600 overflow-hidden relative">
              <span className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                {index + 1}
              </span>
              {skill.image ? (
                <Image src={skill.image as string} alt={skill.title} width={48} height={48} className="w-full h-full object-cover" unoptimized />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{skill.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm flex-1">{skill.description}</p>
      </Card>
    </div>
  );
}
