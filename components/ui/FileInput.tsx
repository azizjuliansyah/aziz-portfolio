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
}

export function FileInput({
  value,
  onChange,
  label,
  accept = ".pdf,.doc,.docx",
  className = "",
  helperText,
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
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 block">
          {label}
        </label>
      )}

      {!value ? (
        <div 
          className={`
            relative cursor-pointer py-6 px-4 rounded-xl border-2 border-dashed transition-all duration-300
            flex flex-col items-center justify-center gap-2
            ${isDragging 
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[1.01]" 
              : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 hover:border-blue-400 dark:hover:border-blue-800"}
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
          <div className="p-2 rounded-lg bg-white dark:bg-gray-900 shadow-sm text-gray-400">
            <Upload className={`w-5 h-5 ${isDragging ? "text-blue-500" : ""}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {isDragging ? "Drop your file here" : "Click or Drag to upload"}
            </p>
            {helperText && (
              <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm group animate-in zoom-in-95 duration-200">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {fileName}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">Ready to upload</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
