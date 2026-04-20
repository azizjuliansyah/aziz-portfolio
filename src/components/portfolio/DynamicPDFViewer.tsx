"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";

// Setup worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function DynamicPDFViewer({ cvUrl }: { cvUrl: string }) {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Document
      file={cvUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div className="flex flex-col items-center justify-center h-full text-on-surface-variant mt-20">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading PDF document...</p>
        </div>
      }
      error={
        <div className="text-center text-error mt-20">
          <p>Failed to load PDF. Please click "Open" below.</p>
        </div>
      }
      className="flex flex-col items-center gap-6 w-full"
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="shadow-xl rounded-lg overflow-hidden bg-white"
          width={typeof window !== "undefined" ? Math.min(window.innerWidth - 64, 800) : 800}
        />
      ))}
    </Document>
  );
}
