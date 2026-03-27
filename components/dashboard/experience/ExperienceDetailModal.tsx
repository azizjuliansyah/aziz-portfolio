import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { WorkExperience } from "@/types/experience";
import { Briefcase, Calendar, Building2, ArrowRight } from "lucide-react";

interface ExperienceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: Partial<WorkExperience> | null;
}

export const ExperienceDetailModal = ({ isOpen, onClose, experience }: ExperienceDetailModalProps) => {
  if (!experience) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Experience Detail"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Header Info */}
        <div className="bg-surface-container-low p-6 rounded-xl border border-outline/10 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-surface-container-high rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-on-surface truncate">{experience.position}</h2>
              <div className="flex items-center gap-2 mt-1 text-primary font-semibold">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{experience.company_name}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-on-surface/60 font-medium">
                <Calendar className="w-4 h-4" />
                <span>{experience.start_date} — {experience.end_date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <h3 className="text-sm font-bold tracking-wider uppercase text-on-surface/50 mb-4 px-1">
            Responsibilities & Achievements
          </h3>
          <div className="bg-surface-container-lowest border border-outline/10 rounded-xl p-6 shadow-sm">
            {experience.responsibilities && experience.responsibilities.length > 0 ? (
              <ul className="space-y-4">
                {experience.responsibilities.map((res: any) => (
                  <li key={res.id} className="flex items-start gap-4 hover:bg-surface-container-low p-2 -mx-2 rounded-lg transition-colors">
                    <span className="text-primary/60 mt-1 flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-on-surface/80 leading-relaxed text-sm">
                      {res.responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-center text-on-surface/40 italic py-4">
                No responsibilities listed.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-4 border-t border-outline/10">
          <Button variant="secondary" onClick={onClose} type="button">
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
};
