import React, { useState } from "react";
import Image from "next/image";
import { Plus, Image as ImageIcon } from "lucide-react";
import { Skill } from "@/types/skill";
import { CrudModal } from "@/components/dashboard/common";

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  currentSkill: Partial<Skill> | null;
  isLoading: boolean;
}

export const SkillModal = ({ isOpen, onClose, onSubmit, currentSkill, isLoading }: SkillModalProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const fields = [
    {
      name: "title",
      label: "Skill Title",
      type: "text" as const,
      placeholder: "e.g. React.js, Python, Figma",
      required: true,
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const renderCustomFields = (formData: Record<string, any>, handleChange: (name: string, value: any) => void) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
          Icon / Image
        </label>
        <div
          className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-outline/20 bg-surface-container-low hover:bg-surface-container"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) {
              handleChange("image", file);
            }
          }}
        >
          <div className="w-16 h-16 bg-surface rounded-xl border border-outline/10 flex items-center justify-center text-on-surface/40 overflow-hidden shadow-sm flex-shrink-0">
            {formData.image ? (
              <Image
                src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)}
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
                if (file) handleChange("image", file);
              }}
            />
            <label
              htmlFor="skill-image"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/10 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              Choose File
            </label>
            <p className="text-xs text-on-surface/50 mt-1">
              Drag & drop or select PNG, JPG, SVG up to 2MB
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      currentItem={currentSkill}
      isLoading={isLoading}
      fields={fields}
      entityName="Skill"
      renderCustomFields={renderCustomFields}
    />
  );
};
