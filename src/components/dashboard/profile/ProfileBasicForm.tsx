"use client";

import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { FileInput } from "@/components/ui/FileInput";
import { CVPreviewModal } from "@/components/portfolio/CVPreviewModal";
import { Button } from "@/components/ui/Button";
import { FileText, Briefcase, Phone, MapPin, Eye, CheckCircle2 } from "lucide-react";

interface ProfileBasicFormProps {
  name: string;
  title: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
  avatar: File | string | null;
  cv: File | string | null;
  isSubmitting: boolean;
  isCvModalOpen: boolean;
  errors?: Record<string, string>;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCvModalOpen: () => void;
  onCvModalClose: () => void;
}

export function ProfileBasicForm({
  name,
  title,
  email,
  bio,
  phone,
  location,
  avatar,
  cv,
  isSubmitting,
  isCvModalOpen,
  errors = {},
  onChange,
  onSubmit,
  onCvModalOpen,
  onCvModalClose,
}: ProfileBasicFormProps) {
  const cvUrl = cv ? (typeof cv === "string" ? cv : URL.createObjectURL(cv)) : null;

  return (
    <>
      <form onSubmit={onSubmit} className="h-full flex flex-col animate-in fade-in duration-300">
        <div className="space-y-6 flex-1 w-full">
          <div className="grid gap-6 sm:grid-cols-12">
            <div className="sm:col-span-12 md:col-span-4">
              <div className="max-w-48">
                <ImageInput
                  label="Profile Avatar"
                  value={avatar}
                  onChange={(file) => onChange("avatar", file)}
                  aspectRatio="aspect-square"
                  error={errors.avatar}
                />
              </div>
            </div>
            <div className="sm:col-span-12 md:col-span-8 flex flex-col justify-start gap-5">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => onChange("name", e.target.value)}
                error={errors.name}
              />
              <Input
                label="Professional Title"
                value={title}
                onChange={(e) => onChange("title", e.target.value)}
                icon={Briefcase}
                error={errors.title}
              />
            </div>
            <div className="sm:col-span-12">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => onChange("email", e.target.value)}
                error={errors.email}
              />
            </div>
            <div className="sm:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Phone"
                value={phone}
                onChange={(e) => onChange("phone", e.target.value)}
                icon={Phone}
                error={errors.phone}
              />
              <Input
                label="Location"
                value={location}
                onChange={(e) => onChange("location", e.target.value)}
                icon={MapPin}
                error={errors.location}
              />
            </div>
            <div className="sm:col-span-12">
              <Textarea
                label="Bio / Professional Summary"
                value={bio}
                onChange={(e) => onChange("bio", e.target.value)}
                rows={4}
                error={errors.bio}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-on-surface/80 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Resume / CV
                </h3>
                {cvUrl && (
                  <Button
                    type="button"
                    variant="secondary"
                    leftIcon={Eye}
                    onClick={onCvModalOpen}
                  >
                    Preview CV
                  </Button>
                )}
              </div>
              <FileInput
                label="Upload CV (PDF or Image)"
                value={cv}
                onChange={(file) => onChange("cv", file)}
                helperText="Recommended: PDF under 5MB"
                error={errors.cv}
              />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-outline/10 flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={CheckCircle2}
            className="w-full sm:w-auto shadow-lg shadow-primary/20"
          >
            Save Profile Details
          </Button>
        </div>
      </form>

      {/* CV Preview Modal */}
      <CVPreviewModal
        isOpen={isCvModalOpen}
        onClose={onCvModalClose}
        cvUrl={cvUrl}
        profileName={name || "User"}
        isPdf={typeof cv === "string" ? cv.toLowerCase().split('?')[0].endsWith('.pdf') : cv?.type === 'application/pdf'}
      />
    </>
  );
}
