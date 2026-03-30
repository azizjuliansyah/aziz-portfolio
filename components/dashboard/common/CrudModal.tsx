import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FormField, FieldConfig, FieldGroup, FormSection, FieldType } from "./FormFields";
import { useModalForm } from "@/hooks/useModalForm";

/**
 * Generic CRUD Modal Component
 * Eliminates duplication across all entity modals (Project, Skill, Experience, SocialLink)
 *
 * @template T - The entity type
 * @param isOpen - Whether the modal is open
 * @param onClose - Callback when modal is closed
 * @param onSubmit - Callback when form is submitted (receives FormData)
 * @param currentItem - Current entity data for editing (null for create)
 * @param isLoading - Whether form submission is in progress
 * @param fields - Array of field configurations
 * @param title - Modal title (default: "Add New" or "Edit {entityName}")
 * @param submitLabel - Submit button label (default: "Save")
 * @param entityName - Entity name for title generation
 * @param sections - Optional sections to group fields
 * @param renderCustomFields - Optional function to render custom fields
 * @param onBeforeSubmit - Optional hook before form submission
 */
export interface CrudModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<boolean>;
  currentItem: Partial<T> | null;
  isLoading: boolean;
  fields: FieldConfig[];
  title?: string;
  submitLabel?: string;
  entityName?: string;
  sections?: Array<{
    title: string;
    description?: string;
    fieldNames: string[];
  }>;
  renderCustomFields?: (
    formData: Record<string, any>,
    handleChange: (name: string, value: any) => void
  ) => React.ReactNode;
  onBeforeSubmit?: (formData: Record<string, any>) => Record<string, any>;
}

export function CrudModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSubmit,
  currentItem,
  isLoading,
  fields,
  title,
  submitLabel = "Save",
  entityName = "Item",
  sections = [],
  renderCustomFields,
  onBeforeSubmit,
}: CrudModalProps<T>) {
  // Build initial values from field configs
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.type === "file" || field.type === "image" ? null : "";
    return acc;
  }, {} as Record<string, any>);

  // Use useModalForm hook for form state management
  const { formData, handleChange, reset } = useModalForm<Record<string, any>>({
    initialValues,
    currentItem,
    isOpen,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Allow custom pre-submit processing
    let submitData = { ...formData };
    if (onBeforeSubmit) {
      submitData = onBeforeSubmit(submitData);
    }

    // Convert to FormData for submission
    const formDataObj = new FormData();

    Object.entries(submitData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formDataObj.append(key, value);
        } else if (Array.isArray(value) && value[0] instanceof File) {
          // Handle multiple files
          value.forEach((file) => formDataObj.append(key, file));
        } else if (typeof value === "string" || typeof value === "number") {
          formDataObj.append(key, String(value));
        }
      }
    });

    const success = await onSubmit(formDataObj);
    if (success) {
      reset();
      onClose();
    }
  };

  // Generate modal title
  const modalTitle =
    title ||
    (currentItem?.id ? `Edit ${entityName}` : `Add New ${entityName}`);

  const renderFields = () => {
    if (sections.length > 0) {
      return sections.map((section, sectionIdx) => {
        const sectionFields = fields.filter((f) =>
          section.fieldNames.includes(f.name)
        );

        return (
          <FormSection
            key={sectionIdx}
            title={section.title}
            description={section.description}
          >
            {sectionFields.map((fieldConfig) => (
              <FormField
                key={fieldConfig.name}
                config={fieldConfig}
                value={formData[fieldConfig.name]}
                onChange={handleChange}
              />
            ))}
          </FormSection>
        );
      });
    }

    // Render fields without sections
    return fields.map((fieldConfig) => (
      <FormField
        key={fieldConfig.name}
        config={fieldConfig}
        value={formData[fieldConfig.name]}
        onChange={handleChange}
      />
    ));
  };

  const modalFooter = (
    <div className="flex justify-end gap-3 w-full">
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button type="submit" isLoading={isLoading} disabled={isLoading} form={`crud-form-${entityName}`}>
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} footer={modalFooter}>
      <form id={`crud-form-${entityName}`} onSubmit={handleSubmit} className="space-y-4">
        {renderFields()}

        {/* Render custom fields if provided */}
        {renderCustomFields?.(formData, handleChange)}
      </form>
    </Modal>
  );
}

/**
 * Helper function to create field configurations
 */
export function createField(
  config: Omit<FieldConfig, "name">
): (name: string) => FieldConfig {
  return (name: string) => ({ ...config, name });
}

/**
 * Common field presets
 */
export const FieldPresets = {
  title: (label = "Title") => ({
    name: "title",
    label,
    type: "text" as FieldType,
    placeholder: `Enter ${label.toLowerCase()}`,
    required: true,
  }),

  description: (label = "Description") => ({
    name: "description",
    label,
    type: "textarea" as FieldType,
    placeholder: `Enter ${label.toLowerCase()}`,
    rows: 4,
    required: true,
  }),

  link: () => ({
    name: "link",
    label: "Link",
    type: "url" as FieldType,
    placeholder: "https://example.com",
    required: false,
  }),

  image: (label = "Image") => ({
    name: "image",
    label,
    type: "image" as FieldType,
    required: false,
  }),

  date: (name: string, label: string) => ({
    name,
    label,
    type: "date" as FieldType,
    required: true,
  }),

  text: (name: string, label: string, required = false) => ({
    name,
    label,
    type: "text" as FieldType,
    required,
  }),
};
