import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageInput } from "@/components/ui/ImageInput";
import { Certificate } from "@/types";
import { useModalForm } from "@/hooks/useModalForm";
import { CrudResult } from "@/hooks/useCRUD";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<CrudResult>;
  currentCertificate: Partial<Certificate> | null;
  isLoading: boolean;
}

export const CertificateModal = ({ isOpen, onClose, onSubmit, currentCertificate, isLoading }: CertificateModalProps) => {
  const { formData, handleChange, reset, errors, setErrors } = useModalForm<{
    title: string;
    issuer: string;
    date_issued: string;
    credential_id: string;
    credential_url: string;
    image_url: File | string | null;
    file_url: File | string | null;
  }>({
    initialValues: {
      title: "",
      issuer: "",
      date_issued: "",
      credential_id: "",
      credential_url: "",
      image_url: null,
      file_url: null,
    },
    currentItem: currentCertificate,
    isOpen,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("issuer", formData.issuer);
    submitData.append("date_issued", formData.date_issued);
    submitData.append("credential_id", formData.credential_id || "");
    submitData.append("credential_url", formData.credential_url || "");

    if (formData.image_url instanceof File) {
      submitData.append("image_url", formData.image_url);
    } else if (typeof formData.image_url === "string") {
      submitData.append("image_url", formData.image_url);
    }

    if (formData.file_url instanceof File) {
      submitData.append("file_url", formData.file_url);
    } else if (typeof formData.file_url === "string" && formData.file_url) {
      submitData.append("file_url", formData.file_url);
    } else if (formData.file_url === null && currentCertificate?.id) {
       // signal to remove file_url if it was cleared
       submitData.append("file_url", "");
    }


    const result = await onSubmit(submitData);
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
      <Button isLoading={isLoading} className="flex-1" type="submit" form="certificate-form">
        {currentCertificate?.id ? "Update Certificate" : "Save Certificate"}
      </Button>
    </div>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={currentCertificate?.id ? "Edit Certificate" : "Add New Certificate"}
      maxWidth="max-w-2xl"
      footer={modalFooter}
    >
      <form id="certificate-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageInput
            label="Certificate Thumbnail (Image)"
            accept="image/*"
            value={formData.image_url}
            onChange={(file) => handleChange("image_url", file)}
            aspectRatio="aspect-[2/1]"
            error={errors.image_url}
          />
          <ImageInput
            label="Certificate PDF (Optional)"
            accept="application/pdf"
            value={formData.file_url}
            onChange={(file) => handleChange("file_url", file)}
            aspectRatio="aspect-[2/1]"
            error={errors.file_url}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Certificate Title"
            placeholder="e.g. AWS Certified Solutions Architect"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="md:col-span-2"
            error={errors.title}
          />
          <Input
            label="Issuer Authority"
            placeholder="e.g. Amazon Web Services"
            value={formData.issuer}
            onChange={(e) => handleChange("issuer", e.target.value)}
            error={errors.issuer}
          />
          <Input
            label="Date Issued"
            placeholder="e.g. August 2023"
            value={formData.date_issued}
            onChange={(e) => handleChange("date_issued", e.target.value)}
            error={errors.date_issued}
          />
          <Input
            label="Credential ID (Optional)"
            placeholder="e.g. 12345678"
            value={formData.credential_id}
            onChange={(e) => handleChange("credential_id", e.target.value)}
            error={errors.credential_id}
          />
          <Input
            label="Credential URL (Optional)"
            placeholder="https://www.credly.com/..."
            value={formData.credential_url}
            onChange={(e) => handleChange("credential_url", e.target.value)}
            error={errors.credential_url}
          />
        </div>
      </form>
    </Modal>
  );
};
