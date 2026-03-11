"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { removeToast } from "@/app/store/features/toastSlice";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts } = useSelector((state: RootState) => state.toast);
  const dispatch = useDispatch();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => dispatch(removeToast(toast.id))} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: any; onRemove: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgStyles = {
    success: "bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30",
    error: "bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30",
    info: "bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900/30",
  };

  return (
    <div
      className={`
        pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg 
        animate-in slide-in-from-right-full duration-300 min-w-[300px] max-w-md
        ${bgStyles[toast.type as keyof typeof bgStyles]}
      `}
    >
      <div className="flex-shrink-0">{icons[toast.type as keyof typeof icons]}</div>
      <div className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
        {toast.message}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
