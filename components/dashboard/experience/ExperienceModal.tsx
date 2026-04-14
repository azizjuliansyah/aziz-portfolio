import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { WorkExperience } from "@/types/experience";
import { Plus, X, Briefcase, Calendar, Building2 } from "lucide-react";
import { useModalForm } from "@/hooks/useModalForm";
import { CrudResult } from "@/hooks/useCRUD";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<WorkExperience>) => Promise<CrudResult>;
  currentExperience: Partial<WorkExperience> | null;
  isLoading: boolean;
}

export const ExperienceModal = ({ isOpen, onClose, onSubmit, currentExperience, isLoading }: ExperienceModalProps) => {
  const [responsibilities, setResponsibilities] = useState<{ id?: string, responsibility: string }[]>([]);

  // Sync responsibilities separately since it's an array field
  useEffect(() => {
    if (isOpen) {
      if (currentExperience?.responsibilities && currentExperience.responsibilities.length > 0) {
        setResponsibilities(currentExperience.responsibilities.map(r => ({
          id: r.id,
          responsibility: r.responsibility
        })));
      } else {
        setResponsibilities([]);
      }
    }
  }, [isOpen, currentExperience]);

  const { formData, handleChange, reset, errors, setErrors } = useModalForm<{
    company_name: string;
    position: string;
    start_date: string;
    end_date: string;
  }>({
    initialValues: {
      company_name: "",
      position: "",
      start_date: "",
      end_date: "",
    },
    currentItem: currentExperience,
    isOpen,
  });

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, { responsibility: "" }]);
  };

  const handleRemoveResponsibility = (index: number) => {
    const newR = [...responsibilities];
    newR.splice(index, 1);
    setResponsibilities(newR);
  };

  const handleChangeResponsibility = (index: number, value: string) => {
    const newR = [...responsibilities];
    newR[index].responsibility = value;
    setResponsibilities(newR);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty responsibilities
    const validResponsibilities = responsibilities.filter(r => r.responsibility.trim());

    const result = await onSubmit({
      company_name: formData.company_name,
      position: formData.position,
      start_date: formData.start_date,
      end_date: formData.end_date,
      responsibilities: validResponsibilities as any
    });

    if (result.success) {
      reset();
      onClose();
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const modalFooter = (
    <div className="flex gap-3 w-full">
      <Button variant="secondary" onClick={onClose} className="flex-1" type="button">
        Cancel
      </Button>
      <Button isLoading={isLoading} className="flex-1 shadow-lg shadow-primary/20" type="submit" form="experience-form">
        {currentExperience?.id ? "Update Experience" : "Save Experience"}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={currentExperience?.id ? "Edit Experience" : "Add New Experience"}
      maxWidth="max-w-2xl"
      footer={modalFooter}
    >
      <form id="experience-form" onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="e.g. Google, Microsoft"
            value={formData.company_name}
            onChange={(e) => handleChange("company_name", e.target.value)}
            icon={Building2}
            error={errors.company_name}
          />
          <Input
            label="Position"
            placeholder="e.g. Frontend Engineer"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            icon={Briefcase}
            error={errors.position}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            placeholder="e.g. Jan 2020"
            value={formData.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            icon={Calendar}
            error={errors.start_date}
          />
          <Input
            label="End Date"
            placeholder="e.g. Present, Dec 2022"
            value={formData.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            icon={Calendar}
            error={errors.end_date}
          />
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium text-on-surface">Responsibilities & Achievements</label>
          
          <div className="space-y-3">
            {responsibilities.map((res, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={`Responsibility point ${index + 1}`}
                    value={res.responsibility}
                    onChange={(e) => handleChangeResponsibility(index, e.target.value)}
                    error={errors[`responsibilities.${index}.responsibility`]}
                  />
                </div>
                {responsibilities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="p-2.5 mt-0.5 text-on-surface/40 hover:text-red-500 bg-surface-container rounded-lg transition-colors border border-outline/10 hover:border-red-200 shadow-sm cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button 
            type="button" 
            variant="secondary" 
            leftIcon={Plus} 
            onClick={handleAddResponsibility}
            className="w-full sm:w-auto mt-2 text-sm"
          >
            Add Bullet Point
          </Button>
        </div>
      </form>
    </Modal>
  );
};
