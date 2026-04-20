"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import the PDF viewer with SSR disabled to prevent DOMMatrix errors
const DynamicPDFViewer = dynamic(() => import("./DynamicPDFViewer"), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full text-on-surface-variant mt-20">
      <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
      <p>Loading PDF document...</p>
    </div>
  )
});

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
        <div className="hidden md:block">
          <Button type="button" variant="outline" onClick={onClose} className="rounded-xl flex-1 md:flex-none">
            Close
          </Button>
        </div>
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
          <div className="w-full h-[50vh] md:h-[65vh] rounded-3xl overflow-y-auto overflow-x-hidden border border-outline-variant/15 bg-surface-container-low relative shadow-inner p-4 md:p-8 flex flex-col items-center custom-scrollbar">
            {isPdf || cvUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
              <DynamicPDFViewer cvUrl={cvUrl} />
            ) : (
              <img src={cvUrl} alt="CV Preview" className="w-full h-auto object-contain shadow-2xl rounded-lg bg-white" />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
