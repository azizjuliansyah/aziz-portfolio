/**
 * Reusable hook for managing form state in modal components
 * Eliminates duplicate form state management code across modals
 */

import { useState, useEffect, useRef } from "react";

interface UseModalFormOptions<T> {
  initialValues: T;
  currentItem: Partial<T> | null;
  isOpen: boolean;
}

interface UseModalFormReturn<T> {
  formData: T;
  isDirty: boolean;
  errors: Record<string, string>;
  handleChange: (field: keyof T | string, value: unknown) => void;
  reset: () => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

/**
 * Hook for managing form state in modal components
 * Automatically resets form when modal opens/closes or current item changes
 *
 * @param options - Configuration options
 * @param options.initialValues - Default form values
 * @param options.currentItem - Current item being edited (null for create mode)
 * @param options.isOpen - Whether modal is open
 *
 * @returns Form state and handlers
 * @example
 * ```tsx
 * const { formData, handleChange, reset } = useModalForm({
 *   initialValues: { title: "", image: null },
 *   currentItem: currentSkill,
 *   isOpen: isModalOpen,
 * });
 *
 * // Use in form:
 * <input
 *   value={formData.title}
 *   onChange={(e) => handleChange("title", e.target.value)}
 * />
 * ```
 */
export function useModalForm<T extends Record<string, unknown>>({
  initialValues,
  currentItem,
  isOpen,
}: UseModalFormOptions<T>): UseModalFormReturn<T> {
  const [formData, setFormData] = useState<T>(initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Use a ref to store initial values so we don't trigger the effect unnecessarily
  const initialValuesRef = useRef(initialValues);
  
  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen) {
      if (currentItem) {
        // Edit mode: merge current item with defaults
        setFormData({ ...initialValuesRef.current, ...currentItem });
      } else {
        // Create mode: use defaults
        setFormData(initialValuesRef.current);
      }
      setIsDirty(false);
      setErrors({});
    }
  }, [currentItem, isOpen]);

  /**
   * Update a single form field
   */
  const handleChange = (field: keyof T | string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for the field when it's changed
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  /**
   * Reset form to initial values
   */
  const reset = () => {
    setFormData(initialValues);
    setIsDirty(false);
    setErrors({});
  };

  return {
    formData,
    isDirty,
    errors,
    handleChange,
    reset,
    setFormData,
    setErrors,
  };
}
