"use client";

import { FileText, User, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";
import { FileInput } from "@/components/ui/FileInput";

interface BasicProfileFormProps {
  name: string;
  title: string;
  email: string;
  bio: string;
  phone: string;
  location: string;
  avatar: File | string | null;
  cv: File | string | null;
  isSubmitting: boolean;
  onChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function BasicProfileForm({
  name,
  title,
  email,
  bio,
  phone,
  location,
  avatar,
  cv,
  isSubmitting,
  onChange,
  onSubmit,
}: BasicProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Contact Information Section */}
      <div className="border-b border-outline/10 pb-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-on-surface">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Professional Title"
              value={title}
              onChange={(e) => onChange("title", e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => onChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Location"
              value={location}
              onChange={(e) => onChange("location", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div>
        <Textarea
          label="Professional Bio"
          value={bio}
          onChange={(e) => onChange("bio", e.target.value)}
          rows={4}
          helperText="Brief professional description"
        />
      </div>

      {/* Media Section */}
      <div className="border-t border-outline-10 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-on-surface">Media Assets</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageInput
              label="Profile Avatar"
              value={avatar}
              onChange={(file) => onChange("avatar", file)}
              aspectRatio="aspect-square"
            />
          </div>
          <div>
            <FileInput
              label="Curriculum Vitae (CV)"
              value={cv}
              onChange={(file) => onChange("cv", file)}
              accept=".pdf,.doc,.docx"
            />
          </div>
        </div>
      </div>

      {/* Submit Section */}
      <div className="pt-6 border-t border-outline-10 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 rounded-xl font-label text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-dim text-on-primary px-6 py-2.5 rounded-xl font-label text-sm font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
