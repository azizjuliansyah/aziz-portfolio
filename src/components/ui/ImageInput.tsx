"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, Camera, Trash2, User, Image as ImageIcon, FileText } from "lucide-react";
import { CropModal } from "./CropModal";

interface ImageInputProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  label?: string;
  accept?: string;
  shape?: "circle" | "square";
  aspectRatio?: string;
  className?: string;
  placeholder?: "user" | "image";
  error?: string;
  enableCrop?: boolean;
}

export function ImageInput({
  value,
  onChange,
  label,
  accept = "image/*",
  shape = "square",
  aspectRatio = "aspect-square",
  className = "",
  placeholder = "image",
  error,
  enableCrop = true,
}: ImageInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<{ url: string; file: File } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update preview URL when value changes
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const parseAspectRatio = (aspect: string): number => {
    if (aspect === "aspect-square") return 1;
    if (aspect === "aspect-video") return 16 / 9;
    if (aspect === "aspect-portrait") return 3 / 4;
    // Handle aspect-[3/4] or similar
    const match = aspect.match(/aspect-\[([\d/]+)\]/);
    if (match) {
      const val = match[1];
      if (val.includes("/")) {
        const [w, h] = val.split("/").map(Number);
        return w / h;
      }
      return Number(val);
    }
    return 1;
  };

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
      const isPdfAccepted = accept.includes("application/pdf") || accept.includes(".pdf");
      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (isImage && enableCrop) {
        const url = URL.createObjectURL(file);
        setTempImage({ url, file });
        setCropModalOpen(true);
      } else if (isImage || (isPdf && isPdfAccepted)) {
        onChange(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (isImage && enableCrop) {
        const url = URL.createObjectURL(file);
        setTempImage({ url, file });
        setCropModalOpen(true);
      } else {
        onChange(file);
      }
      // Reset input value to allow selecting same file again
      e.target.value = "";
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    if (tempImage) {
      const croppedFile = new File([croppedBlob], tempImage.file.name, {
        type: tempImage.file.type,
      });
      onChange(croppedFile);
      setTempImage(null);
    }
  };

  const isPdf = (value instanceof File && value.type === "application/pdf") || 
                (typeof value === "string" && value.toLowerCase().endsWith(".pdf"));

  const isCircle = shape === "circle";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-on-surface/80 ml-1 block">
          {label}
        </label>
      )}
      
      <div 
        className={`
          relative group cursor-pointer
          ${aspectRatio} w-full
          ${isCircle ? "rounded-full" : "rounded-2xl"}
          border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : error 
              ? "border-error bg-error/5 hover:border-error/80" 
              : "border-outline/10 bg-surface-container-low hover:border-primary/50"}
          overflow-hidden
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

        {previewUrl ? (
          <>
            {isPdf ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-high text-primary/80 gap-3">
                <FileText className="w-12 h-12" />
                <span className="text-xs font-semibold px-4 text-center truncate w-full">
                  {value instanceof File ? value.name : "Certificate PDF"}
                </span>
              </div>
            ) : (
              <Image 
                src={previewUrl} 
                alt="Preview" 
                fill 
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
                className="object-cover transition-transform group-hover:scale-105"
                unoptimized={value instanceof File}
              />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium text-center px-2">Click or Drop to change</span>
            </div>
          </>
        ) : (
          <div className={`
            absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-4
            ${isCircle ? "gap-1.5" : "gap-3"}
          `}>
            <div className={`
              flex items-center justify-center transition-colors
              ${isCircle ? "p-2 rounded-full" : "p-3 rounded-xl"}
              bg-surface-container-high
              ${isDragging ? "bg-primary/20 text-primary" : ""}
            `}>
              {placeholder === "user" ? (
                <User className={isCircle ? "w-6 h-6" : "w-8 h-8"} />
              ) : (
                <ImageIcon className={isCircle ? "w-6 h-6" : "w-8 h-8"} />
              )}
            </div>
            <div className="text-center">
              <p className={`font-bold text-on-surface ${isCircle ? "text-[10px]" : "text-xs"}`}>
                {isCircle ? "Tap / Drop" : `Click or Drop ${accept.includes("pdf") ? "File" : "Image"}`}
              </p>
              {!isCircle && (
                <p className="text-[10px] mt-1 text-on-surface/50">
                  {accept.includes("pdf") ? "PNG, JPG, WebP or PDF" : "PNG, JPG or WebP"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] pointer-events-none border-2 border-primary flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary animate-bounce" />
          </div>
        )}
      </div>

      {previewUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange(null);
          }}
          className="relative z-10 flex items-center gap-1.5 text-xs font-semibold text-error hover:text-error/80 hover:underline transition-all cursor-pointer ml-1 py-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove File
        </button>
      )}

      {error && (
        <p className="text-xs text-error font-medium mt-1.5 ml-1 leading-relaxed">
          {error}
        </p>
      )}

      {tempImage && (
        <CropModal
          isOpen={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setTempImage(null);
          }}
          image={tempImage.url}
          onCropComplete={handleCropComplete}
          aspect={parseAspectRatio(aspectRatio)}
          shape={shape === "circle" ? "round" : "rect"}
        />
      )}
    </div>
  );
}
