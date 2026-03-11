import { useDispatch } from "react-redux";
import { addToast } from "@/app/store/features/toastSlice";
import { useMemo } from "react";

export function useToast() {
  const dispatch = useDispatch();

  return useMemo(() => ({
    success: (message: string, duration?: number) => {
      dispatch(addToast({ type: "success", message, duration }));
    },
    error: (message: string, duration?: number) => {
      dispatch(addToast({ type: "error", message, duration }));
    },
    info: (message: string, duration?: number) => {
      dispatch(addToast({ type: "info", message, duration }));
    },
  }), [dispatch]);
}
