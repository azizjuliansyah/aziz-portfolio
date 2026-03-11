import React from "react";
import Image from "next/image";
import { Pencil, Trash2, Image as ImageIcon, ExternalLink, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Project } from "@/types/project";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, index, onEdit, onDelete }: ProjectCardProps) => {
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
};
