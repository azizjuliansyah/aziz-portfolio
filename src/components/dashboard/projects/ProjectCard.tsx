import React from "react";
import Image from "next/image";
import { Image as ImageIcon, ExternalLink } from "lucide-react";
import { Project } from "@/types/project";
import { CrudCard } from "@/components/dashboard/common";

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, index, onEdit, onDelete }: ProjectCardProps) => {
  return (
    <div className="group relative h-full flex flex-col hover:border-primary transition-all duration-300">
      <CrudCard
        item={project}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
        showRank={false}
        renderContent={(item) => (
          <>
            <div className="relative aspect-video w-full overflow-hidden">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail as string}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface/20">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-on-surface truncate">
                  {item.title}
                </h3>
                <a
                  href={`/projects/${item.id}`}
                  className="text-primary hover:text-primary-dim"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-wider mb-2 truncate">
                {item.info || "Personal Project"}
              </p>
              <p className="text-sm text-on-surface-variant line-clamp-2 mt-1">
                {item.overview}
              </p>

              {item.images?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-outline/10 flex items-center gap-1.5 overflow-hidden">
                  {item.images.slice(0, 4).map((img) => (
                    <div
                      key={img.id}
                      className="relative w-8 h-8 rounded-md overflow-hidden border border-outline/10"
                    >
                      <Image
                        src={img.name}
                        alt="Gallery"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                  {item.images.length > 4 && (
                    <div className="w-8 h-8 bg-surface-container-high rounded-md flex items-center justify-center text-[10px] font-bold text-on-surface/50">
                      +{item.images.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      />
    </div>
  );
};
