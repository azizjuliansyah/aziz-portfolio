"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Camera, Trash2, User, Image as ImageIcon } from "lucide-react";

interface ImageInputProps {
  value: string | File | null;
  onChange: (file: File | null) => void;
  label?: string;
  shape?: "circle" | "square";
  aspectRatio?: string;
  className?: string;
  placeholder?: "user" | "image";
}

export function ImageInput({
  value,
  onChange,
  label,
  shape = "square",
  aspectRatio = "aspect-square",
  className = "",
  placeholder = "image",
}: ImageInputProps) {
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
    if (file && file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const previewUrl = value instanceof File 
    ? URL.createObjectURL(value) 
    : (typeof value === "string" ? value : null);

  const isCircle = shape === "circle";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 block">
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
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[1.02]" 
            : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-800"}
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
          accept="image/*"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <>
            <Image 
              src={previewUrl} 
              alt="Preview" 
              fill 
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium">Click or Drag to change</span>
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
              bg-gray-100 dark:bg-gray-800
              ${isDragging ? "bg-blue-100 dark:bg-blue-900 text-blue-500" : ""}
            `}>
              {placeholder === "user" ? (
                <User className={isCircle ? "w-6 h-6" : "w-8 h-8"} />
              ) : (
                <ImageIcon className={isCircle ? "w-6 h-6" : "w-8 h-8"} />
              )}
            </div>
            <div className="text-center">
              <p className={`font-bold text-gray-900 dark:text-gray-100 ${isCircle ? "text-[10px]" : "text-xs"}`}>
                {isCircle ? "Tap / Drop" : "Click or Drop Image"}
              </p>
              {!isCircle && (
                <p className="text-[10px] mt-1 text-gray-500">
                  PNG, JPG or WebP
                </p>
              )}
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[2px] pointer-events-none border-2 border-blue-500 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-500 animate-bounce" />
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
          className="relative z-10 flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:underline transition-all cursor-pointer ml-1 py-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove Image
        </button>
      )}
    </div>
  );
}
