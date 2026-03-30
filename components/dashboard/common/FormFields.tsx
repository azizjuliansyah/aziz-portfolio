import React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageInput } from "@/components/ui/ImageInput";

/**
 * Form Field Configuration Types
 * Used to dynamically generate forms in CrudModal
 */

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "number"
  | "date"
  | "file"
  | "image";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  rows?: number; // For textarea
  accept?: string; // For file inputs
  multiple?: boolean; // For multiple file uploads
  disabled?: boolean;
  className?: string;
}

/**
 * Generic Form Field Component
 * Renders different input types based on configuration
 */
export interface FormFieldProps {
  config: FieldConfig;
  value: any;
  onChange: (name: string, value: any) => void;
  error?: string;
}

export function FormField({ config, value, onChange, error }: FormFieldProps) {
  const {
    name,
    label,
    type,
    placeholder,
    required = false,
    rows = 3,
    accept,
    multiple = false,
    disabled = false,
    className = "",
  } = config;

  const handleChange = (newValue: any) => {
    onChange(name, newValue);
  };

  const baseInputProps = {
    name,
    label,
    value,
    onChange: handleChange,
    error,
    disabled,
    className,
  };

  switch (type) {
    case "textarea":
      return (
        <Textarea
          {...baseInputProps}
          placeholder={placeholder}
          rows={rows}
          required={required}
        />
      );

    case "email":
      return (
        <Input
          {...baseInputProps}
          type="email"
          placeholder={placeholder || "email@example.com"}
          required={required}
        />
      );

    case "url":
      return (
        <Input
          {...baseInputProps}
          type="url"
          placeholder={placeholder || "https://example.com"}
          required={required}
        />
      );

    case "number":
      return (
        <Input
          {...baseInputProps}
          type="number"
          placeholder={placeholder}
          required={required}
        />
      );

    case "date":
      return (
        <Input
          {...baseInputProps}
          type="date"
          required={required}
        />
      );

    case "file":
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-on-surface/80 ml-1">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </label>
          <input
            type="file"
            name={name}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                handleChange(multiple ? Array.from(files) : files[0]);
              }
            }}
            className={`w-full px-3 py-2 bg-surface border border-outline rounded-lg text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
          />
        </div>
      );

    case "image":
      return (
        <div className="space-y-2">
          <ImageInput
            label={label}
            value={value}
            onChange={handleChange}
            className={className}
          />
        </div>
      );

    case "text":
    default:
      return (
        <Input
          {...baseInputProps}
          type="text"
          placeholder={placeholder}
          required={required}
        />
      );
  }
}

/**
 * Form Field Group Component
 * Groups multiple fields together (e.g., for date ranges)
 */
export interface FieldGroupProps {
  label?: string;
  children: React.ReactNode;
}

export function FieldGroup({ label, children }: FieldGroupProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-semibold text-on-surface">
          {label}
        </label>
      )}
      <div className="flex gap-3">{children}</div>
    </div>
  );
}

/**
 * Form Section Component
 * Creates a visual section divider in forms
 */
export interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-bold text-on-surface">{title}</h4>
        {description && (
          <p className="text-xs text-on-surface/60 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
