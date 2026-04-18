import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X, GripVertical } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { Project } from "@/types/project";
import { useModalForm } from "@/hooks/useModalForm";
import { CrudResult } from "@/hooks/useCRUD";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<CrudResult>;
  currentProject: Partial<Project> | null;
  isLoading: boolean;
}

interface SortableGalleryImageProps {
  preview: { id?: string; file?: File; url: string };
  index: number;
  onRemove: (index: number) => void;
}

const SortableGalleryImage = ({ preview, index, onRemove }: SortableGalleryImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: preview.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-16 h-16 md:w-18 md:h-18 rounded-lg overflow-hidden border border-gray-200 group ring-2 ring-transparent hover:ring-blue-500 transition-all bg-surface-container-low"
    >
      <Image src={preview.url} alt="Gallery" fill className="object-cover" unoptimized />
      
      {/* Drag Handle Overlay */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity"
      >
        <GripVertical className="w-6 h-6 text-white" />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-black/50 hover:bg-error rounded-full p-1 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export const ProjectModal = ({ isOpen, onClose, onSubmit, currentProject, isLoading }: ProjectModalProps) => {
  const [galleryPreviews, setGalleryPreviews] = useState<{ id?: string, file?: File, url: string }[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { formData, handleChange, reset, errors, setErrors } = useModalForm<{
    title: string;
    overview: string;
    narrative: string;
    core_engine: string;
    development_stack: string;
    database_stack: string;
    link: string;
    info: string;
    thumbnail: File | string | null;
  }>({
    initialValues: {
      title: "",
      overview: "",
      narrative: "",
      core_engine: "",
      development_stack: "",
      database_stack: "",
      link: "",
      info: "",
      thumbnail: null,
    },
    currentItem: currentProject,
    isOpen,
  });

  // Sync gallery previews separately because it's complex array logic
  useEffect(() => {
    if (isOpen) {
      if (currentProject?.images && currentProject.images.length > 0) {
        setGalleryPreviews(currentProject.images.map(img => ({ id: img.id, url: img.name })));
      } else {
        setGalleryPreviews([]);
      }
      setRemovedImages([]);
    }
  }, [isOpen, currentProject]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGalleryPreviews((items) => {
        const oldIndex = items.findIndex((item) => item.url === active.id);
        const newIndex = items.findIndex((item) => item.url === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("overview", formData.overview);
    submitData.append("narrative", formData.narrative);
    submitData.append("core_engine", formData.core_engine);
    submitData.append("development_stack", formData.development_stack);
    submitData.append("database_stack", formData.database_stack);
    submitData.append("link", formData.link);
    submitData.append("info", formData.info);

    if (formData.thumbnail instanceof File) {
      submitData.append("thumbnail", formData.thumbnail);
    } else if (typeof formData.thumbnail === "string") {
      submitData.append("thumbnail", formData.thumbnail);
    }

    // Send ordered identifiers
    // Existing images use their URL/path, new images use a placeholder "new-X"
    let newFileCount = 0;
    const imageOrder = galleryPreviews.map(p => {
      if (p.file) {
        return `new-${newFileCount++}`;
      }
      return p.url;
    });
    submitData.append("imageOrder", JSON.stringify(imageOrder));

    // Append new files in the order they appear (to match imageOrder placeholders)
    galleryPreviews.forEach(preview => {
      if (preview.file) {
        submitData.append("images", preview.file);
      }
    });

    removedImages.forEach(path => {
      submitData.append("removedImages", path);
    });

    const result = await onSubmit(submitData);
    if (result.success) {
      reset();
      onClose();
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const modalFooter = (
    <div className="flex gap-3 w-full">
      <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
        Cancel
      </Button>
      <Button isLoading={isLoading} className="flex-1" type="submit" form="project-form">
        {currentProject?.id ? "Update Project" : "Save Project"}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={currentProject?.id ? "Edit Project" : "Add New Project"}
      maxWidth="max-w-4xl"
      footer={modalFooter}
    >
      <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Title"
            placeholder="Unique Project Name"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
          />
          <Input
            label="Project Link (Optional)"
            placeholder="https://example.com"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
            error={errors.link}
          />
        </div>

        <Input
          label="Additional Info (Short Tagline)"
          placeholder="e.g. Next.js • Tailwind • Supabase"
          value={formData.info}
          onChange={(e) => handleChange("info", e.target.value)}
          error={errors.info}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageInput
            label="Thumbnail Image"
            value={formData.thumbnail}
            onChange={(file) => handleChange("thumbnail", file)}
            aspectRatio="aspect-video"
            error={errors.thumbnail}
          />

          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 block">Gallery Images</label>
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
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors w-full justify-center border-2 border-dashed border-blue-200 dark:border-blue-900/30"
              >
                <Plus className="w-4 h-4" />
                Add Gallery Images
              </label>
            </div>
            <div className="mt-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={galleryPreviews.map((p) => p.url)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {galleryPreviews.map((preview, idx) => (
                      <SortableGalleryImage
                        key={preview.url}
                        preview={preview}
                        index={idx}
                        onRemove={removeGalleryImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>

        <Textarea
          label="Project Overview (Short)"
          placeholder="A brief summary of the project"
          value={formData.overview}
          onChange={(e) => handleChange("overview", e.target.value)}
          error={errors.overview}
        />

        <Textarea
          label="Narrative (Long)"
          placeholder="Detailed story or explanation of the project"
          value={formData.narrative}
          onChange={(e) => handleChange("narrative", e.target.value)}
          error={errors.narrative}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Core Engine"
            placeholder="e.g. React / TypeScript"
            value={formData.core_engine}
            onChange={(e) => handleChange("core_engine", e.target.value)}
            error={errors.core_engine}
          />
          <Input
            label="Development"
            placeholder="e.g. Next.js / Tailwind CSS"
            value={formData.development_stack}
            onChange={(e) => handleChange("development_stack", e.target.value)}
            error={errors.development_stack}
          />
          <Input
            label="Database"
            placeholder="e.g. PostgreSQL / Auth / Storage"
            value={formData.database_stack}
            onChange={(e) => handleChange("database_stack", e.target.value)}
            error={errors.database_stack}
          />
        </div>
      </form>
    </Modal>
  );
};
