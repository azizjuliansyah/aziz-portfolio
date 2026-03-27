import React from "react";
import { Pencil, Trash2, GripVertical, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { WorkExperience } from "@/types/experience";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ExperienceCardProps {
  experience: WorkExperience;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExperienceCard = ({ experience, index, onView, onEdit, onDelete }: ExperienceCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card noPadding className="group relative overflow-hidden transition-all duration-300 hover:border-primary/50 flex flex-col h-full border-outline/10 shadow-sm hover:shadow-md">
        
        {/* Header Section */}
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Drag Handle */}
            <div 
              {...listeners}
              className="p-1.5 bg-surface rounded-lg cursor-grab active:cursor-grabbing text-on-surface/60 hover:text-primary shadow-sm"
              title="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Rank Number */}
            <div className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider rounded-lg border border-primary/20 shadow-sm flex items-center">
              #{index + 1}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={onView}
              className="p-1.5 text-on-surface/40 hover:text-primary hover:bg-surface-container rounded-lg transition-colors border border-transparent hover:border-outline/10 shadow-sm"
              title="View Detail"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button
              onClick={onEdit}
              className="p-1.5 text-on-surface/40 hover:text-primary hover:bg-surface-container rounded-lg transition-colors border border-transparent hover:border-outline/10 shadow-sm"
              title="Edit Experience"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/40 shadow-sm"
              title="Delete Experience"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 mt-1 bg-surface-container-high rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-on-surface truncate">
                {experience.company_name}
              </h3>
              <p className="text-sm font-semibold text-primary truncate">{experience.position}</p>
              <p className="text-[12px] text-on-surface/60 font-medium mt-1 truncate">{experience.start_date} - {experience.end_date}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
