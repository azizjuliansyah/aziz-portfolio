import React from "react";
import Image from "next/image";
import { Image as ImageIcon, ExternalLink, Calendar, Award, FileText } from "lucide-react";
import { Certificate } from "@/types/certificate";
import { CrudCard } from "@/components/dashboard/common";

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export const CertificateCard = ({ certificate, index, onEdit, onDelete }: CertificateCardProps) => {
  return (
    <div className="group relative h-full flex flex-col hover:border-primary transition-all duration-300">
      <CrudCard
        item={certificate}
        index={index}
        onEdit={onEdit}
        onDelete={onDelete}
        showRank={false}
        renderContent={(item) => (
          <>
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-outline/10">
              {item.image_url ? (
                <Image
                  src={item.image_url as string}
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

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex flex-col gap-1 mb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-on-surface line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                  {item.credential_url && (
                    <a
                      href={item.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary-dim mt-0.5 shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-primary text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3 h-3" />
                  {item.issuer}
                </p>
              </div>
              
              <div className="mt-auto space-y-1.5 text-xs text-on-surface/60">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.date_issued}</span>
                </div>
                {item.credential_id && (
                  <div className="flex flex-wrap items-center gap-1.5 w-full">
                    <span className="font-semiboldshrink-0">ID:</span>
                    <span className="font-mono text-[10px] break-all p-1 bg-surface-container-high rounded-md w-full">{item.credential_id}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
};
