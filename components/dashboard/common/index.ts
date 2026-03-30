/**
 * Common Dashboard Components
 */

export { ProfilePreviewCard } from "./ProfilePreviewCard";
export { TabNavigation } from "./TabNavigation";
export { DashboardLoadingSkeleton } from "./DashboardLoadingSkeleton";

// Generic CRUD Components
export { CrudCard } from "./CrudCard";
export type { CrudCardProps } from "./CrudCard";

export { CrudModal, createField, FieldPresets } from "./CrudModal";
export type { CrudModalProps } from "./CrudModal";

export {
  FormField,
  FieldGroup,
  FormSection,
} from "./FormFields";
export type {
  FormFieldProps,
  FieldGroupProps,
  FormSectionProps,
  FieldConfig,
} from "./FormFields";
// Re-export FieldType
export type { FieldType } from "./FormFields";
