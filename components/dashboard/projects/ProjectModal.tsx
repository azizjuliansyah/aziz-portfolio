import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { Project } from "@/types/project";
import { useModalForm } from "@/hooks/useModalForm";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  currentProject: Partial<Project> | null;
  isLoading: boolean;
}

export const ProjectModal = ({ isOpen, onClose, onSubmit, currentProject, isLoading }: ProjectModalProps) => {
  const [galleryPreviews, setGalleryPreviews] = useState<{ id?: string, file?: File, url: string }[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const { formData, handleChange, reset } = useModalForm<{
    title: string;
    description: string;
    link: string;
    info: string;
    thumbnail: File | string | null;
  }>({
    initialValues: {
      title: "",
      description: "",
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
    submitData.append("description", formData.description);
    submitData.append("link", formData.link);
    submitData.append("info", formData.info);

    if (formData.thumbnail instanceof File) {
      submitData.append("thumbnail", formData.thumbnail);
    } else if (typeof formData.thumbnail === "string") {
      submitData.append("thumbnail", formData.thumbnail);
    }

    galleryPreviews.forEach(preview => {
      if (preview.file) {
        submitData.append("images", preview.file);
      }
    });

    removedImages.forEach(path => {
      submitData.append("removedImages", path);
    });

    const success = await onSubmit(submitData);
    if (success) {
      reset();
      onClose();
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
            required
          />
          <Input
            label="Project Link (Optional)"
            placeholder="https://example.com"
            value={formData.link}
            onChange={(e) => handleChange("link", e.target.value)}
          />
        </div>

        <Input
          label="Additional Info (Short Tagline)"
          placeholder="e.g. Next.js • Tailwind • Supabase"
          value={formData.info}
          onChange={(e) => handleChange("info", e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageInput
            label="Thumbnail Image"
            value={formData.thumbnail}
            onChange={(file) => handleChange("thumbnail", file)}
            aspectRatio="aspect-video"
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
            <div className="flex flex-wrap gap-2 mt-2">
              {galleryPreviews.map((preview, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group ring-2 ring-transparent hover:ring-blue-500 transition-all">
                  <Image src={preview.url} alt="Gallery" fill className="object-cover" unoptimized />
                  <button 
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Textarea
          label="Description"
          placeholder="What makes this project special?"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </form>
    </Modal>
  );
};
