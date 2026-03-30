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
  const modalFooter = (
    <div className="flex justify-end gap-3 w-full">
      <Button variant="secondary" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        className="bg-red-600 hover:bg-red-700 text-white border-none px-4"
        onClick={onConfirm}
        isLoading={isLoading}
      >
        Delete
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} maxWidth="max-w-md" footer={modalFooter}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 flex-shrink-0 bg-error/10 rounded-full flex items-center justify-center text-error border border-error/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-on-surface">{title}</h3>
          <p className="text-on-surface/70 text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
