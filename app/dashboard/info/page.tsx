"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Plus, Pencil, Trash2, Info as InfoIcon } from "lucide-react";
import { logout } from "@/app/store/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
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

interface InfoItem {
  id: string;
  key: string;
  info: string;
  description: string;
  order: number;
}

export default function InfoPage() {
  const [items, setItems] = useState<InfoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InfoItem> | null>(null);
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
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await fetch("/api/info");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index,
      }));
      setItems(updatedItems);

      try {
        await fetch("/api/info/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: updatedItems.map((i) => ({ id: i.id, order: i.order })),
          }),
        });
      } catch (error) {
        console.error("Failed to save reorder:", error);
        fetchInfo();
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    router.push("/login");
  };

  const handleOpenModal = (item: InfoItem | null = null) => {
    setCurrentItem(item || { key: "", info: "", description: "" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentItem),
      });

      if (res.ok) {
        fetchInfo();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to save info:", error);
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
      const res = await fetch(`/api/info/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        setItems(items.filter((i) => i.id !== deleteTargetId));
        setIsDeleteModalOpen(false);
        setDeleteTargetId(null);
      }
    } catch (error) {
      console.error("Failed to delete info:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout} title="General Info">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage site-wide content and contact details</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={Plus}>
          Add New Key
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
          <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <SortableInfoItem 
                  key={item.id} 
                  item={item} 
                  index={index}
                  onEdit={() => handleOpenModal(item)}
                  onDelete={() => openDeleteModal(item.id)}
                />
              ))}
              {items.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500">No info items added yet.</p>
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
        title={currentItem?.id ? "Edit Information" : "Add Information"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Information Key"
            placeholder="e.g. about_me, location, github_link"
            value={currentItem?.key || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentItem({ ...currentItem, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })
            }
            required
            disabled={!!currentItem?.id}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Content / Info</label>
            <textarea
              className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm p-3 outline-none border min-h-[120px]"
              placeholder="The actual value/content..."
              value={currentItem?.info || ""}
              onChange={(e) => setCurrentItem({ ...currentItem, info: e.target.value })}
              required
            />
          </div>
          <Input
            label="Description / Note (Internal)"
            placeholder="Brief note about what this info is for"
            value={currentItem?.description || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCurrentItem({ ...currentItem, description: e.target.value })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal} className="flex-1" type="button">
              Cancel
            </Button>
            <Button isLoading={isSubmitting} className="flex-1" type="submit">
              {currentItem?.id ? "Update Info" : "Save Info"}
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
        title="Delete Information"
        message="Are you sure you want to delete this info item? This cannot be undone."
      />

    </DashboardLayout>
  );
}

function SortableInfoItem({ 
  item, 
  index, 
  onEdit, 
  onDelete 
}: { 
  item: InfoItem; 
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
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="group relative overflow-hidden h-full flex flex-col hover:border-blue-500 transition-all duration-300" noPadding>
        <div className="p-6 flex flex-col h-full">
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
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/10 rounded-lg flex items-center justify-center text-blue-600 relative">
                <span className="absolute -top-1 -left-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg z-10">
                  {index + 1}
                </span>
                <InfoIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider truncate max-w-[150px]">{item.key}</h3>
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
          
          <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-900 dark:text-white text-sm whitespace-pre-wrap break-words">{item.info}</p>
            {item.description && (
              <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-3 italic border-t border-gray-200 dark:border-gray-700 pt-2">
                Note: {item.description}
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
