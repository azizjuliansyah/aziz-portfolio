import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skill } from "@/types/skill";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  currentSkill: Partial<Skill> | null;
  isLoading: boolean;
}

export const SkillModal = ({ isOpen, onClose, onSubmit, currentSkill, isLoading }: SkillModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | string | null>(null);

  useEffect(() => {
    if (currentSkill) {
      setTitle(currentSkill.title || "");
      setDescription(currentSkill.description || "");
      setImage(currentSkill.image || null);
    } else {
      setTitle("");
      setDescription("");
      setImage(null);
    }
  }, [currentSkill, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    
    if (image instanceof File) {
      formData.append("image", image);
    } else if (typeof image === "string") {
      formData.append("image", image);
    }

    const success = await onSubmit(formData);
    if (success) onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={currentSkill?.id ? "Edit Skill" : "Add New Skill"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Skill Title"
          placeholder="e.g. React.js, Python, Figma"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Icon / Image</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-950 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-400 overflow-hidden">
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
                id="skill-image"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImage(file);
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
            Cancel
          </Button>
          <Button isLoading={isLoading} className="flex-1" type="submit">
            {currentSkill?.id ? "Update Skill" : "Create Skill"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
