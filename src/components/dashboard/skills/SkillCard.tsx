import React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Skill } from "@/types";
import { CrudCard } from "@/components/dashboard/common";

interface SkillCardProps {
  skill: Skill;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const SkillCard = ({ skill, index, onEdit, onDelete }: SkillCardProps) => {
  return (
    <CrudCard
      item={skill}
      index={index}
      onEdit={onEdit}
      onDelete={onDelete}
      renderContent={(item) => (
        <div className="flex items-start gap-4">
          {/* Skill Image/Icon */}
          <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-primary overflow-hidden relative flex-shrink-0 shadow-sm border border-outline/10">
            {item.image ? (
              <Image src={item.image as string} alt={item.title} width={48} height={48} className="w-full h-full object-cover" unoptimized />
            ) : (
              <ImageIcon className="w-6 h-6 text-on-surface/20" />
            )}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-[14px] font-bold text-on-surface truncate leading-none mt-2">
              {item.title}
            </h3>
          </div>
        </div>
      )}
    />
  );
};
