import React from "react";
import Image from "next/image";
import { Image as ImageIcon, ExternalLink } from "lucide-react";
import { SocialLink } from "@/types";
import { CrudCard } from "@/components/dashboard/common";

interface SocialLinkCardProps {
  socialLink: SocialLink;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const SocialLinkCard = ({ socialLink, index, onEdit, onDelete }: SocialLinkCardProps) => {
  return (
    <CrudCard
      item={socialLink}
      index={index}
      onEdit={onEdit}
      onDelete={onDelete}
      renderContent={(item) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-primary overflow-hidden relative flex-shrink-0 shadow-sm border border-outline/10">
            {item.image ? (
              <Image src={item.image as string} alt={item.name} width={48} height={48} className="w-full h-full object-cover" unoptimized />
            ) : (
              <ImageIcon className="w-6 h-6 text-on-surface/20" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-extrabold text-on-surface truncate leading-none mb-1.5">
              {item.name}
            </h3>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline truncate"
            >
              {item.link} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    />
  );
};
