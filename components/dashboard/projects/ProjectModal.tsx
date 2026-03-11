import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { Project } from "@/types/project";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  currentProject: Partial<Project> | null;
  isLoading: boolean;
}

export const ProjectModal = ({ isOpen, onClose, onSubmit, currentProject, isLoading }: ProjectModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [info, setInfo] = useState("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<{ id?: string, file?: File, url: string }[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  useEffect(() => {
    if (currentProject) {
      setTitle(currentProject.title || "");
      setDescription(currentProject.description || "");
      setLink(currentProject.link || "");
      setInfo(currentProject.info || "");
      setThumbnail(currentProject.thumbnail || null);
      setGalleryPreviews(currentProject.images?.map(img => ({ id: img.id, url: img.name })) || []);
      setRemovedImages([]);
    } else {
      setTitle("");
      setDescription("");
      setLink("");
      setInfo("");
      setThumbnail(null);
      setGalleryPreviews([]);
      setRemovedImages([]);
    }
  }, [currentProject, isOpen]);

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
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    formData.append("info", info);
    
    if (thumbnail instanceof File) {
      formData.append("thumbnail", thumbnail);
    } else if (typeof thumbnail === "string") {
      formData.append("thumbnail", thumbnail);
    }

    galleryPreviews.forEach(preview => {
      if (preview.file) {
        formData.append("images", preview.file);
      }
    });

    removedImages.forEach(path => {
      formData.append("removedImages", path);
    });

    const success = await onSubmit(formData);
    if (success) onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={currentProject?.id ? "Edit Project" : "Add New Project"}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Title"
            placeholder="Unique Project Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Project Link (Optional)"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <Input
          label="Additional Info (Short Tagline)"
          placeholder="e.g. Next.js • Tailwind • Supabase"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageInput
            label="Thumbnail Image"
            value={thumbnail}
            onChange={(file) => setThumbnail(file)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
            Cancel
          </Button>
          <Button isLoading={isLoading} className="flex-1" type="submit">
            {currentProject?.id ? "Update Project" : "Save Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
