"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink } from "lucide-react";

interface CVPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl: string | null;
  profileName: string;
  isPdf?: boolean;
}

export function CVPreviewModal({ isOpen, onClose, cvUrl, profileName, isPdf }: CVPreviewModalProps) {
  const modalFooter = (
    <div className="flex justify-between items-center w-full">
      <p className="text-sm text-on-surface-variant font-medium hidden md:block">Reviewing {profileName}'s professional history</p>
      <div className="flex gap-3 w-full md:w-auto justify-end">
        <Button type="button" variant="outline" onClick={onClose} className="rounded-xl flex-1 md:flex-none">
          Close
        </Button>
        {cvUrl && (
          <>
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
              <Button type="button" variant="outline" className="rounded-xl shadow-sm w-full">
                <ExternalLink className="w-4 h-4 mr-2" /> Open
              </Button>
            </a>
            <a href={cvUrl} download={`CV_${profileName.replace(/\s+/g, '_')}`} className="flex-1 md:flex-none">
              <Button type="button" className="rounded-xl shadow-lg shadow-primary/20 w-full">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </a>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Curriculum Vitae"
      maxWidth="max-w-4xl"
      footer={modalFooter}
    >
      <div className="space-y-6">
        {cvUrl && (
          <div className="w-full h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden border border-outline-variant/15 bg-surface-container-low relative shadow-inner">
            {isPdf || cvUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
              <iframe src={cvUrl} className="w-full h-full object-fill absolute inset-0 border-none" title="CV Preview" />
            ) : (
              <img src={cvUrl} alt="CV Preview" className="w-full h-full object-contain p-4 shadow-2xl absolute inset-0" />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
