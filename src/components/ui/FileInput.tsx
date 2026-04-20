"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Trash2, X } from "lucide-react";

interface FileInputProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  label?: string;
  accept?: string;
  className?: string;
  helperText?: string;
  error?: string;
}

export function FileInput({
  value,
  onChange,
  label,
  accept = ".pdf,.doc,.docx",
  className = "",
  helperText,
  error,
}: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const fileName = value instanceof File 
    ? value.name 
    : (typeof value === "string" ? value.split("/").pop() : null);

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-on-surface/80 ml-1 block">
          {label}
        </label>
      )}

      {!value ? (
        <div 
          className={`
            relative cursor-pointer py-6 px-4 rounded-xl border-2 border-dashed transition-all duration-300
            flex flex-col items-center justify-center gap-2
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.01]" 
              : error
                ? "border-error bg-error/5 hover:border-error/80"
                : "border-outline/10 bg-surface-container-low hover:border-primary/50"}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={handleFileChange}
          />
          <div className="p-2 rounded-lg bg-surface shadow-sm text-on-surface/40">
            <Upload className={`w-5 h-5 ${isDragging ? "text-primary" : ""}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-on-surface">
              {isDragging ? "Drop your file here" : "Click or Drag to upload"}
            </p>
            {helperText && (
              <p className="text-xs text-on-surface/50 mt-1">{helperText}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-surface-container border border-outline/10 rounded-xl shadow-sm group animate-in zoom-in-95 duration-200">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate">
              {fileName}
            </p>
            <p className="text-[10px] text-on-surface/50 font-medium">Ready to upload</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 text-on-surface/40 hover:text-error hover:bg-error/5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-error font-medium mt-1.5 ml-1 leading-relaxed">
          {error}
        </p>
      )}
    </div>
  );
}
