import React from "react";
import Image from "next/image";
import { Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skill } from "@/types/skill";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SkillCardProps {
  skill: Skill;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const SkillCard = ({ skill, index, onEdit, onDelete }: SkillCardProps) => {
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
};
