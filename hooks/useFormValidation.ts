/**
 * Reusable form validation hook with Zod
 */

import { useState, useCallback } from "react";
import { z, ZodError } from "zod";
import { getFormErrors } from "@/utils/validation";

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationOptions<T> {
  schema: z.ZodType<T>;
  initialValues: T;
  onSubmit: (data: T) => Promise<void> | void;
}

interface UseFormValidationReturn<T> {
  values: T;
  errors: ValidationErrors;
  isSubmitting: boolean;
  handleChange: (field: keyof T | string, value: unknown) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  clearErrors: () => void;
}

export function useFormValidation<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T | string, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      const validatedData = schema.parse(values);
      setErrors({});
      setIsSubmitting(true);

      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(getFormErrors(error));
      } else {
        console.error('Form validation error:', error);
        setErrors({ _form: 'An unexpected error occurred' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    clearErrors,
  };
}

/**
 * Simplified form hook for forms without Zod validation
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((field: keyof T | string, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = async (
    e: React.FormEvent,
    onSubmit: (data: T) => Promise<void> | void
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
  };
}
