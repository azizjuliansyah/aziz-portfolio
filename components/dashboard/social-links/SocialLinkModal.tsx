import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SocialLink } from "@/types/socialLink";

interface SocialLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  currentLink: Partial<SocialLink> | null;
  isLoading: boolean;
}

export const SocialLinkModal = ({ isOpen, onClose, onSubmit, currentLink, isLoading }: SocialLinkModalProps) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (currentLink) {
      setName(currentLink.name || "");
      setLink(currentLink.link || "");
      setImage(currentLink.image || null);
    } else {
      setName("");
      setLink("");
      setImage(null);
    }
  }, [currentLink, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    
    if (image instanceof File) {
      formData.append("image", image);
    } else if (typeof image === "string") {
      formData.append("image", image);
    }

    const success = await onSubmit(formData);
    if (success) onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={currentLink?.id ? "Edit Social Link" : "Add New Social Link"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="e.g. LinkedIn, GitHub, Instagram"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Icon / Image</label>
          <div 
            className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-colors ${
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-outline/20 bg-surface-container-low hover:bg-surface-container"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-surface rounded-xl border border-outline/10 flex items-center justify-center text-on-surface/40 overflow-hidden shadow-sm flex-shrink-0">
              {image ? (
                  <Image 
                    src={typeof image === "string" ? image : URL.createObjectURL(image)} 
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
                id="social-link-image"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImage(file);
                }}
              />
              <label 
                htmlFor="social-link-image"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <ImageIcon className="w-4 h-4" />
                Choose File
              </label>
              <p className="text-xs text-on-surface/50 mt-1">Drag & drop or select PNG, JPG, SVG up to 2MB</p>
            </div>
          </div>
        </div>

        <Input
          label="URL Link"
          placeholder="https://..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
          type="url"
        />

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
            Cancel
          </Button>
          <Button isLoading={isLoading} className="flex-1" type="submit">
            {currentLink?.id ? "Update Link" : "Create Link"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
