import React, { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ 
  label, 
  error, 
  helperText, 
  className = "", 
  id, 
  ...props 
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 block"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full rounded-xl border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 
          focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all 
          text-sm p-3 outline-none border min-h-[120px] resize-y
          placeholder:text-gray-400 dark:placeholder:text-gray-600
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="text-xs text-red-500 ml-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 ml-1">{helperText}</p>
      ) : null}
    </div>
  );
}
