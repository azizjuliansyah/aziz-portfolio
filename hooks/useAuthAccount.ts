import { useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/useToast";
import { updateUser } from "@/app/store/features/authSlice";
import { getErrorMessage } from "@/types/error";

export const useAuthAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  const updateAccount = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        
        // Handle validation errors (400)
        if (res.status === 400 && errorData.details) {
          const errors: Record<string, string> = {};
          errorData.details.forEach((d: any) => {
            if (d.path[0]) errors[d.path[0]] = d.message;
          });
          return { success: false, errors };
        }

        throw new Error(errorData.error || "Failed to update account");
      }

      const data = await res.json();
      dispatch(updateUser(data.user));
      toast.success(data.message || "Account updated successfully");
      return { success: true, ...data };
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to update account");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    updateAccount,
  };
};
