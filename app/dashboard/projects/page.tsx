"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Image as ImageIcon, 
  ExternalLink, 
  X,
  GripVertical
} from "lucide-react";
import { logout } from "@/app/store/features/authSlice";
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
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

interface ProjectImage {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  thumbnail: string | File;
  link?: string;
  info?: string;
  description: string;
  order: number;
  images: ProjectImage[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<{ id?: string, file?: File, url: string }[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
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
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);

      const newProjects = arrayMove(projects, oldIndex, newIndex);
      
      const updatedProjects = newProjects.map((p, index) => ({
        ...p,
        order: index,
      }));
      setProjects(updatedProjects);

      try {
        await fetch("/api/projects/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: updatedProjects.map((p) => ({ id: p.id, order: p.order })),
          }),
        });
      } catch (error) {
        console.error("Failed to save reorder:", error);
        fetchProjects();
      }
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
    router.push("/login");
  };

  const handleOpenModal = (project: Project | null = null) => {
    if (project) {
      setCurrentProject(project);
      setGalleryPreviews(project.images.map(img => ({ id: img.id, url: img.name })));
      setRemovedImages([]);
    } else {
      setCurrentProject({ title: "", description: "", thumbnail: "", link: "", info: "" });
      setGalleryPreviews([]);
      setRemovedImages([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProject(null);
    setGalleryPreviews([]);
    setRemovedImages([]);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews = Array.from(files).map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    const imageToRemove = galleryPreviews[index];
    if (imageToRemove.id) {
      setRemovedImages([...removedImages, imageToRemove.url]);
    }
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    setIsSubmitting(true);

    try {
      const isEditing = !!currentProject.id;
      const url = isEditing ? `/api/projects/${currentProject.id}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", currentProject.title || "");
      formData.append("description", currentProject.description || "");
      formData.append("link", currentProject.link || "");
      formData.append("info", currentProject.info || "");
      
      if (currentProject.thumbnail instanceof File) {
        formData.append("thumbnail", currentProject.thumbnail);
      } else if (typeof currentProject.thumbnail === "string") {
        formData.append("thumbnail", currentProject.thumbnail);
      }

      // Append new gallery files
      galleryPreviews.forEach(preview => {
        if (preview.file) {
          formData.append("images", preview.file);
        }
      });

      // Append removed images info
      removedImages.forEach(path => {
        formData.append("removedImages", path);
      });

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        fetchProjects();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Failed to save project:", error);
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
      const res = await fetch(`/api/projects/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== deleteTargetId));
        setIsDeleteModalOpen(false);
        setDeleteTargetId(null);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout} title="Projects Management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Projects</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your showcase work and contributions</p>
        </div>
        <Button onClick={() => handleOpenModal()} leftIcon={Plus}>
          Add New Project
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
          <SortableContext items={projects.map(p => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <SortableProjectItem 
                  key={project.id} 
                  project={project} 
                  index={index}
                  onEdit={() => handleOpenModal(project)}
                  onDelete={() => openDeleteModal(project.id)}
                />
              ))}
              {projects.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                  <p className="text-gray-500">No projects added yet.</p>
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
        title={currentProject?.id ? "Edit Project" : "Add New Project"}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              placeholder="Unique Project Name"
              value={currentProject?.title || ""}
              onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
              required
            />
            <Input
              label="Project Link (Optional)"
              placeholder="https://example.com"
              value={currentProject?.link || ""}
              onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
            />
          </div>

          <Input
            label="Additional Info (Short Tagline)"
            placeholder="e.g. Next.js • Tailwind • Prisma"
            value={currentProject?.info || ""}
            onChange={(e) => setCurrentProject({ ...currentProject, info: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Thumbnail Image</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-950 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 overflow-hidden relative">
                  {currentProject?.thumbnail ? (
                      <Image 
                        src={typeof currentProject.thumbnail === "string" ? currentProject.thumbnail : URL.createObjectURL(currentProject.thumbnail)} 
                        alt="Thumbnail" 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                  ) : (
                    <ImageIcon className="w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    id="project-thumbnail"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCurrentProject({ ...currentProject, thumbnail: file });
                    }}
                  />
                  <label 
                    htmlFor="project-thumbnail"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Change Thumbnail
                  </label>
                </div>
              </div>
            </div>

            {/* Gallery Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Gallery Images</label>
              <div>
                <input
                  type="file"
                  id="project-gallery"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                />
                <label 
                  htmlFor="project-gallery"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Gallery Images
                </label>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {galleryPreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 group">
                    <Image src={preview.url} alt="Gallery" fill className="object-cover" unoptimized />
                    <button 
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Description</label>
            <textarea
              className="w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:border-blue-500 focus:ring-blue-500 transition-all text-sm p-3 outline-none border min-h-[120px]"
              placeholder="What makes this project special?"
              value={currentProject?.description || ""}
              onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={handleCloseModal} className="flex-1" type="button">
              Cancel
            </Button>
            <Button isLoading={isSubmitting} className="flex-1" type="submit">
              {currentProject?.id ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </form>
      </Modal>

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated gallery images will also be removed."
      />

    </DashboardLayout>
  );
}

function SortableProjectItem({ 
  project, 
  index, 
  onEdit, 
  onDelete 
}: { 
  project: Project; 
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
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="group relative h-full flex flex-col hover:border-blue-500 transition-all duration-300" noPadding>
        <div className="relative aspect-video w-full overflow-hidden">
          <div className="absolute top-3 left-3 z-10 flex gap-2">
            <div 
              {...listeners}
              className="p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-lg cursor-grab active:cursor-grabbing text-gray-600 hover:text-blue-500 shadow-sm"
              title="Drag to reorder"
            >
               <GripVertical className="w-4 h-4" />
            </div>
            <div className="px-2 py-1 bg-blue-600/90 text-white text-[10px] font-bold rounded-lg shadow-sm flex items-center">
              #{index + 1}
            </div>
          </div>
          
          <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-2 bg-white/90 dark:bg-gray-900/90 text-gray-600 hover:text-blue-600 rounded-lg shadow-sm"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/90 dark:bg-gray-900/90 text-gray-600 hover:text-red-600 rounded-lg shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {project.thumbnail ? (
            <Image src={project.thumbnail as string} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
               <ImageIcon className="w-12 h-12" />
            </div>
          )}
        </div>
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{project.title}</h3>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <p className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider mb-2 truncate">
            {project.info || "Personal Project"}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 flex-1">{project.description}</p>
          
          {project.images?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-hidden">
               {project.images.slice(0, 4).map((img) => (
                 <div key={img.id} className="relative w-8 h-8 rounded-md overflow-hidden border border-gray-100">
                    <Image src={img.name} alt="Gallery" fill className="object-cover" unoptimized />
                 </div>
               ))}
               {project.images.length > 4 && (
                 <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-500">
                    +{project.images.length - 4}
                 </div>
               )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
