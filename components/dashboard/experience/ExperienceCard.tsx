import React from "react";
import { Briefcase } from "lucide-react";
import { WorkExperience } from "@/types/experience";
import { CrudCard } from "@/components/dashboard/common";

interface ExperienceCardProps {
  experience: WorkExperience;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExperienceCard = ({ experience, index, onView, onEdit, onDelete }: ExperienceCardProps) => {
  const viewIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
  );

  return (
    <CrudCard
      item={experience}
      index={index}
      onEdit={onEdit}
      onDelete={onDelete}
      extraActions={[
        {
          icon: viewIcon,
          label: "View Detail",
          onClick: onView,
          variant: "default",
        },
      ]}
      renderContent={(item) => (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 mt-1 bg-surface-container-high rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-on-surface truncate">
                {item.company_name}
              </h3>
              <p className="text-sm font-semibold text-primary truncate">{item.position}</p>
              <p className="text-[12px] text-on-surface/60 font-medium mt-1 truncate">{item.start_date} - {item.end_date}</p>
            </div>
          </div>
        </div>
      )}
    />
  );
};
