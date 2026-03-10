"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} maxWidth="max-w-sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{message}</p>
        
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1" disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none" 
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
