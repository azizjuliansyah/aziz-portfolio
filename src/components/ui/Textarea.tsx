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
  required,
  ...props 
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="text-sm font-semibold text-on-surface/80 ml-1 block"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full rounded-xl border bg-surface-container-low 
          transition-all text-sm p-3 outline-none min-h-[120px] resize-y
          text-on-surface placeholder:text-on-surface/30
          ${error 
            ? "border-error focus:border-error focus:ring-error focus:ring-offset-0 text-error" 
            : "border-outline/10 focus:border-primary focus:ring-primary focus:ring-offset-0"}
          ${className}
        `}
        {...props}
      />
      {error ? (
        <p className="text-xs text-error ml-1 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-on-surface/60 ml-1 italic">{helperText}</p>
      ) : null}
    </div>
  );
}
